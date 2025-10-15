import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { addToast } from "@heroui/react";

export function useMovieBookmarks() {
  const { user } = useUser();
  const [bookmarkedMovies, setBookmarkedMovies] = useState<Set<number>>(new Set());
  const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);

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

  const handleBookmarkSuccess = async (movieId: number, movieName: string) => {
    const wasBookmarked = bookmarkedMovies.has(movieId);
    setBookmarkedMovies(prev => new Set([...prev, movieId]));

    try {
      const response = await fetch('/api/bookmarks/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId, movieName }),
      });

      if (response.ok) {
        addToast({
          title: "Successfully added movie to Bookmarks",
          color: "success",
          variant: "solid",
        });
      } else {
        const errorData = await response.json();
        console.error('Error creating movie bookmark:', errorData);
        setBookmarkedMovies(prev => {
          const newSet = new Set(prev);
          if (wasBookmarked) {
            newSet.add(movieId);
          } else {
            newSet.delete(movieId);
          }
          return newSet;
        });
        addToast({
          title: "Failed to add to bookmarks",
          description: errorData.message || "An error occurred",
          color: "danger",
          variant: "solid",
        });
      }
    } catch (error) {
      console.error('Error creating movie bookmark:', error);
      setBookmarkedMovies(prev => {
        const newSet = new Set(prev);
        if (wasBookmarked) {
          newSet.add(movieId);
        } else {
          newSet.delete(movieId);
        }
        return newSet;
      });
      addToast({
        title: "Failed to add to bookmarks",
        description: "Network error occurred",
        color: "danger",
        variant: "solid",
      });
    }
  };

  const handleRemoveBookmark = async (movieId: number) => {
    const wasBookmarked = bookmarkedMovies.has(movieId);
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
      } else {
        console.error('Error removing movie bookmark');
        setBookmarkedMovies(prev => {
          const newSet = new Set(prev);
          if (wasBookmarked) {
            newSet.add(movieId);
          }
          return newSet;
        });
        addToast({
          title: "Failed to remove from bookmarks",
          description: "An error occurred",
          color: "danger",
          variant: "solid",
        });
      }
    } catch (error) {
      console.error('Error removing movie bookmark:', error);
      setBookmarkedMovies(prev => {
        const newSet = new Set(prev);
        if (wasBookmarked) {
          newSet.add(movieId);
        }
        return newSet;
      });
      addToast({
        title: "Failed to remove from bookmarks",
        description: "Network error occurred",
        color: "danger",
        variant: "solid",
      });
    }
  };

  return {
    bookmarkedMovies,
    isBookmarkModalOpen,
    setIsBookmarkModalOpen,
    handleBookmarkSuccess,
    handleRemoveBookmark,
  };
}
