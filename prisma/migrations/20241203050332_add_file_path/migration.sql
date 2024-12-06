/*
  Warnings:

  - You are about to drop the column `url` on the `Document` table. All the data in the column will be lost.
  - Added the required column `filePath` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "url",
ADD COLUMN     "filePath" TEXT NOT NULL,
ALTER COLUMN "uploadDate" SET DEFAULT CURRENT_TIMESTAMP;
