/*
  Warnings:

  - You are about to drop the column `assignedAt` on the `Posts_Categories` table. All the data in the column will be lost.
  - You are about to drop the column `assignedBy` on the `Posts_Categories` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Posts_Categories" DROP COLUMN "assignedAt",
DROP COLUMN "assignedBy";
