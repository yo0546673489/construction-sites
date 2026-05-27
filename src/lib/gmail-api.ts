// lib/gmail-api.ts
// Gmail API Client + OAuth Flow

import { encrypt, decrypt } from './encryption';

const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1';
const OAUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';

const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/userinfo.email',
];

// ============================================
// 1. OAuth Flow
// ============================================

export function getOAuthUrl(state: string): string {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    throw new Error('GOOGLE_CLIENT_ID או GOOGLE_REDIRECT_URI חסר ב-.env');
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: SCOPES.join(' '),
    access_type: 'offline',
    prompt: 'consent', // חובה לקבל refresh_token
    state,
  });

  return `${OAUTH_URL}?${params.toString()}`;
}

export interface OAuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export async function exchangeCodeForTokens(code: string): Promise<OAuthTokens> {
  const clientId = process.env.GOOGLE_CLIENT_ID!;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI!;

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to exchange code: ${error}`);
  }

  return res.json();
}

export async function refreshAccessToken(
  refreshToken: string
): Promise<{ access_token: string; expires_in: number }> {
  const clientId = process.env.GOOGLE_CLIENT_ID!;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to refresh token: ${error}`);
  }

  return res.json();
}

// ============================================
// 2. קבלת אימייל המשתמש
// ============================================

export async function getUserEmail(accessToken: string): Promise<string> {
  const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) throw new Error('Failed to get user email');

  const data = (await res.json()) as { email: string };
  return data.email;
}

// ============================================
// 3. ניהול חיבור Gmail (DB)
// ============================================

import { prisma } from './db';

export async function saveGmailConnection(
  tenantId: string,
  tokens: OAuthTokens,
  email: string
) {
  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

  await prisma.gmailConnection.upsert({
    where: { tenantId },
    create: {
      tenantId,
      email,
      accessToken: encrypt(tokens.access_token),
      refreshToken: encrypt(tokens.refresh_token),
      tokenExpiresAt: expiresAt,
    },
    update: {
      email,
      accessToken: encrypt(tokens.access_token),
      refreshToken: encrypt(tokens.refresh_token),
      tokenExpiresAt: expiresAt,
      syncEnabled: true,
      lastSyncError: null,
    },
  });
}

export async function getValidAccessToken(tenantId: string): Promise<string | null> {
  const connection = await prisma.gmailConnection.findUnique({
    where: { tenantId },
  });

  if (!connection || !connection.syncEnabled) return null;

  // אם הטוקן עדיין בתוקף (עם buffer של 5 דקות)
  const bufferMs = 5 * 60 * 1000;
  if (connection.tokenExpiresAt.getTime() > Date.now() + bufferMs) {
    return decrypt(connection.accessToken);
  }

  // רענון
  try {
    const refreshToken = decrypt(connection.refreshToken);
    const newTokens = await refreshAccessToken(refreshToken);
    const newExpiresAt = new Date(Date.now() + newTokens.expires_in * 1000);

    await prisma.gmailConnection.update({
      where: { tenantId },
      data: {
        accessToken: encrypt(newTokens.access_token),
        tokenExpiresAt: newExpiresAt,
      },
    });

    return newTokens.access_token;
  } catch (e) {
    // הטוקן כנראה בוטל - השבת סנכרון
    await prisma.gmailConnection.update({
      where: { tenantId },
      data: {
        syncEnabled: false,
        lastSyncError: e instanceof Error ? e.message : 'Token refresh failed',
      },
    });
    return null;
  }
}

// ============================================
// 4. חיפוש ושליפת מיילים
// ============================================

export interface GmailMessageSummary {
  id: string;
  threadId: string;
}

export async function searchMessages(
  accessToken: string,
  query: string,
  maxResults = 50
): Promise<GmailMessageSummary[]> {
  const url = `${GMAIL_API_BASE}/users/me/messages?q=${encodeURIComponent(query)}&maxResults=${maxResults}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) throw new Error(`Gmail search failed: ${res.status}`);

  const data = (await res.json()) as { messages?: GmailMessageSummary[] };
  return data.messages || [];
}

export interface GmailMessage {
  id: string;
  subject: string;
  from: string;
  date: Date;
  body: string;
  snippet: string;
}

export async function getMessage(
  accessToken: string,
  messageId: string
): Promise<GmailMessage | null> {
  const url = `${GMAIL_API_BASE}/users/me/messages/${messageId}?format=full`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) return null;

  type GmailHeader = { name: string; value: string };
  type GmailPayload = {
    headers: GmailHeader[];
    body?: { data?: string; size: number };
    parts?: GmailPayload[];
    mimeType: string;
  };

  const data = (await res.json()) as {
    id: string;
    snippet: string;
    payload: GmailPayload;
    internalDate: string;
  };

  const headers = data.payload.headers;
  const subject = headers.find((h) => h.name === 'Subject')?.value || '';
  const from = headers.find((h) => h.name === 'From')?.value || '';

  // חילוץ body - לפעמים זה ב-payload.body, לפעמים ב-parts
  const body = extractBodyFromPayload(data.payload);

  return {
    id: data.id,
    subject,
    from,
    date: new Date(parseInt(data.internalDate, 10)),
    body,
    snippet: data.snippet,
  };
}

type GmailPayloadInternal = {
  headers: Array<{ name: string; value: string }>;
  body?: { data?: string; size: number };
  parts?: GmailPayloadInternal[];
  mimeType: string;
};

function extractBodyFromPayload(payload: GmailPayloadInternal): string {
  // מקרה 1: body ישיר
  if (payload.body?.data) {
    return decodeBase64Url(payload.body.data);
  }

  // מקרה 2: יש parts - חפש text/plain או text/html
  if (payload.parts) {
    // עדיפות ל-text/plain
    const plainPart = payload.parts.find((p) => p.mimeType === 'text/plain');
    if (plainPart?.body?.data) {
      return decodeBase64Url(plainPart.body.data);
    }

    const htmlPart = payload.parts.find((p) => p.mimeType === 'text/html');
    if (htmlPart?.body?.data) {
      return decodeBase64Url(htmlPart.body.data);
    }

    // רקורסיה - יש parts מקוננים
    for (const part of payload.parts) {
      const body = extractBodyFromPayload(part);
      if (body) return body;
    }
  }

  return '';
}

function decodeBase64Url(data: string): string {
  // Gmail משתמש ב-base64url שזה base64 עם החלפת תווים
  const base64 = data.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(base64, 'base64').toString('utf-8');
}

// ============================================
// 5. בניית query לחיפוש מיילים
// ============================================

export function buildSearchQuery(keywords: string[], sinceDays = 7): string {
  // Gmail search syntax: https://support.google.com/mail/answer/7190
  // עברית: Gmail לא מטפל היטב בחיפוש exact-phrase במרכאות עבור עברית
  // (מחזיר 0 תוצאות). לכן עוטפים כל keyword בסוגריים — Gmail מבצע
  // AND בין המילים בתוך הסוגריים. הפרסר עצמו מבצע התאמה מדויקת על body.

  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - sinceDays);
  const dateStr = sinceDate.toISOString().split('T')[0].replace(/-/g, '/');

  const keywordPart = keywords
    .map((k) => `(${k.trim()})`)
    .join(' OR ');

  return `${keywordPart} after:${dateStr}`;
}
