/*
  Warnings:

  - You are about to drop the column `guest_session_id` on the `orders` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_guest_session_id_fkey";

-- DropIndex
DROP INDEX "orders_guest_session_id_idx";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "guest_session_id",
ADD COLUMN     "guestSessionId" TEXT;

-- CreateIndex
CREATE INDEX "orders_guestSessionId_idx" ON "orders"("guestSessionId");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_guestSessionId_fkey" FOREIGN KEY ("guestSessionId") REFERENCES "guest_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
