import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { addToast } from "@heroui/react";

export function useLikes() {
  const [likedMovies, setLikedMovies] = useState<Set<number>>(new Set());
  const [movieLikesCount, setMovieLikesCount] = useState<Record<number, number>>({});
  const { user } = useUser();

  // Fetch existing likes when component mounts
  useEffect(() => {
    const fetchLikes = async () => {
      if (user) {
        try {
          const response = await fetch('/api/likes/movies');
          if (response.ok) {
            const likes = await response.json();
            const likedIds = new Set<number>(likes.map((l: { contentId: number }) => l.contentId));
            setLikedMovies(likedIds);
          }
        } catch (error) {
          console.error('Error fetching movie likes:', error);
        }
      }
    };

    fetchLikes();
  }, [user]);

  // Function to fetch likes count for movies - memoized to prevent infinite loops
  const fetchLikesCount = useCallback(async (movieIds: number[]) => {
    try {
      const counts: Record<number, number> = {};
      await Promise.all(
        movieIds.map(async (movieId) => {
          const response = await fetch(`/api/likes/movies/count?movieId=${movieId}`);
          if (response.ok) {
            const data = await response.json();
            counts[movieId] = data.count;
          }
        })
      );
      setMovieLikesCount(prev => ({ ...prev, ...counts }));
    } catch (error) {
      console.error('Error fetching likes count:', error);
    }
  }, []);

  // Function to refresh likes count for a specific movie - memoized
  const refreshLikesCount = useCallback(async (movieId: number) => {
    try {
      const response = await fetch(`/api/likes/movies/count?movieId=${movieId}`);
      if (response.ok) {
        const data = await response.json();
        setMovieLikesCount(prev => ({
          ...prev,
          [movieId]: data.count
        }));
      }
    } catch (error) {
      console.error('Error refreshing likes count:', error);
    }
  }, []);

  const handleLikeMovie = useCallback(async (movieId: number, movieName: string) => {
    // Store the previous state for potential rollback
    const wasLiked = likedMovies.has(movieId);

    // Optimistically update the UI immediately
    setLikedMovies(prev => new Set([...prev, movieId]));
    setMovieLikesCount(prev => ({
      ...prev,
      [movieId]: (prev[movieId] || 0) + 1
    }));

    try {
      const response = await fetch('/api/likes/movies', {
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
          title: "Successfully added movie to Likes",
          color: "success",
          variant: "solid",
        });
        // Refresh the likes count to get the accurate number
        refreshLikesCount(movieId);
      } else {
        const errorData = await response.json();
        console.error('Error liking movie:', errorData);

        // Rollback to previous state on error
        setLikedMovies(prev => {
          const newSet = new Set(prev);
          if (wasLiked) {
            newSet.add(movieId);
          } else {
            newSet.delete(movieId);
          }
          return newSet;
        });
        setMovieLikesCount(prev => ({
          ...prev,
          [movieId]: Math.max(0, (prev[movieId] || 0) - 1)
        }));

        // Show error toast
        addToast({
          title: "Failed to like movie",
          description: errorData.message || "An error occurred",
          color: "danger",
          variant: "solid",
        });
      }
    } catch (error) {
      console.error('Error liking movie:', error);

      // Rollback to previous state on error
      setLikedMovies(prev => {
        const newSet = new Set(prev);
        if (wasLiked) {
          newSet.add(movieId);
        } else {
          newSet.delete(movieId);
        }
        return newSet;
      });
      setMovieLikesCount(prev => ({
        ...prev,
        [movieId]: Math.max(0, (prev[movieId] || 0) - 1)
      }));

      // Show error toast
      addToast({
        title: "Failed to like movie",
        description: "Network error occurred",
        color: "danger",
        variant: "solid",
      });
    }
  }, [likedMovies, movieLikesCount, refreshLikesCount]);

  const handleUnlikeMovie = useCallback(async (movieId: number) => {
    // Store the previous state for potential rollback
    const wasLiked = likedMovies.has(movieId);

    // Optimistically update the UI immediately
    setLikedMovies(prev => {
      const newSet = new Set(prev);
      newSet.delete(movieId);
      return newSet;
    });
    setMovieLikesCount(prev => ({
      ...prev,
      [movieId]: Math.max(0, (prev[movieId] || 0) - 1)
    }));

    try {
      const response = await fetch(`/api/likes/movies?movieId=${movieId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        addToast({
          title: "Successfully removed movie from Likes",
          color: "success",
          variant: "solid",
        });
        // Refresh the likes count to get the accurate number
        refreshLikesCount(movieId);
      } else {
        const errorData = await response.json();
        console.error('Error unliking movie:', errorData);

        // Rollback to previous state on error
        setLikedMovies(prev => {
          const newSet = new Set(prev);
          if (wasLiked) {
            newSet.add(movieId);
          } else {
            newSet.delete(movieId);
          }
          return newSet;
        });
        setMovieLikesCount(prev => ({
          ...prev,
          [movieId]: (prev[movieId] || 0) + 1
        }));

        // Show error toast
        addToast({
          title: "Failed to unlike movie",
          description: errorData.message || "An error occurred",
          color: "danger",
          variant: "solid",
        });
      }
    } catch (error) {
      console.error('Error unliking movie:', error);

      // Rollback to previous state on error
      setLikedMovies(prev => {
        const newSet = new Set(prev);
        if (wasLiked) {
          newSet.add(movieId);
        } else {
          newSet.delete(movieId);
        }
        return newSet;
      });
      setMovieLikesCount(prev => ({
        ...prev,
        [movieId]: (prev[movieId] || 0) + 1
      }));

      // Show error toast
      addToast({
        title: "Failed to unlike movie",
        description: "Network error occurred",
        color: "danger",
        variant: "solid",
      });
    }
  }, [likedMovies, movieLikesCount, refreshLikesCount]);

  return {
    likedMovies,
    movieLikesCount,
    fetchLikesCount,
    refreshLikesCount,
    handleLikeMovie,
    handleUnlikeMovie
  };
}
