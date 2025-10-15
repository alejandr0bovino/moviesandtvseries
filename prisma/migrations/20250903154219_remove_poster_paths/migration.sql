/*
  Warnings:

  - You are about to drop the column `tvSeriesPosterPath` on the `Bookmark` table. All the data in the column will be lost.
  - You are about to drop the column `contentPosterPath` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the column `moviePosterPath` on the `MovieBookmark` table. All the data in the column will be lost.
  - You are about to drop the column `moviePosterPath` on the `MovieWatchlist` table. All the data in the column will be lost.
  - You are about to drop the column `tvSeriesPosterPath` on the `Watchlist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Bookmark" DROP COLUMN "tvSeriesPosterPath";

-- AlterTable
ALTER TABLE "public"."Like" DROP COLUMN "contentPosterPath";

-- AlterTable
ALTER TABLE "public"."MovieBookmark" DROP COLUMN "moviePosterPath";

-- AlterTable
ALTER TABLE "public"."MovieWatchlist" DROP COLUMN "moviePosterPath";

-- AlterTable
ALTER TABLE "public"."Watchlist" DROP COLUMN "tvSeriesPosterPath";
