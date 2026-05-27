// scripts/diag-tenants.ts
import 'dotenv/config';
import { prisma } from '../src/lib/db';

async function main() {
  console.log('=== ALL TENANTS ===');
  const tenants = await prisma.tenant.findMany({
    select: { id: true, slug: true, name: true },
  });
  for (const t of tenants) console.log(JSON.stringify(t));

  console.log('\n=== ALL GMAIL CONNECTIONS ===');
  const conns = await prisma.gmailConnection.findMany({
    select: {
      id: true,
      tenantId: true,
      email: true,
      syncEnabled: true,
      lastSyncAt: true,
      lastSyncError: true,
      tokenExpiresAt: true,
    },
  });
  for (const c of conns) {
    const tenant = tenants.find((t) => t.id === c.tenantId);
    console.log(JSON.stringify({ ...c, _tenantSlug: tenant?.slug, _tenantName: tenant?.name }));
  }

  console.log('\n=== ALL DONATION KEYWORDS ===');
  const kws = await prisma.donationKeyword.findMany();
  for (const k of kws) {
    const tenant = tenants.find((t) => t.id === k.tenantId);
    console.log(JSON.stringify({
      id: k.id,
      tenantId: k.tenantId,
      _tenantSlug: tenant?.slug,
      keyword: k.keyword,
      campaignName: k.campaignName,
      isActive: k.isActive,
    }));
  }

  console.log('\n=== ALL USERS (with role) ===');
  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true, tenantId: true },
  });
  for (const u of users) {
    const tenant = tenants.find((t) => t.id === u.tenantId);
    console.log(JSON.stringify({ ...u, _tenantSlug: tenant?.slug }));
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
