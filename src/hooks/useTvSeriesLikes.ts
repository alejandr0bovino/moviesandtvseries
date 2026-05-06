import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { addToast } from "@heroui/react";

export function useTvSeriesLikes() {
  const [likedSeries, setLikedSeries] = useState<Set<number>>(new Set());
  const [seriesLikesCount, setSeriesLikesCount] = useState<Record<number, number>>({});
  const [isLikeModalOpen, setIsLikeModalOpen] = useState(false);
  const { user } = useUser();

  // Fetch existing likes when component mounts
  useEffect(() => {
    const fetchLikes = async () => {
      if (user) {
        try {
          const response = await fetch('/api/likes/tv-series');
          if (response.ok) {
            const likes = await response.json();
            const likedIds = new Set<number>(likes.map((l: { contentId: number }) => l.contentId));
            setLikedSeries(likedIds);
          }
        } catch (error) {
          console.error('Error fetching TV series likes:', error);
        }
      }
    };

    fetchLikes();
  }, [user]);

  // Function to fetch likes count for TV series - memoized to prevent infinite loops
  const fetchLikesCount = useCallback(async (seriesIds: number[]) => {
    try {
      if (seriesIds.length === 0) return;

      const uniqueIds = Array.from(new Set(seriesIds));
      const response = await fetch(`/api/likes/tv-series/count?tvSeriesIds=${uniqueIds.join(',')}`);
      if (!response.ok) return;

      const data = await response.json();
      const counts = data.counts as Record<number, number> | undefined;
      if (counts) {
        setSeriesLikesCount(prev => ({ ...prev, ...counts }));
      }
    } catch (error) {
      console.error('Error fetching TV series likes count:', error);
    }
  }, []);

  // Function to refresh likes count for a specific TV series - memoized
  const refreshLikesCount = useCallback(async (seriesId: number) => {
    try {
      const response = await fetch(`/api/likes/tv-series/count?tvSeriesId=${seriesId}`);
      if (response.ok) {
        const data = await response.json();
        setSeriesLikesCount(prev => ({
          ...prev,
          [seriesId]: data.count
        }));
      }
    } catch (error) {
      console.error('Error refreshing TV series likes count:', error);
    }
  }, []);

  const handleLikeSeries = useCallback(async (tvSeriesId: number, tvSeriesName: string) => {
    // Store the previous state for potential rollback
    const wasLiked = likedSeries.has(tvSeriesId);

    // Optimistically update the UI immediately
    setLikedSeries(prev => new Set([...prev, tvSeriesId]));
    setSeriesLikesCount(prev => ({
      ...prev,
      [tvSeriesId]: (prev[tvSeriesId] || 0) + 1
    }));

    try {
      const response = await fetch('/api/likes/tv-series', {
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
          title: "Successfully added TV series to Likes",
          color: "success",
          variant: "solid",
        });
        // Refresh the likes count to get the accurate number
        refreshLikesCount(tvSeriesId);
      } else {
        const errorData = await response.json();
        console.error('Error liking TV series:', errorData);

        // Rollback to previous state on error
        setLikedSeries(prev => {
          const newSet = new Set(prev);
          if (wasLiked) {
            newSet.add(tvSeriesId);
          } else {
            newSet.delete(tvSeriesId);
          }
          return newSet;
        });
        setSeriesLikesCount(prev => ({
          ...prev,
          [tvSeriesId]: Math.max(0, (prev[tvSeriesId] || 0) - 1)
        }));

        // Show error toast
        addToast({
          title: "Failed to like TV series",
          description: errorData.message || "An error occurred",
          color: "danger",
          variant: "solid",
        });
      }
    } catch (error) {
      console.error('Error liking TV series:', error);

      // Rollback to previous state on error
      setLikedSeries(prev => {
        const newSet = new Set(prev);
        if (wasLiked) {
          newSet.add(tvSeriesId);
        } else {
          newSet.delete(tvSeriesId);
        }
        return newSet;
      });
      setSeriesLikesCount(prev => ({
        ...prev,
        [tvSeriesId]: Math.max(0, (prev[tvSeriesId] || 0) - 1)
      }));

      // Show error toast
      addToast({
        title: "Failed to like TV series",
        description: "Network error occurred",
        color: "danger",
        variant: "solid",
      });
    }
  }, [likedSeries, seriesLikesCount, refreshLikesCount]);

  const handleUnlikeSeries = useCallback(async (tvSeriesId: number) => {
    // Store the previous state for potential rollback
    const wasLiked = likedSeries.has(tvSeriesId);

    // Optimistically update the UI immediately
    setLikedSeries(prev => {
      const newSet = new Set(prev);
      newSet.delete(tvSeriesId);
      return newSet;
    });
    setSeriesLikesCount(prev => ({
      ...prev,
      [tvSeriesId]: Math.max(0, (prev[tvSeriesId] || 0) - 1)
    }));

    try {
      const response = await fetch(`/api/likes/tv-series?tvSeriesId=${tvSeriesId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        addToast({
          title: "Successfully removed TV series from Likes",
          color: "success",
          variant: "solid",
        });
        // Refresh the likes count to get the accurate number
        refreshLikesCount(tvSeriesId);
      } else {
        const errorData = await response.json();
        console.error('Error unliking TV series:', errorData);

        // Rollback to previous state on error
        setLikedSeries(prev => {
          const newSet = new Set(prev);
          if (wasLiked) {
            newSet.add(tvSeriesId);
          }
          return newSet;
        });
        setSeriesLikesCount(prev => ({
          ...prev,
          [tvSeriesId]: (prev[tvSeriesId] || 0) + 1
        }));

        // Show error toast
        addToast({
          title: "Failed to unlike TV series",
          description: errorData.message || "An error occurred",
          color: "danger",
          variant: "solid",
        });
      }
    } catch (error) {
      console.error('Error unliking TV series:', error);

      // Rollback to previous state on error
      setLikedSeries(prev => {
        const newSet = new Set(prev);
        if (wasLiked) {
          newSet.add(tvSeriesId);
        }
        return newSet;
      });
      setSeriesLikesCount(prev => ({
        ...prev,
        [tvSeriesId]: (prev[tvSeriesId] || 0) + 1
      }));

      // Show error toast
      addToast({
        title: "Failed to unlike TV series",
        description: "Network error occurred",
        color: "danger",
        variant: "solid",
      });
    }
  }, [likedSeries, seriesLikesCount, refreshLikesCount]);

  return {
    likedSeries,
    seriesLikesCount,
    isLikeModalOpen,
    setIsLikeModalOpen,
    fetchLikesCount,
    refreshLikesCount,
    handleLikeSeries,
    handleUnlikeSeries
  };
}
