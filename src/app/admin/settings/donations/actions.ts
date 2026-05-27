// app/admin/settings/donations/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { requireTenantUser } from '@/lib/auth-helpers';
import { prisma } from '@/lib/db';
import {
  createKeyword,
  updateKeyword,
  deleteKeyword,
} from '@/lib/donations-service';

export async function disconnectGmail() {
  const { tenant } = await requireTenantUser();

  await prisma.gmailConnection.deleteMany({
    where: { tenantId: tenant.id },
  });

  revalidatePath('/admin/settings/donations');
}

export async function createKeywordAction(data: {
  keyword: string;
  campaignName: string;
  color?: string;
}) {
  const { tenant } = await requireTenantUser();

  await createKeyword(tenant.id, {
    keyword: data.keyword,
    campaignName: data.campaignName,
    color: data.color,
  });

  revalidatePath('/admin/settings/donations');
  revalidatePath('/admin/campaigns');
  revalidatePath('/admin/reports');
}

export async function updateKeywordAction(
  id: string,
  data: {
    keyword?: string;
    campaignName?: string;
    color?: string;
    isActive?: boolean;
  }
) {
  const { tenant } = await requireTenantUser();

  // וודא שה-keyword שייך ל-tenant של המשתמש
  const keyword = await prisma.donationKeyword.findUnique({
    where: { id },
    select: { tenantId: true },
  });

  if (!keyword || keyword.tenantId !== tenant.id) {
    throw new Error('Unauthorized');
  }

  await updateKeyword(id, data);
  revalidatePath('/admin/settings/donations');
  revalidatePath('/admin/campaigns');
  revalidatePath('/admin/reports');
}

export async function deleteKeywordAction(id: string) {
  const { tenant } = await requireTenantUser();

  const keyword = await prisma.donationKeyword.findUnique({
    where: { id },
    select: { tenantId: true },
  });

  if (!keyword || keyword.tenantId !== tenant.id) {
    throw new Error('Unauthorized');
  }

  await deleteKeyword(id);
  revalidatePath('/admin/settings/donations');
}
