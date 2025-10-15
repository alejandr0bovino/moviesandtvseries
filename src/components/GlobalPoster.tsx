import Image from 'next/image';
import { IconPhotoOff } from "@tabler/icons-react";
import { Tooltip } from "@heroui/react";
import { SignedIn, SignedOut } from '@clerk/nextjs';
import { IconBookmarkFilled, IconBookmark, IconEye, IconEyeFilled } from "@tabler/icons-react";
import { BookmarkPlus, Eye, Heart } from "lucide-react";

// Common interface for both Movie and TvSeries
interface MediaItem {
  id?: number;
  poster_path?: string;
  title?: string;
  name?: string;
}

interface GlobalPosterProps {
  media: MediaItem;
  bookmarkedItems: Set<number>;
  watchlistedItems: Set<number>;
  isLiked: boolean;
  onBookmark: (itemId: number, itemName: string) => void;
  onRemoveBookmark: (itemId: number) => void;
  onAddToWatchlist: (itemId: number, itemName: string) => void;
  onRemoveFromWatchlist: (itemId: number) => void;
  onLike: (itemId: number, itemName: string) => void;
  onUnlike: (itemId: number) => void;
  onOpenBookmarkModal: () => void;
  onOpenWatchlistModal: () => void;
  onOpenLikeModal: () => void;
}

export function GlobalPoster({
  media,
  bookmarkedItems,
  watchlistedItems,
  isLiked,
  onBookmark,
  onRemoveBookmark,
  onAddToWatchlist,
  onRemoveFromWatchlist,
  onLike,
  onUnlike,
  onOpenBookmarkModal,
  onOpenWatchlistModal,
  onOpenLikeModal,
}: GlobalPosterProps) {
  const isBookmarked = bookmarkedItems.has(media.id || 0);
  const isWatchlisted = watchlistedItems.has(media.id || 0);

  // Get the title/name for display and handlers
  const itemName = media.title || media.name || '';
  const itemId = media.id || 0;

  return (
    <div className="relative flex-shrink-0 mb-2 lg:mb-0">
      <Image
        src={`https://image.tmdb.org/t/p/w500/${media.poster_path}`}
        alt={itemName}
        width={233}
        height={350}
        className="w-[233px] h-[350px] object-cover rounded-2xl saturate-65"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const fallbackDiv = target.nextElementSibling as HTMLElement;
          if (fallbackDiv) {
            fallbackDiv.style.display = 'flex';
          }
        }}
      />
      <div
        className="hidden flex-col items-center justify-center bg-gray-200 rounded-2xl text-gray-500 text-xs font-medium text-center"
        style={{ width: "233px", height: "350px" }}
      >
        <IconPhotoOff />
        Image not <br /> available
      </div>

      {/* Bookmark and Watchlist Icons */}
      <div className="absolute top-0 left-0 flex flex-col backdrop-blur-sm rounded-tl-[18px] rounded-br-[18px]">
        <SignedIn>
          {isBookmarked ? (
            <Tooltip content="Remove bookmark" color="foreground" placement="right">
              <button
                aria-label="Remove bookmark"
                onClick={() => onRemoveBookmark(itemId)}
                className='cursor-pointer w-11 h-11 flex items-center justify-center rounded-tl-[18px]'
              >
                <IconBookmarkFilled className='text-red-400' width={27} height={27} />
              </button>
            </Tooltip>
          ) : (
            <Tooltip content="Bookmark" color="foreground" placement="right">
              <button
                aria-label="Bookmark"
                onClick={() => onBookmark(itemId, itemName)}
                className='cursor-pointer w-11 h-11 flex items-center justify-center rounded-tl-[18px]'
              >
                <IconBookmark className='text-gray-200' width={27} height={27} />
              </button>
            </Tooltip>
          )}

          {isWatchlisted ? (
            <Tooltip content="Remove from Watchlist" color="foreground" placement="right">
              <button
                aria-label="Remove from Watchlist"
                onClick={() => onRemoveFromWatchlist(itemId)}
                className='cursor-pointer w-11 h-10 flex items-center justify-center'
              >
                <IconEyeFilled className='text-red-400' width={24} height={24} />
              </button>
            </Tooltip>
          ) : (
            <Tooltip content="Add to Watchlist" color="foreground" placement="right">
              <button
                aria-label="Add to Watchlist"
                onClick={() => onAddToWatchlist(itemId, itemName)}
                className='cursor-pointer w-11 h-10 flex items-center justify-center'
              >
                <IconEye className='text-gray-200' width={24} height={24} />
              </button>
            </Tooltip>
          )}

          {/* Like Button */}
          {itemId && (
            <>
              {isLiked ? (
                <Tooltip content="Remove like" color="foreground" placement="right">
                  <button
                    aria-label="Remove like"
                    onClick={() => onUnlike(itemId)}
                    className='cursor-pointer w-11 h-10 flex items-center justify-center'
                  >
                    <Heart className='text-red-400 fill-current' width={23} height={23} />
                  </button>
                </Tooltip>
              ) : (
                <Tooltip content="Like" color="foreground" placement="right">
                  <button
                    aria-label="Like"
                    onClick={() => onLike(itemId, itemName)}
                    className='cursor-pointer w-11 h-10 flex items-center justify-center'
                  >
                    <Heart className='text-gray-200' width={23} height={23} />
                  </button>
                </Tooltip>
              )}
            </>
          )}
        </SignedIn>

        <SignedOut>
          <Tooltip content="Bookmark" color="foreground" placement="right">
            <button
              aria-label="Bookmark"
              onClick={onOpenBookmarkModal}
              className='cursor-pointer w-11 h-12 flex items-center justify-center'
            >
              <BookmarkPlus className='text-gray-200' width={27} height={27} />
            </button>
          </Tooltip>

          <Tooltip content="Add to Watchlist" color="foreground" placement="right">
            <button
              aria-label="Add to watchlist"
              onClick={onOpenWatchlistModal}
              className='cursor-pointer w-11 h-11 flex items-center justify-center'
            >
              <Eye className='text-gray-200 cursor-pointer' width={24} height={24} />
            </button>
          </Tooltip>

          <Tooltip content="Like" color="foreground" placement="right">
            <button
              aria-label="Like"
              onClick={onOpenLikeModal}
              className='cursor-pointer w-11 h-11 flex items-center justify-center'
            >
              <Heart className='text-gray-200' width={24} height={24} />
            </button>
          </Tooltip>
        </SignedOut>
      </div>
    </div>
  );
}
