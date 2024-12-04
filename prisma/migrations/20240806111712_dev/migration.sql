/*
  Warnings:

  - Made the column `activated_at` on table `QueueToken` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "QueueToken" ALTER COLUMN "activated_at" SET NOT NULL;
