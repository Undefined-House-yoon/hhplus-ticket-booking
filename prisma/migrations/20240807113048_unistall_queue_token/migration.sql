/*
  Warnings:

  - You are about to drop the `QueueToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "QueueToken" DROP CONSTRAINT "QueueToken_user_id_fkey";

-- DropTable
DROP TABLE "QueueToken";
