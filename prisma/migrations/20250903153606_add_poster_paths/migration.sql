-- AlterTable
ALTER TABLE "public"."Bookmark" ADD COLUMN     "tvSeriesPosterPath" TEXT;

-- AlterTable
ALTER TABLE "public"."Like" ADD COLUMN     "contentPosterPath" TEXT;

-- AlterTable
ALTER TABLE "public"."MovieBookmark" ADD COLUMN     "moviePosterPath" TEXT;

-- AlterTable
ALTER TABLE "public"."MovieWatchlist" ADD COLUMN     "moviePosterPath" TEXT;

-- AlterTable
ALTER TABLE "public"."Watchlist" ADD COLUMN     "tvSeriesPosterPath" TEXT;
