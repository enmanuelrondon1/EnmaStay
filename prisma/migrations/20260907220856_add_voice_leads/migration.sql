-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'CLOSED');

-- CreateTable
CREATE TABLE "VoiceLead" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "name" TEXT,
    "contact" TEXT,
    "preferredTime" TEXT,
    "notes" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VoiceLead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VoiceLead_propertyId_idx" ON "VoiceLead"("propertyId");

-- AddForeignKey
ALTER TABLE "VoiceLead" ADD CONSTRAINT "VoiceLead_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
