/*
  Warnings:

  - You are about to drop the column `movieId` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the column `movieName` on the `Like` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,contentId,contentType]` will be added. If there are existing duplicate values, this will fail.
*/

-- First, add the new columns
ALTER TABLE "public"."Like" ADD COLUMN "contentId" INTEGER;
ALTER TABLE "public"."Like" ADD COLUMN "contentName" TEXT;
ALTER TABLE "public"."Like" ADD COLUMN "contentType" TEXT;

-- Migrate existing data (assuming all existing likes are for movies)
UPDATE "public"."Like" SET 
  "contentId" = "movieId",
  "contentName" = "movieName",
  "contentType" = 'movie';

-- Make the new columns NOT NULL
ALTER TABLE "public"."Like" ALTER COLUMN "contentId" SET NOT NULL;
ALTER TABLE "public"."Like" ALTER COLUMN "contentName" SET NOT NULL;
ALTER TABLE "public"."Like" ALTER COLUMN "contentType" SET NOT NULL;

-- Drop the old unique constraint
DROP INDEX "public"."Like_userId_movieId_key";

-- Drop the old columns
ALTER TABLE "public"."Like" DROP COLUMN "movieId";
ALTER TABLE "public"."Like" DROP COLUMN "movieName";

-- Create the new unique constraint
CREATE UNIQUE INDEX "Like_userId_contentId_contentType_key" ON "public"."Like"("userId", "contentId", "contentType");
