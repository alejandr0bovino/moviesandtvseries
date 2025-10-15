import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { addToast } from "@heroui/react";

export function useTvSeriesWatchlist() {
  const [watchlistedSeries, setWatchlistedSeries] = useState<Set<number>>(new Set());
  const [isWatchlistModalOpen, setIsWatchlistModalOpen] = useState(false);
  const { user } = useUser();

  // Fetch existing watchlist when component mounts
  useEffect(() => {
    const fetchWatchlist = async () => {
      if (user) {
        try {
          const response = await fetch('/api/watchlist');
          if (response.ok) {
            const watchlist = await response.json();
            const watchlistedIds = new Set<number>(watchlist.map((w: { tvSeriesId: number }) => w.tvSeriesId));
            setWatchlistedSeries(watchlistedIds);
          }
        } catch (error) {
          console.error('Error fetching TV series watchlist:', error);
        }
      }
    };

    fetchWatchlist();
  }, [user]);

  const handleAddToWatchlist = useCallback(async (tvSeriesId: number, tvSeriesName: string) => {
    // Store the previous state for potential rollback
    const wasWatchlisted = watchlistedSeries.has(tvSeriesId);

    // Optimistically update the UI immediately
    setWatchlistedSeries(prev => new Set([...prev, tvSeriesId]));

    try {
      const response = await fetch('/api/watchlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tvSeriesId,
          tvSeriesName,
        }),
      });

      if (response.ok) {
        addToast({
          title: "Successfully added TV series to Watchlist",
          color: "success",
          variant: "solid",
        });
        // UI is already updated, no need to update again
      } else {
        const errorData = await response.json();
        console.error('Error adding TV series to watchlist:', errorData);

        // Rollback to previous state on error
        setWatchlistedSeries(prev => {
          const newSet = new Set(prev);
          if (wasWatchlisted) {
            newSet.add(tvSeriesId);
          } else {
            newSet.delete(tvSeriesId);
          }
          return newSet;
        });

        // Show error toast
        addToast({
          title: "Failed to add to watchlist",
          description: errorData.message || "An error occurred",
          color: "danger",
          variant: "solid",
        });
      }
    } catch (error) {
      console.error('Error adding TV series to watchlist:', error);

      // Rollback to previous state on error
      setWatchlistedSeries(prev => {
        const newSet = new Set(prev);
        if (wasWatchlisted) {
          newSet.add(tvSeriesId);
        } else {
          newSet.delete(tvSeriesId);
        }
        return newSet;
      });

      // Show error toast
      addToast({
        title: "Failed to add to watchlist",
        description: "Network error occurred",
        color: "danger",
        variant: "solid",
      });
    }
  }, [watchlistedSeries]);

  const handleRemoveFromWatchlist = useCallback(async (tvSeriesId: number) => {
    // Store the previous state for potential rollback
    const wasWatchlisted = watchlistedSeries.has(tvSeriesId);

    // Optimistically update the UI immediately
    setWatchlistedSeries(prev => {
      const newSet = new Set(prev);
      newSet.delete(tvSeriesId);
      return newSet;
    });

    try {
      const response = await fetch(`/api/watchlist?tvSeriesId=${tvSeriesId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        addToast({
          title: "Successfully removed TV series from Watchlist",
          color: "success",
          variant: "solid",
        });
        // UI is already updated, no need to update again
      } else {
        console.error('Error removing TV series from watchlist');

        // Rollback to previous state on error
        setWatchlistedSeries(prev => {
          const newSet = new Set(prev);
          if (wasWatchlisted) {
            newSet.add(tvSeriesId);
          }
          return newSet;
        });

        // Show error toast
        addToast({
          title: "Failed to remove from watchlist",
          description: "An error occurred",
          color: "danger",
          variant: "solid",
        });
      }
    } catch (error) {
      console.error('Error removing TV series from watchlist:', error);

      // Rollback to previous state on error
      setWatchlistedSeries(prev => {
        const newSet = new Set(prev);
        if (wasWatchlisted) {
          newSet.add(tvSeriesId);
        }
        return newSet;
      });

      // Show error toast
      addToast({
        title: "Failed to remove from watchlist",
        description: "Network error occurred",
        color: "danger",
        variant: "solid",
      });
    }
  }, [watchlistedSeries]);

  return {
    watchlistedSeries,
    isWatchlistModalOpen,
    setIsWatchlistModalOpen,
    handleAddToWatchlist,
    handleRemoveFromWatchlist
  };
}
