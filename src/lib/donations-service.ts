// lib/donations-service.ts
// השכבה העסקית של תרומות - מתאם בין Gmail ל-DB

import { prisma } from './db';
import { 
  getValidAccessToken, 
  searchMessages, 
  getMessage,
  buildSearchQuery,
} from './gmail-api';
import { parseEmail } from './donation-parser';
import type { DonationSummary } from './feature-types';

// ============================================
// 1. סנכרון מיילים לטננט
// ============================================

export interface SyncResult {
  success: boolean;
  newDonations: number;
  totalProcessed: number;
  errors: string[];
}

export async function syncTenantDonations(
  tenantId: string,
  daysBack = 7
): Promise<SyncResult> {
  const result: SyncResult = {
    success: false,
    newDonations: 0,
    totalProcessed: 0,
    errors: [],
  };

  try {
    // 1. קבל access token תקף
    const accessToken = await getValidAccessToken(tenantId);
    if (!accessToken) {
      result.errors.push('Gmail לא מחובר או טוקן לא תקין');
      return result;
    }

    // 2. שלוף את מילות הקוד הפעילות
    const keywords = await prisma.donationKeyword.findMany({
      where: { tenantId, isActive: true },
    });

    if (keywords.length === 0) {
      result.errors.push('לא הוגדרו מילות מפתח לסנכרון');
      return result;
    }

    // 3. בנה query לחיפוש
    const query = buildSearchQuery(
      keywords.map((k) => k.keyword),
      daysBack
    );

    // 4. חפש מיילים
    const messages = await searchMessages(accessToken, query, 100);
    result.totalProcessed = messages.length;

    if (messages.length === 0) {
      result.success = true;
      await updateLastSync(tenantId);
      return result;
    }

    // 5. שליפת מיילים שכבר נשמרו (למניעת כפילויות)
    const existingIds = new Set(
      (
        await prisma.donation.findMany({
          where: {
            tenantId,
            emailMessageId: { in: messages.map((m) => m.id) },
          },
          select: { emailMessageId: true },
        })
      ).map((d) => d.emailMessageId)
    );

    // 6. עיבוד כל מייל חדש
    for (const message of messages) {
      if (existingIds.has(message.id)) continue;

      try {
        const fullMessage = await getMessage(accessToken, message.id);
        if (!fullMessage) continue;

        const parsed = parseEmail({
          subject: fullMessage.subject,
          body: fullMessage.body,
          from: fullMessage.from,
          date: fullMessage.date,
          keywords: keywords.map((k) => ({
            id: k.id,
            keyword: k.keyword,
            campaignName: k.campaignName,
          })),
        });

        if (!parsed) continue;

        // מצא את ה-keyword שהותאם
        const matchedKeyword = keywords.find(
          (k) => k.keyword === parsed.matchedKeyword
        );

        await prisma.donation.create({
          data: {
            tenantId,
            keywordId: matchedKeyword?.id || null,
            amount: parsed.amount,
            currency: parsed.currency,
            donorName: parsed.donorName,
            donorPhone: parsed.donorPhone,
            paymentMethod: parsed.paymentMethod,
            emailSubject: fullMessage.subject,
            emailFrom: fullMessage.from,
            emailDate: fullMessage.date,
            emailMessageId: message.id,
            rawSnippet: parsed.rawSnippet,
            parserSource: parsed.parserSource,
            needsReview: parsed.needsReview,
          },
        });

        result.newDonations++;
      } catch (e) {
        result.errors.push(
          `שגיאה במייל ${message.id}: ${e instanceof Error ? e.message : 'unknown'}`
        );
      }
    }

    await updateLastSync(tenantId);
    result.success = true;
    return result;
  } catch (e) {
    result.errors.push(e instanceof Error ? e.message : 'Sync failed');
    return result;
  }
}

async function updateLastSync(tenantId: string) {
  await prisma.gmailConnection.update({
    where: { tenantId },
    data: { lastSyncAt: new Date() },
  });
}

// ============================================
// 2. שליפת סיכום תרומות לדשבורד
// ============================================

export async function getDonationSummary(
  tenantId: string,
  daysBack = 30
): Promise<DonationSummary> {
  const since = new Date();
  since.setDate(since.getDate() - daysBack);

  const donations = await prisma.donation.findMany({
    where: {
      tenantId,
      emailDate: { gte: since },
    },
    include: {
      keyword: true,
    },
    orderBy: { emailDate: 'desc' },
  });

  // סיכומים
  const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
  const totalCount = donations.length;
  const averageAmount = totalCount > 0 ? totalAmount / totalCount : 0;
  
  // תורמים ייחודיים
  const uniqueDonors = new Set(
    donations
      .filter((d) => d.donorName || d.donorPhone)
      .map((d) => d.donorPhone || d.donorName)
  ).size;

  // פילוח לפי קמפיין
  const byCampaignMap = new Map<
    string,
    {
      keywordId: string;
      keyword: string;
      campaignName: string;
      color: string;
      amount: number;
      count: number;
    }
  >();

  for (const donation of donations) {
    if (!donation.keyword) continue;
    
    const key = donation.keyword.id;
    const existing = byCampaignMap.get(key);
    
    if (existing) {
      existing.amount += donation.amount;
      existing.count++;
    } else {
      byCampaignMap.set(key, {
        keywordId: donation.keyword.id,
        keyword: donation.keyword.keyword,
        campaignName: donation.keyword.campaignName,
        color: donation.keyword.color,
        amount: donation.amount,
        count: 1,
      });
    }
  }

  const byCampaign = Array.from(byCampaignMap.values()).sort(
    (a, b) => b.amount - a.amount
  );

  // נתונים יומיים
  const dailyMap = new Map<string, { amount: number; count: number }>();
  
  for (const donation of donations) {
    const dateKey = donation.emailDate.toISOString().split('T')[0];
    const existing = dailyMap.get(dateKey);
    
    if (existing) {
      existing.amount += donation.amount;
      existing.count++;
    } else {
      dailyMap.set(dateKey, { amount: donation.amount, count: 1 });
    }
  }

  // יצירת מערך מלא של ימים (גם ימים בלי תרומות)
  const dailyData: Array<{ date: string; amount: number; count: number }> = [];
  for (let i = daysBack - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().split('T')[0];
    const data = dailyMap.get(dateKey) || { amount: 0, count: 0 };
    dailyData.push({ date: dateKey, ...data });
  }

  // 10 תרומות אחרונות
  const recentDonations = donations.slice(0, 10).map((d) => ({
    id: d.id,
    amount: d.amount,
    donorName: d.donorName,
    paymentMethod: d.paymentMethod,
    campaignName: d.keyword?.campaignName || null,
    emailDate: d.emailDate,
  }));

  return {
    totalAmount,
    totalCount,
    averageAmount,
    uniqueDonors,
    byCampaign,
    dailyData,
    recentDonations,
  };
}

// ============================================
// 3. ניהול מילות מפתח
// ============================================

export async function createKeyword(
  tenantId: string,
  data: {
    keyword: string;
    campaignName: string;
    metaCampaignId?: string;
    color?: string;
  }
) {
  return prisma.donationKeyword.create({
    data: {
      tenantId,
      keyword: data.keyword.trim(),
      campaignName: data.campaignName.trim(),
      metaCampaignId: data.metaCampaignId,
      color: data.color || '#3b82f6',
    },
  });
}

export async function updateKeyword(
  id: string,
  data: Partial<{
    keyword: string;
    campaignName: string;
    metaCampaignId: string;
    color: string;
    isActive: boolean;
  }>
) {
  return prisma.donationKeyword.update({
    where: { id },
    data,
  });
}

export async function deleteKeyword(id: string) {
  return prisma.donationKeyword.delete({
    where: { id },
  });
}
