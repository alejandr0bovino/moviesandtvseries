import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { addToast } from "@heroui/react";

export function useBookmarks() {
  const [bookmarkedMovies, setBookmarkedMovies] = useState<Set<number>>(new Set());
  const { user } = useUser();

  // Fetch existing bookmarks when component mounts
  useEffect(() => {
    const fetchBookmarks = async () => {
      if (user) {
        try {
          const response = await fetch('/api/bookmarks/movies');
          if (response.ok) {
            const bookmarks = await response.json();
            const bookmarkedIds = new Set<number>(bookmarks.map((b: { movieId: number }) => b.movieId));
            setBookmarkedMovies(bookmarkedIds);
          }
        } catch (error) {
          console.error('Error fetching movie bookmarks:', error);
        }
      }
    };

    fetchBookmarks();
  }, [user]);

  const handleBookmarkSuccess = useCallback(async (movieId: number, movieName: string) => {
    // Store the previous state for potential rollback
    const wasBookmarked = bookmarkedMovies.has(movieId);

    // Optimistically update the UI immediately
    setBookmarkedMovies(prev => new Set([...prev, movieId]));

    try {
      const response = await fetch('/api/bookmarks/movies', {
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
          title: "Successfully added movie to Bookmarks",
          color: "success",
          variant: "solid",
        });
        // UI is already updated, no need to update again
      } else {
        const errorData = await response.json();
        console.error('Error creating movie bookmark:', errorData);

        // Rollback to previous state on error
        setBookmarkedMovies(prev => {
          const newSet = new Set(prev);
          if (wasBookmarked) {
            newSet.add(movieId);
          } else {
            newSet.delete(movieId);
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
      console.error('Error creating movie bookmark:', error);

      // Rollback to previous state on error
      setBookmarkedMovies(prev => {
        const newSet = new Set(prev);
        if (wasBookmarked) {
          newSet.add(movieId);
        } else {
          newSet.delete(movieId);
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
  }, [bookmarkedMovies]);

  const handleRemoveBookmark = useCallback(async (movieId: number) => {
    // Store the previous state for potential rollback
    const wasBookmarked = bookmarkedMovies.has(movieId);

    // Optimistically update the UI immediately
    setBookmarkedMovies(prev => {
      const newSet = new Set(prev);
      newSet.delete(movieId);
      return newSet;
    });

    try {
      const response = await fetch(`/api/bookmarks/movies?movieId=${movieId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        addToast({
          title: "Successfully removed movie from Bookmarks",
          color: "success",
          variant: "solid",
        });
        // UI is already updated, no need to update again
      } else {
        console.error('Error removing movie bookmark');

        // Rollback to previous state on error
        setBookmarkedMovies(prev => {
          const newSet = new Set(prev);
          if (wasBookmarked) {
            newSet.add(movieId);
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
      console.error('Error removing movie bookmark:', error);

      // Rollback to previous state on error
      setBookmarkedMovies(prev => {
        const newSet = new Set(prev);
        if (wasBookmarked) {
          newSet.add(movieId);
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
  }, [bookmarkedMovies]);

  return {
    bookmarkedMovies,
    handleBookmarkSuccess,
    handleRemoveBookmark
  };
}
