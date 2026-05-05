-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN "metaAdAccountId" TEXT;
ALTER TABLE "Tenant" ADD COLUMN "metaAdAccountName" TEXT;

-- CreateTable
CREATE TABLE "GmailConnection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "tokenExpiresAt" DATETIME NOT NULL,
    "lastSyncAt" DATETIME,
    "lastSyncError" TEXT,
    "syncEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GmailConnection_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DonationKeyword" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "campaignName" TEXT NOT NULL,
    "metaCampaignId" TEXT,
    "color" TEXT NOT NULL DEFAULT '#3b82f6',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DonationKeyword_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Donation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "keywordId" TEXT,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ILS',
    "donorName" TEXT,
    "donorPhone" TEXT,
    "donorEmail" TEXT,
    "paymentMethod" TEXT,
    "emailSubject" TEXT NOT NULL,
    "emailFrom" TEXT NOT NULL,
    "emailDate" DATETIME NOT NULL,
    "emailMessageId" TEXT NOT NULL,
    "rawSnippet" TEXT,
    "parserSource" TEXT NOT NULL DEFAULT 'universal',
    "needsReview" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Donation_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Donation_keywordId_fkey" FOREIGN KEY ("keywordId") REFERENCES "DonationKeyword" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ShareableReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "showSpend" BOOLEAN NOT NULL DEFAULT true,
    "showDonations" BOOLEAN NOT NULL DEFAULT true,
    "showRoas" BOOLEAN NOT NULL DEFAULT true,
    "showCampaigns" BOOLEAN NOT NULL DEFAULT true,
    "password" TEXT,
    "expiresAt" DATETIME,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "lastViewedAt" DATETIME,
    "dateRangeDays" INTEGER NOT NULL DEFAULT 30,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ShareableReport_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "GmailConnection_tenantId_key" ON "GmailConnection"("tenantId");

-- CreateIndex
CREATE INDEX "DonationKeyword_tenantId_idx" ON "DonationKeyword"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "Donation_emailMessageId_key" ON "Donation"("emailMessageId");

-- CreateIndex
CREATE INDEX "Donation_tenantId_emailDate_idx" ON "Donation"("tenantId", "emailDate");

-- CreateIndex
CREATE INDEX "Donation_keywordId_idx" ON "Donation"("keywordId");

-- CreateIndex
CREATE INDEX "Donation_tenantId_needsReview_idx" ON "Donation"("tenantId", "needsReview");

-- CreateIndex
CREATE UNIQUE INDEX "ShareableReport_token_key" ON "ShareableReport"("token");

-- CreateIndex
CREATE INDEX "ShareableReport_token_idx" ON "ShareableReport"("token");

-- CreateIndex
CREATE INDEX "ShareableReport_tenantId_idx" ON "ShareableReport"("tenantId");
