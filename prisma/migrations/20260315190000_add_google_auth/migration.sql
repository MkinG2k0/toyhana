-- AlterTable
ALTER TABLE "users" ADD COLUMN "email" TEXT;
ALTER TABLE "users" ALTER COLUMN "phone" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");
