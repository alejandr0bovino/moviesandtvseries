import { useState, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { addToast } from "@heroui/react";

export function useTvSeriesLikesIndividual() {
  const { user } = useUser();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLikeModalOpen, setIsLikeModalOpen] = useState(false);

  // Fetch existing likes when component mounts
  const fetchLikes = useCallback(async (tvSeriesId: number) => {
    if (user && tvSeriesId) {
      try {
        const response = await fetch(`/api/likes/tv-series?tvSeriesId=${tvSeriesId}`);
        if (response.ok) {
          const likeData = await response.json();
          setIsLiked(likeData.length > 0);
        }
      } catch (error) {
        console.error('Error fetching TV series likes:', error);
      }
    }
  }, [user]);

  const fetchLikesCount = useCallback(async (tvSeriesId: number) => {
    if (tvSeriesId) {
      try {
        const response = await fetch(`/api/likes/tv-series/count?tvSeriesId=${tvSeriesId}`);
        if (response.ok) {
          const data = await response.json();
          setLikesCount(data.count);
        }
      } catch (error) {
        console.error('Error fetching likes count:', error);
      }
    }
  }, []);

  const handleLikeTvSeries = async (tvSeriesId: number, tvSeriesName: string) => {
    if (!user) return;

    setIsLiked(true);
    setLikesCount(prev => prev + 1);

    try {
      const response = await fetch('/api/likes/tv-series', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tvSeriesId, tvSeriesName }),
      });

      if (response.ok) {
        addToast({
          title: "Successfully added TV series to Likes",
          color: "success",
          variant: "solid",
        });
      } else {
        const errorData = await response.json();
        console.error('Error liking TV series:', errorData);
        setIsLiked(false);
        setLikesCount(prev => prev - 1);
        addToast({
          title: "Failed to like TV series",
          description: errorData.message || "An error occurred",
          color: "danger",
          variant: "solid",
        });
      }
    } catch (error) {
      console.error('Error liking TV series:', error);
      setIsLiked(false);
      setLikesCount(prev => prev - 1);
      addToast({
        title: "Failed to like TV series",
        description: "Network error occurred",
        color: "danger",
        variant: "solid",
      });
    }
  };

  const handleUnlikeTvSeries = async (tvSeriesId: number) => {
    if (!user) return;

    setIsLiked(false);
    setLikesCount(prev => Math.max(0, prev - 1));

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
      } else {
        console.error('Error unliking TV series');
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
        addToast({
          title: "Failed to unlike TV series",
          description: "An error occurred",
          color: "danger",
          variant: "solid",
        });
      }
    } catch (error) {
      console.error('Error unliking TV series:', error);
      setIsLiked(true);
      setLikesCount(prev => prev + 1);
      addToast({
        title: "Failed to unlike TV series",
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
    handleLikeTvSeries,
    handleUnlikeTvSeries,
  };
}
