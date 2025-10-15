import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { addToast } from "@heroui/react";

export function useTvSeriesBookmarks() {
  const [bookmarkedSeries, setBookmarkedSeries] = useState<Set<number>>(new Set());
  const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);
  const { user } = useUser();

  // Fetch existing bookmarks when component mounts
  useEffect(() => {
    const fetchBookmarks = async () => {
      if (user) {
        try {
          const response = await fetch('/api/bookmarks');
          if (response.ok) {
            const bookmarks = await response.json();
            const bookmarkedIds = new Set<number>(bookmarks.map((b: { tvSeriesId: number }) => b.tvSeriesId));
            setBookmarkedSeries(bookmarkedIds);
          }
        } catch (error) {
          console.error('Error fetching TV series bookmarks:', error);
        }
      }
    };

    fetchBookmarks();
  }, [user]);

  const handleBookmarkSuccess = useCallback(async (tvSeriesId: number, tvSeriesName: string) => {
    // Store the previous state for potential rollback
    const wasBookmarked = bookmarkedSeries.has(tvSeriesId);

    // Optimistically update the UI immediately
    setBookmarkedSeries(prev => new Set([...prev, tvSeriesId]));

    try {
      const response = await fetch('/api/bookmarks', {
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
          title: "Successfully added TV series to Bookmarks",
          color: "success",
          variant: "solid",
        });
        // UI is already updated, no need to update again
      } else {
        const errorData = await response.json();
        console.error('Error creating TV series bookmark:', errorData);

        // Rollback to previous state on error
        setBookmarkedSeries(prev => {
          const newSet = new Set(prev);
          if (wasBookmarked) {
            newSet.add(tvSeriesId);
          } else {
            newSet.delete(tvSeriesId);
          }
          return newSet;
        });

        // Show error toast
        addToast({
          title: "Failed to add to bookmarks",
          description: errorData.message || "An error occurred",
          color: "danger",
          variant: "solid",
        });
      }
    } catch (error) {
      console.error('Error creating TV series bookmark:', error);

      // Rollback to previous state on error
      setBookmarkedSeries(prev => {
        const newSet = new Set(prev);
        if (wasBookmarked) {
          newSet.add(tvSeriesId);
        } else {
          newSet.delete(tvSeriesId);
        }
        return newSet;
      });

      // Show error toast
      addToast({
        title: "Failed to add to bookmarks",
        description: "Network error occurred",
        color: "danger",
        variant: "solid",
      });
    }
  }, [bookmarkedSeries]);

  const handleRemoveBookmark = useCallback(async (tvSeriesId: number) => {
    // Store the previous state for potential rollback
    const wasBookmarked = bookmarkedSeries.has(tvSeriesId);

    // Optimistically update the UI immediately
    setBookmarkedSeries(prev => {
      const newSet = new Set(prev);
      newSet.delete(tvSeriesId);
      return newSet;
    });

    try {
      const response = await fetch(`/api/bookmarks?tvSeriesId=${tvSeriesId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        addToast({
          title: "Successfully removed TV series from Bookmarks",
          color: "success",
          variant: "solid",
        });
        // UI is already updated, no need to update again
      } else {
        console.error('Error removing TV series bookmark');

        // Rollback to previous state on error
        setBookmarkedSeries(prev => {
          const newSet = new Set(prev);
          if (wasBookmarked) {
            newSet.add(tvSeriesId);
          }
          return newSet;
        });

        // Show error toast
        addToast({
          title: "Failed to remove from bookmarks",
          description: "An error occurred",
          color: "danger",
          variant: "solid",
        });
      }
    } catch (error) {
      console.error('Error removing TV series bookmark:', error);

      // Rollback to previous state on error
      setBookmarkedSeries(prev => {
        const newSet = new Set(prev);
        if (wasBookmarked) {
          newSet.add(tvSeriesId);
        }
        return newSet;
      });

      // Show error toast
      addToast({
        title: "Failed to remove from bookmarks",
        description: "Network error occurred",
        color: "danger",
        variant: "solid",
      });
    }
  }, [bookmarkedSeries]);

  return {
    bookmarkedSeries,
    isBookmarkModalOpen,
    setIsBookmarkModalOpen,
    handleBookmarkSuccess,
    handleRemoveBookmark
  };
}
