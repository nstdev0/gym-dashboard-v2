/*
  Warnings:

  - A unique constraint covering the columns `[docType,docNumber,organizationId]` on the table `Member` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email,organizationId]` on the table `Member` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `birthDate` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `docType` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ORG_OWNER', 'ORG_ADMIN', 'STAFF', 'TRAINER');

-- CreateEnum
CREATE TYPE "DocType" AS ENUM ('DNI', 'CE', 'PASSPORT');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('CONSUMABLE', 'GEAR', 'MERCH', 'SERVICE');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'PENDING', 'CANCELLED');

-- DropIndex
DROP INDEX "Member_docNumber_key";

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "birthDate" DATE NOT NULL,
ADD COLUMN     "docType" "DocType" NOT NULL,
ADD COLUMN     "gender" "Gender" NOT NULL,
ADD COLUMN     "organizationId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STAFF',
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "organizationId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "MembershipStatus" NOT NULL,
    "pricePaid" DECIMAL(10,2) NOT NULL,
    "memberId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "sku" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "cost" DECIMAL(10,2) NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "minStock" INTEGER NOT NULL DEFAULT 5,
    "type" "ProductType" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_organizationId_idx" ON "User"("organizationId");

-- CreateIndex
CREATE INDEX "Plan_organizationId_idx" ON "Plan"("organizationId");

-- CreateIndex
CREATE INDEX "Membership_organizationId_idx" ON "Membership"("organizationId");

-- CreateIndex
CREATE INDEX "Membership_memberId_idx" ON "Membership"("memberId");

-- CreateIndex
CREATE INDEX "Membership_status_idx" ON "Membership"("status");

-- CreateIndex
CREATE INDEX "Membership_endDate_idx" ON "Membership"("endDate");

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");

-- CreateIndex
CREATE INDEX "Product_organizationId_idx" ON "Product"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_organizationId_key" ON "Product"("sku", "organizationId");

-- CreateIndex
CREATE INDEX "Member_organizationId_idx" ON "Member"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Member_docType_docNumber_organizationId_key" ON "Member"("docType", "docNumber", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Member_email_organizationId_key" ON "Member"("email", "organizationId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
