// lib/cashflow-service.ts
// השכבה המשלבת - מחברת בין נתוני Meta לנתוני תרומות
// זו הליבה של פאזה 3

import { prisma } from './db';
import { getCampaigns, getDateRange } from './meta-api';
import { metaCampaignMatchesKeyword } from './donations-service';
import type {
  CashflowSummary,
  DailyCashflow,
  CampaignCashflow,
} from './feature-types';

// ============================================
// 1. חישוב תזרים יומי
// ============================================

export async function getCashflowSummary(
  tenantId: string,
  rangeOrDays: number | { since: Date; until: Date } = 30
): Promise<CashflowSummary | null> {
  const { since, until, daysBack } = (() => {
    if (typeof rangeOrDays === 'number') {
      const until = new Date();
      until.setHours(23, 59, 59, 999);
      const since = new Date();
      since.setDate(since.getDate() - (rangeOrDays - 1));
      since.setHours(0, 0, 0, 0);
      return { since, until, daysBack: rangeOrDays };
    }
    const ms = rangeOrDays.until.getTime() - rangeOrDays.since.getTime();
    const days = Math.max(1, Math.round(ms / 86400000) + 1);
    return { ...rangeOrDays, daysBack: days };
  })();

  // 1. קבל את ה-tenant
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: {
      metaAdAccountId: true,
    },
  });

  if (!tenant) return null;

  const dateRange = {
    since: since.toISOString().split('T')[0],
    until: until.toISOString().split('T')[0],
  };
  // legacy compat — getDateRange would return same shape
  void getDateRange;

  // 2. שלוף תרומות + keywords + קמפייני Meta (במקביל)
  const [donations, keywords, allMetaCampaigns] = await Promise.all([
    prisma.donation.findMany({
      where: {
        tenantId,
        emailDate: {
          gte: new Date(dateRange.since),
          lte: new Date(dateRange.until + 'T23:59:59'),
        },
      },
      include: { keyword: true },
    }),
    prisma.donationKeyword.findMany({
      where: { tenantId, isActive: true },
    }),
    tenant.metaAdAccountId
      ? getCampaigns(tenant.metaAdAccountId, dateRange).catch(() => [])
      : Promise.resolve([]),
  ]);

  // 3. סנן רק קמפייני Meta המקושרים ל-keyword (לפי השוואת שם)
  // קמפיינים שלא מתאימים לאף keyword מתעלמים מהם בכל החישובים.
  type MetaCampaignType = (typeof allMetaCampaigns)[number];
  const linkedMetaCampaigns: Array<{
    meta: MetaCampaignType;
    keyword: (typeof keywords)[number];
  }> = [];
  for (const metaCampaign of allMetaCampaigns) {
    // התאמה לפי מילת המפתח (למשל "מטרנה") שמופיעה בשם קמפיין המודעות, ובנוסף לפי השם המלא.
    const linkedKeyword = keywords.find(
      (k) =>
        metaCampaignMatchesKeyword(metaCampaign.name, k.keyword) ||
        metaCampaignMatchesKeyword(metaCampaign.name, k.campaignName)
    );
    if (linkedKeyword) {
      linkedMetaCampaigns.push({ meta: metaCampaign, keyword: linkedKeyword });
    }
  }

  // 4. בנה מפת תרומות יומיות
  const donationsByDate = new Map<string, { amount: number; count: number }>();
  for (const d of donations) {
    const dateKey = d.emailDate.toISOString().split('T')[0];
    const existing = donationsByDate.get(dateKey) || { amount: 0, count: 0 };
    donationsByDate.set(dateKey, {
      amount: existing.amount + d.amount,
      count: existing.count + 1,
    });
  }

  // 5. סך הוצאות יומי = רק מהקמפיינים המקושרים.
  // נחלק את ה-spend הכללי של כל קמפיין באופן יחסי לימים — כיוון שאין לנו
  // breakdown יומי per-campaign, נחשב פרופורציונלית מתוך ה-totalSpend היחסי.
  const totalLinkedSpend = linkedMetaCampaigns.reduce(
    (sum, c) => sum + c.meta.spend,
    0
  );

  const daily: DailyCashflow[] = [];
  const cursor = new Date(since);
  cursor.setHours(0, 0, 0, 0);
  while (cursor <= until) {
    const date = new Date(cursor);
    cursor.setDate(cursor.getDate() + 1);
    const dateKey = date.toISOString().split('T')[0];

    // כיוון שאין לנו daily-per-campaign, אנחנו מחלקים שווה (לא אידיאלי
    // אבל בסדר עד שנשפר ל-API call נפרד). לטווח קצר זה נכון בקירוב.
    const metaSpend = totalLinkedSpend / Math.max(daysBack, 1);
    const donationData = donationsByDate.get(dateKey) || { amount: 0, count: 0 };

    const netProfit = donationData.amount - metaSpend;
    const roas = metaSpend > 0 ? donationData.amount / metaSpend : 0;

    daily.push({
      date: dateKey,
      metaSpend,
      donationsCount: donationData.count,
      donationsAmount: donationData.amount,
      netProfit,
      roas,
      isPositive: netProfit > 0,
    });
  }

  // 6. בנה תזרים לפי קמפיין — רק על המקושרים
  const byCampaign: CampaignCashflow[] = [];

  for (const { meta: metaCampaign, keyword } of linkedMetaCampaigns) {
    const linkedDonations = donations.filter(
      (d) => d.keywordId === keyword.id
    );
    const donationsAmount = linkedDonations.reduce((sum, d) => sum + d.amount, 0);
    const donationsCount = linkedDonations.length;

    const netProfit = donationsAmount - metaCampaign.spend;
    const roas = metaCampaign.spend > 0 ? donationsAmount / metaCampaign.spend : 0;

    let status: 'star' | 'good' | 'weak' | 'losing';
    if (roas >= 5) status = 'star';
    else if (roas >= 2) status = 'good';
    else if (roas >= 1) status = 'weak';
    else status = 'losing';

    byCampaign.push({
      campaignId: metaCampaign.id,
      campaignName: metaCampaign.name,
      metaSpend: metaCampaign.spend,
      donationsAmount,
      donationsCount,
      netProfit,
      roas,
      status,
    });
  }

  // 7. הוסף גם keywords שיש להם תרומות אבל אף קמפיין Meta לא תואם להם בשם
  const linkedKeywordIds = new Set(linkedMetaCampaigns.map((c) => c.keyword.id));
  for (const keyword of keywords) {
    if (linkedKeywordIds.has(keyword.id)) continue;

    const keywordDonations = donations.filter((d) => d.keywordId === keyword.id);
    if (keywordDonations.length === 0) continue;

    const donationsAmount = keywordDonations.reduce((sum, d) => sum + d.amount, 0);

    byCampaign.push({
      campaignId: `keyword_${keyword.id}`,
      campaignName: keyword.campaignName,
      metaSpend: 0,
      donationsAmount,
      donationsCount: keywordDonations.length,
      netProfit: donationsAmount,
      roas: 0,
      status: 'star',
    });
  }

  byCampaign.sort((a, b) => b.donationsAmount - a.donationsAmount);

  // 8. סיכומים — רק מהקמפיינים המקושרים
  const totalSpend = totalLinkedSpend;
  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
  const netProfit = totalDonations - totalSpend;
  const roas = totalSpend > 0 ? totalDonations / totalSpend : 0;
  const profitPercentage = totalDonations > 0 ? (netProfit / totalDonations) * 100 : 0;

  // 7. תובנות אוטומטיות
  const insights = generateInsights(daily, byCampaign, {
    totalSpend,
    totalDonations,
    roas,
  });

  return {
    totalSpend,
    totalDonations,
    netProfit,
    roas,
    profitPercentage,
    daily,
    byCampaign,
    insights,
  };
}

// ============================================
// 2. תובנות אוטומטיות
// ============================================

function generateInsights(
  daily: DailyCashflow[],
  byCampaign: CampaignCashflow[],
  totals: { totalSpend: number; totalDonations: number; roas: number }
): string[] {
  const insights: string[] = [];

  // תובנה 1: ROAS כללי
  if (totals.roas >= 5) {
    insights.push(
      `🔥 ROAS מצוין של ${totals.roas.toFixed(1)}x - על כל ₪1 מקבלים ₪${totals.roas.toFixed(1)}`
    );
  } else if (totals.roas < 1 && totals.totalSpend > 0) {
    insights.push(
      `⚠️ הקמפיין כרגע בהפסד - הוצאת ₪${totals.totalSpend.toFixed(0)} וקיבלת ₪${totals.totalDonations.toFixed(0)}`
    );
  }

  // תובנה 2: קמפיין מצטיין
  const topCampaign = byCampaign.find((c) => c.status === 'star');
  if (topCampaign && topCampaign.metaSpend > 0) {
    insights.push(
      `⭐ הקמפיין "${topCampaign.campaignName}" עם ROAS ${topCampaign.roas.toFixed(1)}x - שקול להגדיל תקציב`
    );
  }

  // תובנה 3: קמפיין הפסדי
  const losingCampaign = byCampaign.find(
    (c) => c.status === 'losing' && c.metaSpend > 100
  );
  if (losingCampaign) {
    insights.push(
      `🔴 הקמפיין "${losingCampaign.campaignName}" בהפסד - שקול להשהות או לשנות`
    );
  }

  // תובנה 4: ניתוח ימי השבוע
  const dayOfWeekData = analyzeDayOfWeek(daily);
  if (dayOfWeekData.bestDay && dayOfWeekData.worstDay) {
    insights.push(
      `📅 הימים הכי רווחיים: ${dayOfWeekData.bestDay}. הכי חלשים: ${dayOfWeekData.worstDay}`
    );
  }

  // תובנה 5: מגמה
  if (daily.length >= 14) {
    const recentWeek = daily.slice(-7);
    const previousWeek = daily.slice(-14, -7);
    const recentAvg = recentWeek.reduce((s, d) => s + d.donationsAmount, 0) / 7;
    const previousAvg = previousWeek.reduce((s, d) => s + d.donationsAmount, 0) / 7;
    
    if (previousAvg > 0) {
      const change = ((recentAvg - previousAvg) / previousAvg) * 100;
      if (change > 20) {
        insights.push(`📈 התרומות עולות! עליה של ${change.toFixed(0)}% השבוע`);
      } else if (change < -20) {
        insights.push(`📉 שים לב - התרומות ירדו ב-${Math.abs(change).toFixed(0)}% השבוע`);
      }
    }
  }

  return insights;
}

function analyzeDayOfWeek(daily: DailyCashflow[]) {
  const dayNames = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  const byDay = new Map<number, { total: number; count: number }>();

  for (const day of daily) {
    const date = new Date(day.date);
    const dayOfWeek = date.getDay();
    const existing = byDay.get(dayOfWeek) || { total: 0, count: 0 };
    byDay.set(dayOfWeek, {
      total: existing.total + day.donationsAmount,
      count: existing.count + 1,
    });
  }

  let bestDay = '';
  let worstDay = '';
  let bestAvg = 0;
  let worstAvg = Infinity;

  for (const [dayNum, data] of byDay.entries()) {
    if (data.count === 0) continue;
    const avg = data.total / data.count;
    
    if (avg > bestAvg) {
      bestAvg = avg;
      bestDay = dayNames[dayNum];
    }
    if (avg < worstAvg) {
      worstAvg = avg;
      worstDay = dayNames[dayNum];
    }
  }

  return { bestDay, worstDay };
}
