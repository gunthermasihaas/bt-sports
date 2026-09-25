-- CreateEnum
CREATE TYPE "Moeda" AS ENUM ('EUR', 'USD', 'BRL', 'GBP');

-- DropIndex
DROP INDEX "pacotes_destaque_key";

-- AlterTable
ALTER TABLE "pacotes" ADD COLUMN     "moeda" "Moeda" NOT NULL DEFAULT 'EUR';
