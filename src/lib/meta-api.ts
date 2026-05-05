// lib/meta-api.ts
// Meta Marketing API Client - System User Token Mode

import type {
  MetaCampaign,
  MetaInsight,
  CampaignSummary,
  AccountSummary,
  DateRange,
} from './feature-types';

const API_VERSION = process.env.META_API_VERSION || 'v21.0';
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`;

interface MetaApiError {
  error: { message: string; type: string; code: number };
}

function ensureToken(): string {
  const token = process.env.META_SYSTEM_USER_TOKEN;
  if (!token) {
    throw new Error('META_SYSTEM_USER_TOKEN לא הוגדר ב-.env');
  }
  return token;
}

function ensureAdAccountFormat(adAccountId: string): string {
  return adAccountId.startsWith('act_') ? adAccountId : `act_${adAccountId}`;
}

async function metaFetch<T>(url: string, revalidate = 300): Promise<T> {
  const res = await fetch(url, { next: { revalidate } });

  if (!res.ok) {
    const errorBody = (await res.json().catch(() => null)) as MetaApiError | null;
    throw new Error(errorBody?.error?.message || `Meta API error: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ---- Date Helpers ----

export function getDateRange(days: number): DateRange {
  const until = new Date();
  const since = new Date();
  since.setDate(since.getDate() - days);

  return {
    since: since.toISOString().split('T')[0],
    until: until.toISOString().split('T')[0],
  };
}

// ---- Lead Extraction ----

const LEAD_ACTION_TYPES = [
  'lead',
  'onsite_conversion.lead_grouped',
  'offsite_conversion.fb_pixel_lead',
];

function extractLeadCount(insight: MetaInsight): number {
  if (!insight.actions) return 0;
  return insight.actions
    .filter((a) => LEAD_ACTION_TYPES.includes(a.action_type))
    .reduce((sum, a) => sum + (parseInt(a.value, 10) || 0), 0);
}

function extractCostPerLead(insight: MetaInsight): number {
  if (!insight.cost_per_action_type) return 0;
  const action = insight.cost_per_action_type.find((a) =>
    LEAD_ACTION_TYPES.includes(a.action_type)
  );
  return action ? parseFloat(action.value) || 0 : 0;
}

// ---- Public API ----

export async function getCampaigns(
  adAccountId: string,
  dateRange: DateRange
): Promise<CampaignSummary[]> {
  const token = ensureToken();
  const accountId = ensureAdAccountFormat(adAccountId);

  const insightsFields = 'spend,impressions,clicks,ctr,cpc,actions,cost_per_action_type';
  const fields = [
    'id', 'name', 'status', 'objective', 'daily_budget', 'lifetime_budget', 'created_time',
    `insights.time_range({"since":"${dateRange.since}","until":"${dateRange.until}"}){${insightsFields}}`,
  ].join(',');

  const url = `${BASE_URL}/${accountId}/campaigns?fields=${fields}&limit=100&access_token=${token}`;
  const response = await metaFetch<{ data: MetaCampaign[] }>(url);

  return response.data.map((campaign) => {
    const insight = campaign.insights?.data[0];
    const leads = insight ? extractLeadCount(insight) : 0;

    return {
      id: campaign.id,
      name: campaign.name,
      status: campaign.status,
      objective: campaign.objective,
      spend: parseFloat(insight?.spend || '0'),
      impressions: parseInt(insight?.impressions || '0', 10),
      clicks: parseInt(insight?.clicks || '0', 10),
      ctr: parseFloat(insight?.ctr || '0'),
      cpc: parseFloat(insight?.cpc || '0'),
      leads,
      costPerLead: insight ? extractCostPerLead(insight) : 0,
      dailyBudget: parseFloat(campaign.daily_budget || '0') / 100,
    };
  });
}

export async function getAccountSummary(
  adAccountId: string,
  dateRange: DateRange
): Promise<AccountSummary> {
  const token = ensureToken();
  const accountId = ensureAdAccountFormat(adAccountId);

  const fields = 'spend,impressions,clicks,ctr,cpc,actions,cost_per_action_type';
  const timeRange = `time_range={"since":"${dateRange.since}","until":"${dateRange.until}"}`;

  const summaryUrl = `${BASE_URL}/${accountId}/insights?fields=${fields}&${timeRange}&access_token=${token}`;
  const dailyUrl = `${BASE_URL}/${accountId}/insights?fields=${fields}&${timeRange}&time_increment=1&access_token=${token}`;

  const [summaryRes, dailyRes] = await Promise.all([
    metaFetch<{ data: MetaInsight[] }>(summaryUrl),
    metaFetch<{ data: MetaInsight[] }>(dailyUrl),
  ]);

  const summary = summaryRes.data[0] || {};
  const totalLeads = extractLeadCount(summary);
  const totalSpend = parseFloat(summary.spend || '0');

  return {
    totalSpend,
    totalImpressions: parseInt(summary.impressions || '0', 10),
    totalClicks: parseInt(summary.clicks || '0', 10),
    totalLeads,
    averageCPL: totalLeads > 0 ? totalSpend / totalLeads : 0,
    averageCPC: parseFloat(summary.cpc || '0'),
    averageCTR: parseFloat(summary.ctr || '0'),
    dailyData: dailyRes.data.map((day) => ({
      date: day.date_start || '',
      spend: parseFloat(day.spend || '0'),
      leads: extractLeadCount(day),
      clicks: parseInt(day.clicks || '0', 10),
      impressions: parseInt(day.impressions || '0', 10),
    })),
  };
}

export async function verifyAdAccountAccess(
  adAccountId: string
): Promise<{ ok: true; name: string } | { ok: false; error: string }> {
  try {
    const token = ensureToken();
    const accountId = ensureAdAccountFormat(adAccountId);
    const url = `${BASE_URL}/${accountId}?fields=name,currency&access_token=${token}`;
    const res = await fetch(url);

    if (!res.ok) {
      const error = (await res.json()) as MetaApiError;
      return { ok: false, error: error.error.message };
    }

    const data = (await res.json()) as { name: string };
    return { ok: true, name: data.name };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'שגיאה לא ידועה' };
  }
}
