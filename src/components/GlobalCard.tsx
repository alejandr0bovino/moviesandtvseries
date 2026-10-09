'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Chip } from "@heroui/react";
import { Button } from "@heroui/react";
import { Tooltip } from "@heroui/react";
import { SignedIn, SignedOut } from '@clerk/nextjs';

import { IconPhotoOff, IconStarFilled, IconBookmarkFilled, IconBookmark, IconEye, IconEyeFilled } from "@tabler/icons-react";
import { BookmarkPlus, Eye, Heart } from "lucide-react";

import { ViewMode } from '@/types/movies';
import { movieGenres, tvSeriesGenres } from '@/constants/movies';

// Base interface for both movies and TV series
interface BaseMediaItem {
  id: number;
  poster_path: string;
  genre_ids?: number[];
  overview?: string;
  vote_average?: number;
}

// Movie-specific interface
interface MovieItem extends BaseMediaItem {
  type: 'movie';
  title: string;
  release_date?: string;
}

// TV Series-specific interface
interface TvSeriesItem extends BaseMediaItem {
  type: 'tv-series';
  name: string;
  first_air_date?: string;
}

type MediaItem = MovieItem | TvSeriesItem;

interface GlobalCardProps {
  mediaItem: MediaItem;
  viewMode: ViewMode;
  bookmarkedItems: Set<number>;
  watchlistedItems: Set<number>;
  likedItems: Set<number>;
  likesCount: Record<number, number>;
  selectedGenre: string;
  onBookmarkSuccess: (itemId: number, itemTitle: string) => void;
  onRemoveBookmark: (itemId: number) => void;
  onAddToWatchlist: (itemId: number, itemTitle: string) => void;
  onRemoveFromWatchlist: (itemId: number) => void;
  onLikeItem: (itemId: number, itemTitle: string) => void;
  onUnlikeItem: (itemId: number) => void;
  onBookmarkModalOpen: () => void;
  onWatchlistModalOpen: () => void;
  onLikeModalOpen: () => void;
}

export default function GlobalCard({
  mediaItem,
  viewMode,
  bookmarkedItems,
  watchlistedItems,
  likedItems,
  likesCount,
  selectedGenre,
  onBookmarkSuccess,
  onRemoveBookmark,
  onAddToWatchlist,
  onRemoveFromWatchlist,
  onLikeItem,
  onUnlikeItem,
  onBookmarkModalOpen,
  onWatchlistModalOpen,
  onLikeModalOpen,
}: GlobalCardProps) {
  // Helper functions to get item-specific data
  const getItemTitle = (item: MediaItem): string => {
    return item.type === 'movie' ? item.title : item.name;
  };

  const getItemDate = (item: MediaItem): string | undefined => {
    return item.type === 'movie' ? item.release_date : item.first_air_date;
  };

  const getItemLink = (item: MediaItem): string => {
    return item.type === 'movie' ? `/movies/${item.id}` : `/tv-series/${item.id}`;
  };

  const getGenres = (item: MediaItem) => {
    return item.type === 'movie' ? movieGenres : tvSeriesGenres;
  };

  const getItemTitleForActions = (item: MediaItem): string => {
    return item.type === 'movie' ? item.title : item.name;
  };

  const renderMediaActions = () => (
    <div className="flex gap-2 absolute -top-10 lg:top-5 right-0 lg:right-5 z-10 group">
      <SignedIn>
        {bookmarkedItems.has(mediaItem.id) ? (
          <Button
            size="sm"
            aria-label="Remove bookmark"
            onPress={() => onRemoveBookmark(mediaItem.id)}
            className="bg-white border border-gray-300 hover:bg-gray-50"
          >
            <IconBookmarkFilled className='text-red-400' width={16} height={16} />
            Remove bookmark
          </Button>
        ) : (
          <Button
            size="sm"
            aria-label="Bookmark"
            onPress={() => onBookmarkSuccess(mediaItem.id, getItemTitleForActions(mediaItem))}
            className="bg-white border border-gray-300 hover:bg-gray-50"
          >
            <IconBookmark className='text-gray-400' width={16} height={16} />
            Bookmark
          </Button>
        )}

        {watchlistedItems.has(mediaItem.id) ? (
          <Button
            size="sm"
            aria-label="Remove from Watchlist"
            onPress={() => onRemoveFromWatchlist(mediaItem.id)}
            className="bg-white border border-gray-300 hover:bg-gray-50"
          >
            <IconEyeFilled className='text-red-400' width={16} height={16} />
            Remove from Watchlist
          </Button>
        ) : (
          <Button
            size="sm"
            aria-label="Add to Watchlist"
            onPress={() => onAddToWatchlist(mediaItem.id, getItemTitleForActions(mediaItem))}
            className="bg-white border border-gray-300 hover:bg-gray-50"
          >
            <IconEye className='text-gray-400' width={16} height={16} />
            Add to Watchlist
          </Button>
        )}

        {likedItems.has(mediaItem.id) ? (
          <Button
            size="sm"
            aria-label="Remove like"
            onPress={() => onUnlikeItem(mediaItem.id)}
            className="bg-white border border-gray-300 hover:bg-gray-50"
          >
            <Heart className='text-red-400 fill-current' width={16} height={16} />
            Remove like
          </Button>
        ) : (
          <Button
            size="sm"
            aria-label="Like"
            onPress={() => onLikeItem(mediaItem.id, getItemTitleForActions(mediaItem))}
            className="bg-white border border-gray-300 hover:bg-gray-50"
          >
            <Heart className='text-gray-400' width={16} height={16} />
            Like
          </Button>
        )}
      </SignedIn>

      <SignedOut>
        <Button size="sm" aria-label="Bookmark" onPress={onBookmarkModalOpen} className="bg-white border border-gray-300 hover:bg-gray-50">
          <IconBookmark className='text-gray-400' width={16} height={16} />
          Bookmark
        </Button>
        <Button size="sm" aria-label="Add to Watchlist" onPress={onWatchlistModalOpen} className="bg-white border border-gray-300 hover:bg-gray-50">
          <IconEye className='text-gray-400' width={16} height={16} />
          Add to Watchlist
        </Button>
        <Button size="sm" aria-label="Like" onPress={onLikeModalOpen} className="bg-white border border-gray-300 hover:bg-gray-50">
          <Heart className='text-gray-400' width={16} height={16} />
          Like
        </Button>
      </SignedOut>
    </div>
  );

  const renderGridActions = () => (
    <div className='absolute top-[17px] left-[17px] z-10 backdrop-blur-sm rounded-tl-[8px] rounded-br-[8px]'>
      <div className='flex flex-col'>
        <SignedIn>
          {bookmarkedItems.has(mediaItem.id) ? (
            <Tooltip content="Remove bookmark" color="foreground" placement="right">
              <button
                aria-label="Remove bookmark"
                onClick={() => onRemoveBookmark(mediaItem.id)}
                className='cursor-pointer w-10 h-10 flex items-center justify-center rounded-tl-[8px]'
              >
                <IconBookmarkFilled className='text-red-400' width={25} height={25} />
              </button>
            </Tooltip>
          ) : (
            <Tooltip content="Bookmark" color="foreground" placement="right">
              <button
                aria-label="Bookmark"
                onClick={() => onBookmarkSuccess(mediaItem.id, getItemTitleForActions(mediaItem))}
                className='cursor-pointer w-10 h-10 flex items-center justify-center rounded-tl-[8px]'
              >
                <IconBookmark className='text-gray-200' width={25} height={25} />
              </button>
            </Tooltip>
          )}

          {watchlistedItems.has(mediaItem.id) ? (
            <Tooltip content="Remove from Watchlist" color="foreground" placement="right">
              <button
                aria-label="Remove from Watchlist"
                onClick={() => onRemoveFromWatchlist(mediaItem.id)}
                className='cursor-pointer w-10 h-9 flex items-center justify-center'
              >
                <IconEyeFilled className='text-red-400' width={23} height={23} />
              </button>
            </Tooltip>
          ) : (
            <Tooltip content="Add to Watchlist" color="foreground" placement="right">
              <button
                aria-label="Add to Watchlist"
                onClick={() => onAddToWatchlist(mediaItem.id, getItemTitleForActions(mediaItem))}
                className='cursor-pointer w-10 h-9 flex items-center justify-center'
              >
                <IconEye className='text-gray-200' width={23} height={23} />
              </button>
            </Tooltip>
          )}

          {likedItems.has(mediaItem.id) ? (
            <Tooltip content="Remove like" color="foreground" placement="right">
              <button
                aria-label="Remove like"
                onClick={() => onUnlikeItem(mediaItem.id)}
                className='cursor-pointer w-10 h-9 flex items-center justify-center rounded-br-[8px]'
              >
                <Heart className='text-red-400 fill-current' width={22} height={22} />
              </button>
            </Tooltip>
          ) : (
            <Tooltip content="Like" color="foreground" placement="right">
              <button
                aria-label="Like"
                onClick={() => onLikeItem(mediaItem.id, getItemTitleForActions(mediaItem))}
                className='cursor-pointer w-10 h-9 flex items-center justify-center rounded-br-[8px]'
              >
                <Heart className='text-gray-200' width={22} height={22} />
              </button>
            </Tooltip>
          )}
        </SignedIn>

        <SignedOut>
          <div className='flex flex-col'>
            <Tooltip content="Bookmark" color="foreground" placement="right">
              <button aria-label="Bookmark" onClick={onBookmarkModalOpen}
                className='cursor-pointer w-10 h-10 flex items-center justify-center'>
                <BookmarkPlus className='text-gray-200' width={25} height={25} />
              </button>
            </Tooltip>

            <Tooltip content="Add to Watchlist" color="foreground" placement="right">
              <button aria-label="Add to watchlist" onClick={onWatchlistModalOpen}
                className='cursor-pointer w-10 h-9 flex items-center justify-center'>
                <Eye className='text-gray-200' width={23} height={23} />
              </button>
            </Tooltip>

            <Tooltip content="Like" color="foreground" placement="right">
              <button aria-label="Like" onClick={onLikeModalOpen}
                className='cursor-pointer w-10 h-9 flex items-center justify-center'>
                <Heart className='text-gray-200' width={23} height={23} />
              </button>
            </Tooltip>
          </div>
        </SignedOut>
      </div>
    </div>
  );

  const renderImage = (width: number, height: number, className: string, style?: React.CSSProperties) => (
    <>
      <Image
        src={`https://image.tmdb.org/t/p/w500/${mediaItem.poster_path}`}
        alt={getItemTitle(mediaItem)}
        width={width}
        height={height}
        style={style}
        loading="lazy"
        className={className}
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
        className="hidden h-full flex-col items-center justify-center bg-gray-200 rounded text-gray-500 text-xs font-medium text-center"
        style={style}
      >
        <IconPhotoOff className='mb-2' />
        Image not <br /> available
      </div>
    </>
  );

  const renderRating = () => (
    <div className='absolute top-1 right-1'>
      <IconStarFilled className='text-[#f5a524]' width={38} height={38} />
      <div className='text-center text-black text-xs absolute top-[11px] left-0 right-0 font-semibold tracking-tighter'>
        {(mediaItem.vote_average || 0).toFixed(1)}
      </div>
    </div>
  );

  const renderLikesCount = () => (
    <div className='absolute bottom-1 right-1 backdrop-blur-sm rounded-full px-2 py-1'>
      <div className='flex items-center gap-1'>
        <Heart className='text-red-400 fill-current' width={16} height={16} />
        <span className='text-white text-xs font-semibold'>
          {likesCount[mediaItem.id] || 0}
        </span>
      </div>
    </div>
  );

  const renderGenres = () => {
    const genres = getGenres(mediaItem);
    return (
      <div className="text-xs mt-2 text-gray-400 mb-4">
        {mediaItem.genre_ids
          ?.map((id) => {
            const genreName = genres.find((g) => g.id === String(id))?.name;
            const isSelectedGenre = selectedGenre === String(id);
            return genreName ?
              <Chip
                key={id}
                size="sm"
                color="primary"
                variant="dot"
                className={`mr-2 ${isSelectedGenre ? 'genre-selected' : ''}`}
              >
                {genreName}
              </Chip>
              : null;
          })
          .filter(Boolean) || 'Genres N/A'}
      </div>
    );
  };

  if (viewMode === 'list') {
    return (
      <li className="w-full group mt-10 xl:mt-0">
        <div className='relative group'>
          {renderMediaActions()}
        </div>

        <Link
          href={getItemLink(mediaItem)}
          className="flex gap-6 w-full p-4 rounded-xl border border-gray-300 shadow-sm
           hover:shadow-xl transition duration-300 bg-white 
           group-hover:shadow-xl"
        >
          <div className="w-28 relative flex-shrink-0 overflow-hidden rounded-md">
            {renderImage(124, 168, "object-cover rounded saturate-65", { width: "124px", height: "168px" })}
            {renderRating()}
            {renderLikesCount()}
          </div>
          <div className="transform transition-transform duration-300 group-hover:translate-x-2">
            <h3 className="text-xl font-semibold mb-2">{getItemTitle(mediaItem)}</h3>
            <p className="text-gray-500 text-sm mb-2">
              {getItemDate(mediaItem) ? new Date(getItemDate(mediaItem)!).getFullYear() : 'Year N/A'}
            </p>
            {renderGenres()}
            <p className="text-sm text-gray-600 line-clamp-4">{mediaItem.overview}</p>
          </div>
        </Link>
      </li>
    );
  }

  return (
    <li>
      <div className='relative group'>
        {renderGridActions()}

        <Link href={getItemLink(mediaItem)}>
          <div
            className="group p-4 bg-white rounded-xl border border-gray-300 shadow-sm hover:shadow-xl transition duration-300 w-[229px] text-sm  
            hover:text-gray-600  
            group-hover:shadow-xl"
          >
            <div className="relative h-70 w-full overflow-hidden rounded-md">
              {renderImage(195, 292, "w-[195px] h-[292px] object-cover rounded-md saturate-65")}
              {renderRating()}
              {renderLikesCount()}
            </div>
            <div className="mt-4 transform transition-transform duration-300 group-hover:translate-x-2 flex flex-col">
              <h3 className="text-lg font-semibold mb-2">{getItemTitle(mediaItem)}</h3>
              <p className="text-sm text-gray-600 mb-2">{getItemDate(mediaItem) ? new Date(getItemDate(mediaItem)!).getFullYear() : 'Year N/A'}</p>
              <div className="text-xs text-gray-500 leading-8.5">
                {mediaItem.genre_ids
                  ?.map((id) => {
                    const genres = getGenres(mediaItem);
                    const genreName = genres.find((g) => g.id === String(id))?.name;
                    const isSelectedGenre = selectedGenre === String(id);
                    return genreName ?
                      <Chip
                        key={id}
                        size="sm"
                        color="primary"
                        variant="dot"
                        className={`mr-2 ${isSelectedGenre ? 'genre-selected' : ''}`}
                      >
                        {genreName}
                      </Chip>
                      : null;
                  })
                  .filter(Boolean) || 'Genres N/A'}
              </div>
            </div>
          </div>
        </Link>
      </div>
    </li>
  );
}
