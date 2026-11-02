-- CreateTable
CREATE TABLE "Sale" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "itemName" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "soldFor" REAL NOT NULL,
    "paidFor" REAL NOT NULL,
    "fees" REAL NOT NULL DEFAULT 0,
    "dateSold" DATETIME NOT NULL,
    "photoUrl" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "displayName" TEXT,
    "reportingYear" INTEGER,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Sale_dateSold_idx" ON "Sale"("dateSold");

-- CreateIndex
CREATE INDEX "Sale_platform_idx" ON "Sale"("platform");
