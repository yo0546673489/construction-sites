// app/api/donations/ingest/route.ts
// קליטה מיידית של תרומה שנשלחת מאתר חיצוני (למשל אתר מטרנה) — push בזמן אמת.
// מאובטח ע"י INGEST_SECRET ב-header. CORS פתוח כי הקריאה מגיעה מדפדפן בדומיין אחר.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type, x-ingest-secret",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

function str(v: unknown, n: number): string | null {
  if (v == null || v === "") return null;
  return String(v).slice(0, n);
}

export async function POST(req: Request) {
  const secret = req.headers.get("x-ingest-secret");
  if (!process.env.INGEST_SECRET || secret !== process.env.INGEST_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: CORS });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400, headers: CORS });
  }

  const amount = Number(body.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: "invalid amount" }, { status: 400, headers: CORS });
  }

  // קולטים רק תרומה שהצליחה
  const status = String(body.status ?? "").toLowerCase();
  if (status && !["success", "approved", "1", "ok"].includes(status)) {
    return NextResponse.json({ ok: true, skipped: "not_successful" }, { headers: CORS });
  }

  const txId = String((body.transactionId ?? body.donationId ?? "")).trim();
  if (!txId) {
    return NextResponse.json({ error: "missing transactionId" }, { status: 400, headers: CORS });
  }

  const slug = String(body.tenantSlug ?? "tov-lev");
  const tenant = await prisma.tenant.findUnique({ where: { slug } });
  if (!tenant) {
    return NextResponse.json({ error: "tenant not found" }, { status: 404, headers: CORS });
  }

  const kwName = String(body.keyword ?? "מטרנה");
  const keyword = await prisma.donationKeyword.findFirst({
    where: { tenantId: tenant.id, keyword: kwName },
  });

  const emailMessageId = `matrena-web-${txId}`;

  // מניעת כפילות
  const existing = await prisma.donation.findUnique({ where: { emailMessageId } });
  if (existing) {
    return NextResponse.json({ ok: true, duplicate: true }, { headers: CORS });
  }

  await prisma.donation.create({
    data: {
      tenantId: tenant.id,
      keywordId: keyword?.id ?? null,
      amount,
      currency: "ILS",
      donorName: str(body.donorName, 80),
      donorPhone: str(body.donorPhone, 30),
      donorEmail: str(body.donorEmail, 120),
      paymentMethod: str(body.paymentMethod, 40),
      emailSubject: "תרומה דרך אתר מטרנה",
      emailFrom: "matrena-web",
      emailDate: new Date(),
      emailMessageId,
      rawSnippet: null,
      parserSource: "matrena_web",
      needsReview: false,
    },
  });

  return NextResponse.json({ ok: true, created: true }, { headers: CORS });
}
