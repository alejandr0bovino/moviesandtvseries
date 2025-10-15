import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { addToast } from "@heroui/react";

export function useWatchlist() {
  const [watchlistedMovies, setWatchlistedMovies] = useState<Set<number>>(new Set());
  const { user } = useUser();

  // Fetch existing watchlist when component mounts
  useEffect(() => {
    const fetchWatchlist = async () => {
      if (user) {
        try {
          const response = await fetch('/api/watchlist/movies');
          if (response.ok) {
            const watchlist = await response.json();
            const watchlistedIds = new Set<number>(watchlist.map((w: { movieId: number }) => w.movieId));
            setWatchlistedMovies(watchlistedIds);
          }
        } catch (error) {
          console.error('Error fetching movie watchlist:', error);
        }
      }
    };

    fetchWatchlist();
  }, [user]);

  const handleAddToWatchlist = useCallback(async (movieId: number, movieName: string) => {
    // Store the previous state for potential rollback
    const wasWatchlisted = watchlistedMovies.has(movieId);

    // Optimistically update the UI immediately
    setWatchlistedMovies(prev => new Set([...prev, movieId]));

    try {
      const response = await fetch('/api/watchlist/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          movieId,
          movieName,
        }),
      });

      if (response.ok) {
        addToast({
          title: "Successfully added movie to Watchlist",
          color: "success",
          variant: "solid",
        });
        // UI is already updated, no need to update again
      } else {
        const errorData = await response.json();
        console.error('Error adding movie to watchlist:', errorData);

        // Rollback to previous state on error
        setWatchlistedMovies(prev => {
          const newSet = new Set(prev);
          if (wasWatchlisted) {
            newSet.add(movieId);
          } else {
            newSet.delete(movieId);
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
      console.error('Error adding movie to watchlist:', error);

      // Rollback to previous state on error
      setWatchlistedMovies(prev => {
        const newSet = new Set(prev);
        if (wasWatchlisted) {
          newSet.add(movieId);
        } else {
          newSet.delete(movieId);
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
  }, [watchlistedMovies]);

  const handleRemoveFromWatchlist = useCallback(async (movieId: number) => {
    // Store the previous state for potential rollback
    const wasWatchlisted = watchlistedMovies.has(movieId);

    // Optimistically update the UI immediately
    setWatchlistedMovies(prev => {
      const newSet = new Set(prev);
      newSet.delete(movieId);
      return newSet;
    });

    try {
      const response = await fetch(`/api/watchlist/movies?movieId=${movieId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        addToast({
          title: "Successfully removed movie from Watchlist",
          color: "success",
          variant: "solid",
        });
        // UI is already updated, no need to update again
      } else {
        console.error('Error removing movie from watchlist');

        // Rollback to previous state on error
        setWatchlistedMovies(prev => {
          const newSet = new Set(prev);
          if (wasWatchlisted) {
            newSet.add(movieId);
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
      console.error('Error removing movie from watchlist:', error);

      // Rollback to previous state on error
      setWatchlistedMovies(prev => {
        const newSet = new Set(prev);
        if (wasWatchlisted) {
          newSet.add(movieId);
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
  }, [watchlistedMovies]);

  return {
    watchlistedMovies,
    handleAddToWatchlist,
    handleRemoveFromWatchlist
  };
}
