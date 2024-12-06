-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "url" TEXT,
ALTER COLUMN "filePath" DROP NOT NULL;
