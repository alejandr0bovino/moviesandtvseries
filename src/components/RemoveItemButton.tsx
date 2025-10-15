'use client'

import { useState } from 'react'
import CloseIcon from '@/icons/close'

interface RemoveItemButtonProps {
  itemId: string
  type: 'bookmark' | 'watchlist' | 'like'
  itemType: 'tv-series' | 'movie'
  onRemove: () => void
}

export default function RemoveItemButton({ itemId, type, itemType, onRemove }: RemoveItemButtonProps) {
  const [isRemoving, setIsRemoving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRemove = async () => {
    if (isRemoving) return

    setIsRemoving(true)
    setError(null)

    try {
      let endpoint = ''
      let params = ''

      if (type === 'bookmark') {
        if (itemType === 'tv-series') {
          endpoint = '/api/bookmarks'
          params = `?tvSeriesId=${itemId}`
        } else {
          endpoint = '/api/bookmarks/movies'
          params = `?movieId=${itemId}`
        }
      } else if (type === 'watchlist') {
        if (itemType === 'tv-series') {
          endpoint = '/api/watchlist'
          params = `?tvSeriesId=${itemId}`
        } else {
          endpoint = '/api/watchlist/movies'
          params = `?movieId=${itemId}`
        }
      } else if (type === 'like') {
        if (itemType === 'tv-series') {
          endpoint = '/api/likes/tv-series'
          params = `?tvSeriesId=${itemId}`
        } else {
          endpoint = '/api/likes/movies'
          params = `?movieId=${itemId}`
        }
      }

      const response = await fetch(endpoint + params, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        throw new Error(errorData.error || 'Failed to remove item')
      }

      // Call the onRemove callback to update the UI
      onRemove()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error removing item:', err)
    } finally {
      setIsRemoving(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleRemove}
        disabled={isRemoving}
        className="p-1 hover:bg-red-100 rounded-full transition-colors duration-200 disabled:opacity-50 group cursor-pointer"
        title={`Remove ${itemType === 'tv-series' ? 'TV Series' : 'Movie'} from ${type === 'like' ? 'likes' : type}`}
      >
        {isRemoving ? (
          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
        ) : (
          <CloseIcon
            className="w-4 h-4 text-red-600 group-hover:text-red-800 transition-colors"
          />
        )}
      </button>

      {error && (
        <div className="absolute top-full right-0 mt-1 px-2 py-1 bg-red-100 text-red-800 text-xs rounded shadow-lg z-10 whitespace-nowrap">
          {error}
        </div>
      )}
    </div>
  )
}
