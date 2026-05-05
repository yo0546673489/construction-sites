// app/admin/reports/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { requireTenantUser } from '@/lib/auth-helpers';
import { prisma } from '@/lib/db';
import { generateShareToken } from '@/lib/encryption';

export interface CreateReportInput {
  title: string;
  showSpend: boolean;
  showDonations: boolean;
  showRoas: boolean;
  showCampaigns: boolean;
  expiresInDays?: number;
  password?: string;
  dateRangeDays: number;
}

export async function createShareableReport(input: CreateReportInput) {
  const { tenant } = await requireTenantUser();

  const expiresAt = input.expiresInDays
    ? new Date(Date.now() + input.expiresInDays * 24 * 60 * 60 * 1000)
    : null;

  const report = await prisma.shareableReport.create({
    data: {
      tenantId: tenant.id,
      token: generateShareToken(),
      title: input.title,
      showSpend: input.showSpend,
      showDonations: input.showDonations,
      showRoas: input.showRoas,
      showCampaigns: input.showCampaigns,
      password: input.password || null,
      expiresAt,
      dateRangeDays: input.dateRangeDays,
    },
  });

  revalidatePath('/admin/reports');

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.pro-digital.org';
  return {
    token: report.token,
    url: `${baseUrl}/r/${report.token}`,
  };
}

export async function deleteReport(reportId: string) {
  const { tenant } = await requireTenantUser();

  await prisma.shareableReport.deleteMany({
    where: {
      id: reportId,
      tenantId: tenant.id, // וודא בעלות
    },
  });

  revalidatePath('/admin/reports');
}

export async function getReports() {
  const { tenant } = await requireTenantUser();

  return prisma.shareableReport.findMany({
    where: { tenantId: tenant.id },
    orderBy: { createdAt: 'desc' },
  });
}
