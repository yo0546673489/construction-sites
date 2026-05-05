// app/api/gmail/connect/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getEffectiveTenantId, type SessionUser } from '@/lib/auth-helpers';
import { getOAuthUrl } from '@/lib/gmail-api';
import crypto from 'crypto';

export async function GET() {
  const session = await auth();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.pro-digital.org';

  if (!session?.user) {
    return NextResponse.redirect(new URL('/admin/login', baseUrl));
  }

  const tenantId = await getEffectiveTenantId({
    id: session.user.id,
    email: session.user.email ?? '',
    name: session.user.name ?? null,
    role: session.user.role,
    tenantId: session.user.tenantId,
  } as SessionUser);

  if (!tenantId) {
    return NextResponse.redirect(new URL('/admin/tenants', baseUrl));
  }

  // יצירת state פרמטר עם tenant ID + random string
  const stateData = {
    tenantId,
    nonce: crypto.randomBytes(16).toString('hex'),
  };

  const state = Buffer.from(JSON.stringify(stateData)).toString('base64url');
  const oauthUrl = getOAuthUrl(state);

  return NextResponse.redirect(oauthUrl);
}
