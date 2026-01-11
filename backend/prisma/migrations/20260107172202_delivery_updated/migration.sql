/*
  Warnings:

  - You are about to drop the column `deliveryCode` on the `Delivery` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Delivery" DROP COLUMN "deliveryCode";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "deliveryCode" TEXT;
