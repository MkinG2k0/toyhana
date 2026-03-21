-- CreateEnum
CREATE TYPE "VenuePlacementRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- DropIndex
DROP INDEX "venues_city_isActive_idx";

-- AlterTable
ALTER TABLE "venues" ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "venue_placement_requests" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "VenuePlacementRequestStatus" NOT NULL DEFAULT 'PENDING',
    "adminComment" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "venue_placement_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "venue_placement_requests_status_idx" ON "venue_placement_requests"("status");

-- CreateIndex
CREATE INDEX "venue_placement_requests_userId_idx" ON "venue_placement_requests"("userId");

-- CreateIndex
CREATE INDEX "venues_city_isActive_isApproved_idx" ON "venues"("city", "isActive", "isApproved");

-- CreateIndex
CREATE INDEX "venues_isApproved_isActive_idx" ON "venues"("isApproved", "isActive");

-- AddForeignKey
ALTER TABLE "venue_placement_requests" ADD CONSTRAINT "venue_placement_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
