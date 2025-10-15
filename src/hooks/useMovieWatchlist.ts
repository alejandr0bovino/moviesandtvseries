import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { addToast } from "@heroui/react";

export function useMovieWatchlist() {
  const { user } = useUser();
  const [watchlistedMovies, setWatchlistedMovies] = useState<Set<number>>(new Set());
  const [isWatchlistModalOpen, setIsWatchlistModalOpen] = useState(false);

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

  const handleAddToWatchlist = async (movieId: number, movieName: string) => {
    const wasWatchlisted = watchlistedMovies.has(movieId);
    setWatchlistedMovies(prev => new Set([...prev, movieId]));

    try {
      const response = await fetch('/api/watchlist/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId, movieName }),
      });

      if (response.ok) {
        addToast({
          title: "Successfully added movie to Watchlist",
          color: "success",
          variant: "solid",
        });
      } else {
        const errorData = await response.json();
        console.error('Error adding movie to watchlist:', errorData);
        setWatchlistedMovies(prev => {
          const newSet = new Set(prev);
          if (wasWatchlisted) {
            newSet.add(movieId);
          } else {
            newSet.delete(movieId);
          }
          return newSet;
        });
        addToast({
          title: "Failed to add to watchlist",
          description: errorData.message || "An error occurred",
          color: "danger",
          variant: "solid",
        });
      }
    } catch (error) {
      console.error('Error adding movie to watchlist:', error);
      setWatchlistedMovies(prev => {
        const newSet = new Set(prev);
        if (wasWatchlisted) {
          newSet.add(movieId);
        } else {
          newSet.delete(movieId);
        }
        return newSet;
      });
      addToast({
        title: "Failed to add to watchlist",
        description: "Network error occurred",
        color: "danger",
        variant: "solid",
      });
    }
  };

  const handleRemoveFromWatchlist = async (movieId: number) => {
    const wasWatchlisted = watchlistedMovies.has(movieId);
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
      } else {
        console.error('Error removing movie from watchlist');
        setWatchlistedMovies(prev => {
          const newSet = new Set(prev);
          if (wasWatchlisted) {
            newSet.add(movieId);
          }
          return newSet;
        });
        addToast({
          title: "Failed to remove from watchlist",
          description: "An error occurred",
          color: "danger",
          variant: "solid",
        });
      }
    } catch (error) {
      console.error('Error removing movie from watchlist:', error);
      setWatchlistedMovies(prev => {
        const newSet = new Set(prev);
        if (wasWatchlisted) {
          newSet.add(movieId);
        }
        return newSet;
      });
      addToast({
        title: "Failed to remove from watchlist",
        description: "Network error occurred",
        color: "danger",
        variant: "solid",
      });
    }
  };

  return {
    watchlistedMovies,
    isWatchlistModalOpen,
    setIsWatchlistModalOpen,
    handleAddToWatchlist,
    handleRemoveFromWatchlist,
  };
}
