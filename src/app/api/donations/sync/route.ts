// app/api/donations/sync/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getEffectiveTenantId, type SessionUser } from '@/lib/auth-helpers';
import { syncTenantDonations } from '@/lib/donations-service';

export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const tenantId = await getEffectiveTenantId({
    id: session.user.id,
    email: session.user.email ?? '',
    name: session.user.name ?? null,
    role: session.user.role,
    tenantId: session.user.tenantId,
  } as SessionUser);

  if (!tenantId) {
    return NextResponse.json(
      { error: 'No active tenant for this user' },
      { status: 400 }
    );
  }

  const result = await syncTenantDonations(tenantId, 7);
  return NextResponse.json(result);
}

// Cron route — סנכרון אוטומטי שעתי. הגנה ב-CRON_SECRET ב-header.
export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  const expected = `Bearer ${process.env.CRON_SECRET}`;

  if (!process.env.CRON_SECRET || authHeader !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // סנכרן את כל ה-tenants עם Gmail מחובר
  const { prisma } = await import('@/lib/db');
  const tenants = await prisma.gmailConnection.findMany({
    where: { syncEnabled: true },
    select: { tenantId: true },
  });

  const results = await Promise.allSettled(
    tenants.map((t) => syncTenantDonations(t.tenantId, 2))
  );

  const summary = {
    total: tenants.length,
    success: results.filter((r) => r.status === 'fulfilled').length,
    failed: results.filter((r) => r.status === 'rejected').length,
  };

  return NextResponse.json(summary);
}
