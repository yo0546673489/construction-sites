// app/api/gmail/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getEffectiveTenantId, type SessionUser } from '@/lib/auth-helpers';
import {
  exchangeCodeForTokens,
  getUserEmail,
  saveGmailConnection,
} from '@/lib/gmail-api';

export async function GET(req: NextRequest) {
  const session = await auth();
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.pro-digital.org';

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

  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state');

  // המשתמש ביטל
  if (error) {
    return NextResponse.redirect(
      new URL('/admin/settings/donations?error=cancelled', baseUrl)
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      new URL('/admin/settings/donations?error=missing_params', baseUrl)
    );
  }

  try {
    // אימות ה-state
    const stateData = JSON.parse(
      Buffer.from(state, 'base64url').toString('utf-8')
    ) as { tenantId: string; nonce: string };

    if (stateData.tenantId !== tenantId) {
      throw new Error('State mismatch');
    }

    // החלף code לטוקנים
    const tokens = await exchangeCodeForTokens(code);

    // קבל את כתובת המייל
    const email = await getUserEmail(tokens.access_token);

    // שמור ב-DB
    await saveGmailConnection(tenantId, tokens, email);

    return NextResponse.redirect(
      new URL('/admin/settings/donations?success=1', baseUrl)
    );
  } catch (e) {
    console.error('OAuth callback error:', e);
    const message = e instanceof Error ? e.message : 'unknown';
    return NextResponse.redirect(
      new URL(
        `/admin/settings/donations?error=${encodeURIComponent(message)}`,
        baseUrl
      )
    );
  }
}
