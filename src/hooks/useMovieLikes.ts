import { useState, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { addToast } from "@heroui/react";

export function useMovieLikes() {
  const { user } = useUser();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLikeModalOpen, setIsLikeModalOpen] = useState(false);

  // Fetch existing likes when component mounts
  const fetchLikes = useCallback(async (movieId: number) => {
    if (user && movieId) {
      try {
        const response = await fetch(`/api/likes/movies?movieId=${movieId}`);
        if (response.ok) {
          const likeData = await response.json();
          setIsLiked(likeData.length > 0);
        }
      } catch (error) {
        console.error('Error fetching movie likes:', error);
      }
    }
  }, [user]);

  const fetchLikesCount = useCallback(async (movieId: number) => {
    if (movieId) {
      try {
        const response = await fetch(`/api/likes/movies/count?movieId=${movieId}`);
        if (response.ok) {
          const data = await response.json();
          setLikesCount(data.count);
        }
      } catch (error) {
        console.error('Error fetching likes count:', error);
      }
    }
  }, []);

  const handleLikeMovie = async (movieId: number, movieName: string) => {
    if (!user) return;

    setIsLiked(true);
    setLikesCount(prev => prev + 1);

    try {
      const response = await fetch('/api/likes/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId, movieName }),
      });

      if (response.ok) {
        addToast({
          title: "Successfully added movie to Likes",
          color: "success",
          variant: "solid",
        });
      } else {
        const errorData = await response.json();
        console.error('Error liking movie:', errorData);
        setIsLiked(false);
        setLikesCount(prev => prev - 1);
        addToast({
          title: "Failed to like movie",
          description: errorData.message || "An error occurred",
          color: "danger",
          variant: "solid",
        });
      }
    } catch (error) {
      console.error('Error liking movie:', error);
      setIsLiked(false);
      setLikesCount(prev => prev - 1);
      addToast({
        title: "Failed to like movie",
        description: "Network error occurred",
        color: "danger",
        variant: "solid",
      });
    }
  };

  const handleUnlikeMovie = async (movieId: number) => {
    if (!user) return;

    setIsLiked(false);
    setLikesCount(prev => Math.max(0, prev - 1));

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
      } else {
        console.error('Error unliking movie');
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
        addToast({
          title: "Failed to unlike movie",
          description: "An error occurred",
          color: "danger",
          variant: "solid",
        });
      }
    } catch (error) {
      console.error('Error unliking movie:', error);
      setIsLiked(true);
      setLikesCount(prev => prev + 1);
      addToast({
        title: "Failed to unlike movie",
        description: "Network error occurred",
        color: "danger",
        variant: "solid",
      });
    }
  };

  return {
    isLiked,
    likesCount,
    isLikeModalOpen,
    setIsLikeModalOpen,
    fetchLikes,
    fetchLikesCount,
    handleLikeMovie,
    handleUnlikeMovie,
  };
}
