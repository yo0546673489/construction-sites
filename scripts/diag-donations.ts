// scripts/diag-donations.ts
// Diagnostic for donation sync — runs against actual production code.
// Usage on server: cd ~/platform && npx tsx -r dotenv/config scripts/diag-donations.ts

import 'dotenv/config';
import { prisma } from '../src/lib/db';
import {
  getValidAccessToken,
  searchMessages,
  getMessage,
  buildSearchQuery,
} from '../src/lib/gmail-api';
import { parseEmail } from '../src/lib/donation-parser';

async function main() {
  console.log('='.repeat(70));
  console.log('STEP 1: DB STATE');
  console.log('='.repeat(70));

  // Find the tenant that has a Gmail connection (regardless of slug)
  const conn = await prisma.gmailConnection.findFirst();
  if (!conn) {
    console.log('NO GMAIL CONNECTION anywhere — bail.');
    return;
  }
  const tenant = await prisma.tenant.findUnique({ where: { id: conn.tenantId } });
  if (!tenant) {
    console.log('GMAIL CONN points to missing tenant — bail.');
    return;
  }
  console.log('TENANT:', { id: tenant.id, slug: tenant.slug, name: tenant.name });

  const gmail = await prisma.gmailConnection.findUnique({
    where: { tenantId: tenant.id },
  });
  if (!gmail) {
    console.log('NO GMAIL CONNECTION — bail.');
    return;
  }
  console.log('GMAIL:', {
    email: gmail.email,
    syncEnabled: gmail.syncEnabled,
    lastSyncAt: gmail.lastSyncAt,
    lastSyncError: gmail.lastSyncError,
    tokenExpiresAt: gmail.tokenExpiresAt,
    tokenExpired: gmail.tokenExpiresAt.getTime() < Date.now(),
  });

  const keywords = await prisma.donationKeyword.findMany({
    where: { tenantId: tenant.id },
  });
  console.log('KEYWORDS:', keywords.map((k) => ({
    id: k.id,
    keyword: JSON.stringify(k.keyword),
    campaignName: k.campaignName,
    isActive: k.isActive,
  })));

  const donations = await prisma.donation.count({ where: { tenantId: tenant.id } });
  console.log('DONATION ROWS IN DB:', donations);

  console.log('\n' + '='.repeat(70));
  console.log('STEP 2: GMAIL API — direct queries');
  console.log('='.repeat(70));

  const accessToken = await getValidAccessToken(tenant.id);
  if (!accessToken) {
    console.log('Could not get valid access token. Refresh likely failed.');
    const refreshed = await prisma.gmailConnection.findUnique({ where: { tenantId: tenant.id } });
    console.log('Post-attempt state:', {
      syncEnabled: refreshed?.syncEnabled,
      lastSyncError: refreshed?.lastSyncError,
    });
    return;
  }
  console.log('Got access token (length=' + accessToken.length + ')');

  const activeKeywords = keywords.filter((k) => k.isActive);
  const builtQuery = buildSearchQuery(activeKeywords.map((k) => k.keyword), 7);
  console.log('\nQUERY built by app code (daysBack=7):');
  console.log('  ' + JSON.stringify(builtQuery));

  // Try a battery of queries to isolate the problem
  const testQueries = [
    builtQuery,                                               // exact app query
    `("פרויקט 36")`,                                         // no date filter
    `"פרויקט 36"`,                                           // no parens
    `פרויקט 36`,                                             // unquoted
    `from:noreply@nedarimplus.com`,                          // by sender
    `from:noreply@nedarimplus.com newer_than:30d`,           // sender + 30d
    `from:nedarimplus.com`,                                  // domain
  ];

  for (const q of testQueries) {
    const msgs = await searchMessages(accessToken, q, 10);
    console.log(`  [${msgs.length}] ${JSON.stringify(q)}`);
  }

  console.log('\n' + '='.repeat(70));
  console.log('STEP 3: Inspect a real Nedarim Plus email');
  console.log('='.repeat(70));

  const nedarimMsgs = await searchMessages(
    accessToken,
    'from:noreply@nedarimplus.com',
    1
  );
  if (nedarimMsgs.length === 0) {
    console.log('No emails from nedarimplus found. Either the address differs or there are no emails.');
    return;
  }

  const full = await getMessage(accessToken, nedarimMsgs[0].id);
  if (!full) {
    console.log('Could not fetch message details.');
    return;
  }

  console.log('SUBJECT:', JSON.stringify(full.subject));
  console.log('FROM:', JSON.stringify(full.from));
  console.log('DATE:', full.date.toISOString());
  console.log('BODY LENGTH:', full.body.length);
  console.log('BODY (first 1500 chars):');
  console.log('---');
  console.log(full.body.substring(0, 1500));
  console.log('---');
  console.log('SNIPPET:', full.snippet);

  console.log('\nKEYWORD CHECKS on raw body:');
  for (const kw of activeKeywords) {
    console.log(`  contains ${JSON.stringify(kw.keyword)}: ${full.body.includes(kw.keyword)}`);
    // Also try lowercase + variations
    console.log(`  body lower contains kw lower: ${full.body.toLowerCase().includes(kw.keyword.toLowerCase())}`);
  }

  console.log('\n' + '='.repeat(70));
  console.log('STEP 4: Run parser on this email');
  console.log('='.repeat(70));

  const parsed = parseEmail({
    subject: full.subject,
    body: full.body,
    from: full.from,
    date: full.date,
    keywords: activeKeywords.map((k) => ({
      id: k.id,
      keyword: k.keyword,
      campaignName: k.campaignName,
    })),
  });
  console.log('PARSER RESULT:', parsed);
  if (!parsed) {
    console.log('Parser returned null — either keyword did not match or amount could not be extracted.');
  }
}

main()
  .catch((e) => {
    console.error('FATAL:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
