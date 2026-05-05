// lib/types.ts
// טיפוסים מרכזיים לכל הפיצ'ר

// ========================================
// Meta API Types
// ========================================

export type MetaCampaignStatus = 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED';

export type MetaObjective =
  | 'OUTCOME_LEADS'
  | 'OUTCOME_SALES'
  | 'OUTCOME_TRAFFIC'
  | 'OUTCOME_AWARENESS'
  | 'OUTCOME_ENGAGEMENT'
  | 'OUTCOME_APP_PROMOTION';

export interface MetaInsightAction {
  action_type: string;
  value: string;
}

export interface MetaInsight {
  spend?: string;
  impressions?: string;
  clicks?: string;
  ctr?: string;
  cpc?: string;
  cpm?: string;
  reach?: string;
  frequency?: string;
  actions?: MetaInsightAction[];
  cost_per_action_type?: MetaInsightAction[];
  date_start?: string;
  date_stop?: string;
}

export interface MetaCampaign {
  id: string;
  name: string;
  status: MetaCampaignStatus;
  objective: MetaObjective;
  daily_budget?: string;
  lifetime_budget?: string;
  created_time: string;
  insights?: { data: MetaInsight[] };
}

export interface CampaignSummary {
  id: string;
  name: string;
  status: MetaCampaignStatus;
  objective: MetaObjective;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  leads: number;
  costPerLead: number;
  dailyBudget: number;
}

export interface AccountSummary {
  totalSpend: number;
  totalImpressions: number;
  totalClicks: number;
  totalLeads: number;
  averageCPL: number;
  averageCPC: number;
  averageCTR: number;
  dailyData: Array<{
    date: string;
    spend: number;
    leads: number;
    clicks: number;
    impressions: number;
  }>;
}

export interface DateRange {
  since: string;
  until: string;
}

// ========================================
// Donations Types
// ========================================

export interface ParsedDonation {
  amount: number;
  currency: string;
  donorName?: string;
  donorPhone?: string;
  donorEmail?: string;
  paymentMethod?: string;
  matchedKeyword?: string;
  parserSource: string;
  needsReview: boolean;
  rawSnippet: string;
}

export interface DonationSummary {
  totalAmount: number;
  totalCount: number;
  averageAmount: number;
  uniqueDonors: number;
  byCampaign: Array<{
    keywordId: string;
    keyword: string;
    campaignName: string;
    color: string;
    amount: number;
    count: number;
  }>;
  dailyData: Array<{
    date: string;
    amount: number;
    count: number;
  }>;
  recentDonations: Array<{
    id: string;
    amount: number;
    donorName: string | null;
    paymentMethod: string | null;
    campaignName: string | null;
    emailDate: Date;
  }>;
}

// ========================================
// Cashflow Types (פאזה 3)
// ========================================

export interface DailyCashflow {
  date: string;
  metaSpend: number;
  donationsCount: number;
  donationsAmount: number;
  netProfit: number;
  roas: number;
  isPositive: boolean;
}

export interface CampaignCashflow {
  campaignId: string;
  campaignName: string;
  metaSpend: number;
  donationsAmount: number;
  donationsCount: number;
  netProfit: number;
  roas: number;
  status: 'star' | 'good' | 'weak' | 'losing';
}

export interface CashflowSummary {
  totalSpend: number;
  totalDonations: number;
  netProfit: number;
  roas: number;
  profitPercentage: number;
  daily: DailyCashflow[];
  byCampaign: CampaignCashflow[];
  insights: string[]; // תובנות אוטומטיות
}

// ========================================
// Shareable Report Types
// ========================================

export interface PublicReportData {
  title: string;
  tenantName: string;
  dateRange: { from: Date; to: Date };
  summary: CashflowSummary;
  showSpend: boolean;
  showDonations: boolean;
  showRoas: boolean;
  showCampaigns: boolean;
}
