-- CreateEnum
CREATE TYPE "EndoStatus" AS ENUM ('true', 'false', 'undefined');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "has_endometriosis" "EndoStatus" NOT NULL DEFAULT 'undefined';
