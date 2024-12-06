-- CreateTable
CREATE TABLE "Case" (
    "id" TEXT NOT NULL,
    "fileNo" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "caseType" TEXT NOT NULL,
    "abCategory" TEXT NOT NULL,
    "dateOfLoss" TEXT NOT NULL,
    "lawyer" TEXT NOT NULL,
    "paralegal" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "details" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Case_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Case_fileNo_key" ON "Case"("fileNo");
