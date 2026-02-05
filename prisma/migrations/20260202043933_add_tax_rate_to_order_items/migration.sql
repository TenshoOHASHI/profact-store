/*
  Warnings:

  - You are about to drop the column `price` on the `order_items` table. All the data in the column will be lost.
  - Added the required column `unit_price` to the `order_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "price",
ADD COLUMN     "tax_rate" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
ADD COLUMN     "unit_price" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "stripe_payment_intent_id" DROP NOT NULL;
