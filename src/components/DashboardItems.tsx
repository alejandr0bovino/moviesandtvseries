'use client'

import { useState } from 'react'
import Link from 'next/link'
import RemoveItemButton from './RemoveItemButton'

import { IconBookmarkFilled, IconEyeFilled } from "@tabler/icons-react";
import { Heart } from "lucide-react";

interface BookmarkItem {
  id: string
  tvSeriesId?: number
  tvSeriesName?: string
  movieId?: number
  movieName?: string
  contentId?: number
  contentName?: string
  contentType?: string
  createdAt: Date
}

interface DashboardItemsProps {
  bookmarks: BookmarkItem[]
  movieBookmarks: BookmarkItem[]
  watchlist: BookmarkItem[]
  movieWatchlist: BookmarkItem[]
  likes: BookmarkItem[]
  accountCreatedAt: Date
}

export default function DashboardItems({
  bookmarks: initialBookmarks,
  movieBookmarks: initialMovieBookmarks,
  watchlist: initialWatchlist,
  movieWatchlist: initialMovieWatchlist,
  likes: initialLikes,
  accountCreatedAt
}: DashboardItemsProps) {
  const [bookmarks, setBookmarks] = useState(initialBookmarks)
  const [movieBookmarks, setMovieBookmarks] = useState(initialMovieBookmarks)
  const [watchlist, setWatchlist] = useState(initialWatchlist)
  const [movieWatchlist, setMovieWatchlist] = useState(initialMovieWatchlist)
  const [likes, setLikes] = useState(initialLikes)

  const handleRemoveBookmark = (id: string, type: 'tv-series' | 'movie') => {
    if (type === 'tv-series') {
      setBookmarks(prev => prev.filter(item => item.id !== id))
    } else {
      setMovieBookmarks(prev => prev.filter(item => item.id !== id))
    }
  }

  const handleRemoveWatchlist = (id: string, type: 'tv-series' | 'movie') => {
    if (type === 'tv-series') {
      setWatchlist(prev => prev.filter(item => item.id !== id))
    } else {
      setMovieWatchlist(prev => prev.filter(item => item.id !== id))
    }
  }

  const handleRemoveLike = (likeItem: BookmarkItem) => {
    setLikes(prev => prev.filter(item => item.id !== likeItem.id))
  }

  const totalBookmarks = bookmarks.length + movieBookmarks.length
  const totalWatchlist = watchlist.length + movieWatchlist.length
  const totalLikes = likes.length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard label="Total Bookmarks" value={totalBookmarks} />
        <StatCard label="Total Watchlist" value={totalWatchlist} />
        <StatCard label="Total Likes" value={totalLikes} />
        <StatCard label="Account Created" value={accountCreatedAt.toLocaleDateString()} />
      </div>

      {/* TV Series Bookmarks Section */}
      {bookmarks.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <IconBookmarkFilled width={23} height={23} />
              TV Series Bookmarks
            </h2>
            <Link href="/tv-series" className="text-blue-600 hover:text-blue-800 text-sm">
              View All TV Series →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookmarks.map((bookmark) => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                type="tv-series"
                onRemove={() => handleRemoveBookmark(bookmark.id, 'tv-series')}
              />
            ))}
          </div>
        </div>
      )}

      {/* Movie Bookmarks Section */}
      {movieBookmarks.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <IconBookmarkFilled width={23} height={23} /> Movie Bookmarks
            </h2>
            <Link href="/movies" className="text-blue-600 hover:text-blue-800 text-sm">
              View All Movies →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {movieBookmarks.map((bookmark) => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                type="movie"
                onRemove={() => handleRemoveBookmark(bookmark.id, 'movie')}
              />
            ))}
          </div>
        </div>
      )}

      {/* Combined Bookmarks Section (if both exist) */}
      {bookmarks.length === 0 && movieBookmarks.length === 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <IconBookmarkFilled width={23} height={23} />Your Bookmarks
          </h2>
          <div className="text-center py-8 bg-gray-200 rounded-lg">
            <p className="text-gray-500 mb-2">No bookmarks yet</p>
            <div className="space-y-2">
              <Link href="/tv-series" className="block text-blue-600 hover:text-blue-800">
                Discover TV Series to bookmark
              </Link>
              <Link href="/movies" className="block text-blue-600 hover:text-blue-800">
                Discover Movies to bookmark
              </Link>
            </div>
          </div>
        </div>
      )}


      <hr className="bg-gray-200 h-[2px] mt-10 mb-8" />

      {/* TV Series Watchlist Section */}
      {watchlist.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <IconEyeFilled width={23} height={23} /> TV Series Watchlist
            </h2>
            <Link href="/tv-series" className="text-blue-600 hover:text-blue-800 text-sm">
              View All TV Series →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {watchlist.map((watchlistItem) => (
              <WatchlistCard
                key={watchlistItem.id}
                watchlistItem={watchlistItem}
                type="tv-series"
                onRemove={() => handleRemoveWatchlist(watchlistItem.id, 'tv-series')}
              />
            ))}
          </div>
        </div>
      )}

      {/* Movie Watchlist Section */}
      {movieWatchlist.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <IconEyeFilled width={23} height={23} />
              Movie Watchlist
            </h2>
            <Link href="/movies" className="text-blue-600 hover:text-blue-800 text-sm">
              View All Movies →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {movieWatchlist.map((watchlistItem) => (
              <WatchlistCard
                key={watchlistItem.id}
                watchlistItem={watchlistItem}
                type="movie"
                onRemove={() => handleRemoveWatchlist(watchlistItem.id, 'movie')}
              />
            ))}
          </div>
        </div>
      )}

      {/* Combined Watchlist Section (if both exist) */}
      {watchlist.length === 0 && movieWatchlist.length === 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <IconEyeFilled width={23} height={23} />
            Your Watchlist
          </h2>
          <div className="text-center py-8 bg-gray-200 rounded-lg">
            <p className="text-gray-500 mb-2">No watchlist items yet</p>
            <div className="space-y-2">
              <Link href="/tv-series" className="block text-blue-600 hover:text-blue-800">
                Discover TV Series to add to your watchlist
              </Link>
              <Link href="/movies" className="block text-blue-600 hover:text-blue-800">
                Discover Movies to add to your watchlist
              </Link>
            </div>
          </div>
        </div>
      )}

      <hr className="bg-gray-200 h-[2px] mt-10 mb-8" />

      {/* Likes Section */}
      {likes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Heart width={23} height={23} className="fill-current" /> Your Liked Content
            </h2>
            <div className="space-x-4">
              <Link href="/tv-series" className="text-blue-600 hover:text-blue-800 text-sm">
                View All TV Series →
              </Link>
              <Link href="/movies" className="text-blue-600 hover:text-blue-800 text-sm">
                View All Movies →
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {likes.map((like) => (
              <LikeCard
                key={like.id}
                like={like}
                onRemove={() => handleRemoveLike(like)}
              />
            ))}
          </div>
        </div>
      )}

      {/* No Likes Section */}
      {likes.length === 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Heart width={23} height={23} className="fill-current" /> Your Liked Content
          </h2>
          <div className="text-center py-8 bg-gray-200 rounded-lg">
            <p className="text-gray-500 mb-2">No liked content yet</p>
            <div className="space-y-2">
              <Link href="/tv-series" className="block text-blue-600 hover:text-blue-800">
                Discover TV Series to like
              </Link>
              <Link href="/movies" className="block text-blue-600 hover:text-blue-800">
                Discover Movies to like
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-5">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="text-lg font-medium text-gray-900">{value}</dd>
    </div>
  )
}

function BookmarkCard({ bookmark, type, onRemove }: {
  bookmark: BookmarkItem
  type: 'tv-series' | 'movie'
  onRemove: () => void
}) {
  const id = type === 'tv-series' ? bookmark.tvSeriesId : bookmark.movieId
  const name = type === 'tv-series' ? bookmark.tvSeriesName : bookmark.movieName
  const linkPath = type === 'tv-series' ? `/tv-series/${id}` : `/movies/${id}`

  return (
    <div className="bg-white border border-gray-300 shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 mb-1">{name}</h3>
          <p className="text-sm text-gray-500">
            Bookmarked on {bookmark.createdAt.toLocaleDateString()}
          </p>
        </div>
        <div className="ml-3 flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            {type === 'tv-series' ? 'TV Series' : 'Movie'} Bookmarked
          </span>
          {id && (
            <RemoveItemButton
              itemId={id.toString()}
              type="bookmark"
              itemType={type}
              onRemove={onRemove}
            />
          )}
        </div>
      </div>
      <div className="mt-3">
        <Link
          href={linkPath}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View Details →
        </Link>
      </div>
    </div>
  )
}

function WatchlistCard({ watchlistItem, type, onRemove }: {
  watchlistItem: BookmarkItem
  type: 'tv-series' | 'movie'
  onRemove: () => void
}) {
  const id = type === 'tv-series' ? watchlistItem.tvSeriesId : watchlistItem.movieId
  const name = type === 'tv-series' ? watchlistItem.tvSeriesName : watchlistItem.movieName
  const linkPath = type === 'tv-series' ? `/tv-series/${id}` : `/movies/${id}`

  return (
    <div className="bg-white border border-gray-300 shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 mb-1">{name}</h3>
          <p className="text-sm text-gray-500">
            Added to watchlist on {watchlistItem.createdAt.toLocaleDateString()}
          </p>
        </div>
        <div className="ml-3 flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {type === 'tv-series' ? 'TV Series' : 'Movie'} Watchlist
          </span>
          {id && (
            <RemoveItemButton
              itemId={id.toString()}
              type="watchlist"
              itemType={type}
              onRemove={onRemove}
            />
          )}
        </div>
      </div>
      <div className="mt-3">
        <Link
          href={linkPath}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View Details →
        </Link>
      </div>
    </div>
  )
}

function LikeCard({ like, onRemove }: {
  like: BookmarkItem
  onRemove: () => void
}) {
  const id = like.contentId
  const name = like.contentName
  const linkPath = like.contentType === 'tv-series' ? `/tv-series/${id}` : `/movies/${id}`

  return (
    <div className="bg-white border border-gray-300 shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 mb-1">{name}</h3>
          <p className="text-sm text-gray-500">
            Liked on {like.createdAt.toLocaleDateString()}
          </p>
        </div>
        <div className="ml-3 flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            {like.contentType === 'tv-series' ? 'TV Series Liked' : 'Movie Liked'}
          </span>
          {id && (
            <RemoveItemButton
              itemId={id.toString()}
              type="like"
              itemType={like.contentType === 'tv-series' ? 'tv-series' : 'movie'}
              onRemove={onRemove}
            />
          )}
        </div>
      </div>
      <div className="mt-3">
        <Link
          href={linkPath}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View Details →
        </Link>
      </div>
    </div>
  )
}
