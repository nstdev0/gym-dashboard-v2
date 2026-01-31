/*
  Warnings:

  - You are about to alter the column `price` on the `Plan` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.

*/
-- DropIndex
DROP INDEX "Member_email_key";

-- DropIndex
DROP INDEX "Organization_name_key";

-- DropIndex
DROP INDEX "Product_sku_key";

-- AlterTable
ALTER TABLE "Member" ALTER COLUMN "phone" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Membership" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Plan" ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);

-- CreateIndex
CREATE INDEX "Member_lastName_firstName_idx" ON "Member"("lastName", "firstName");
