'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Spinner } from "@heroui/react";

import '@vidstack/react/player/styles/base.css';
import '@vidstack/react/player/styles/plyr/theme.css';
import { formatRuntime } from '@/lib/utils';

import { useRemoveBodyScrollLock } from '@/hooks/useRemoveBodyScrollLock';
import { useMovieBookmarks } from '@/hooks/useMovieBookmarks';
import { useMovieWatchlist } from '@/hooks/useMovieWatchlist';
import { useMovieLikes } from '@/hooks/useMovieLikes';
import { Movie } from '@/types/movie';

import { GlobalStats } from '@/components/GlobalStats';
import { GlobalPoster } from '@/components/GlobalPoster';
import { GlobalMedia } from '@/components/GlobalMedia';
import { GlobalDetails } from '@/components/GlobalDetails';
import { GlobalCast } from '@/components/GlobalCast';
import { GlobalGenres } from '@/components/GlobalGenres';
import { GlobalCrew } from '@/components/GlobalCrew';
import { GlobalProduction } from '@/components/GlobalProduction';
import ModalSignIn from '@/components/ModalSignIn';

export default function MoviePage() {
  useRemoveBodyScrollLock();
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Custom hooks for movie interactions
  const {
    bookmarkedMovies,
    isBookmarkModalOpen,
    setIsBookmarkModalOpen,
    handleBookmarkSuccess,
    handleRemoveBookmark,
  } = useMovieBookmarks();

  const {
    watchlistedMovies,
    isWatchlistModalOpen,
    setIsWatchlistModalOpen,
    handleAddToWatchlist,
    handleRemoveFromWatchlist,
  } = useMovieWatchlist();

  const {
    isLiked,
    likesCount,
    isLikeModalOpen,
    setIsLikeModalOpen,
    fetchLikes,
    fetchLikesCount,
    handleLikeMovie,
    handleUnlikeMovie,
  } = useMovieLikes();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(`/api/movies/${id}`);
        if (!res.ok) throw new Error('Failed to fetch movie');
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    };

    if (id) fetchMovie();
  }, [id]);

  // Fetch likes when movie is loaded
  useEffect(() => {
    if (movie?.id) {
      fetchLikes(movie.id);
      fetchLikesCount(movie.id);
    }
  }, [movie?.id, fetchLikes, fetchLikesCount]);


  if (error) return (
    <>
      <hr className="mt-3 mb-6 hr-text" data-content="MOVIE INFO" />
      <p>{error}</p>
    </>
  );

  if (!movie) return (
    <>
      <hr className="mt-3 mb-6 hr-text" data-content="MOVIE INFO" />
      <div className="flex justify-center items-center h-104 pt-10">
        <Spinner size="lg" />
      </div>
    </>
  );

  return (
    <>
      <hr className="mt-3 mb-6 hr-text" data-content="MOVIE INFO" />

      <div className='flex flex-col gap-4'>

        <div className='md:flex justify-between'>
          <div className='mb-5 md:mb-0'>
            <h1 className='text-4xl font-semibold'>{movie.title}</h1>
            <h2 className='text-lg font-semibold'>{movie.tagline}</h2>

            <p>
              {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Year N/A'} - {formatRuntime(movie.runtime)}
            </p>
          </div>

          <GlobalStats
            popularity={movie.popularity}
            vote_average={movie.vote_average}
            vote_count={movie.vote_count}
            likesCount={likesCount}
            variant="movie"
          />

        </div>

        <div className='block lg:flex gap-2 mb-2'>

          <GlobalPoster
            media={movie}
            bookmarkedItems={bookmarkedMovies}
            watchlistedItems={watchlistedMovies}
            isLiked={isLiked}
            onBookmark={handleBookmarkSuccess}
            onRemoveBookmark={handleRemoveBookmark}
            onAddToWatchlist={handleAddToWatchlist}
            onRemoveFromWatchlist={handleRemoveFromWatchlist}
            onLike={handleLikeMovie}
            onUnlike={handleUnlikeMovie}
            onOpenBookmarkModal={() => setIsBookmarkModalOpen(true)}
            onOpenWatchlistModal={() => setIsWatchlistModalOpen(true)}
            onOpenLikeModal={() => setIsLikeModalOpen(true)}
          />

          <GlobalMedia media={movie} />

          <GlobalDetails media={movie} mediaType="movie" />
        </div>

        <GlobalGenres genres={movie.genres} mediaType="movie" />

        <p className="text-lg">{movie.overview}</p>

        <hr className="-mt-2 -mb-4 hr-text" />

        <GlobalCrew crew={movie.crew} department="Directing" />

        <hr className="-mt-2 -mb-4 hr-text" />

        <GlobalCrew crew={movie.crew} department="Writing" />

        <hr className="-mt-2 -mb-4 hr-text" />

        <GlobalCast cast={movie.cast} />

        <GlobalCrew crew={movie.crew} department="Production" />

        <hr className="-mt-4 -mb-4 hr-text" />

        <GlobalProduction production_companies={movie.production_companies} />
      </div>

      {/* Bookmark Modal for unsigned users */}
      <ModalSignIn
        isOpen={isBookmarkModalOpen}
        onClose={() => setIsBookmarkModalOpen(false)}
        title="Bookmark movie"
        message="Sign in to bookmark movies."
      />

      {/* Watchlist Modal for unsigned users */}
      <ModalSignIn
        isOpen={isWatchlistModalOpen}
        onClose={() => setIsWatchlistModalOpen(false)}
        title="Add movie to Watchlist"
        message="Sign in to add movies to Watchlist."
      />

      {/* Like Modal for unsigned users */}
      <ModalSignIn
        isOpen={isLikeModalOpen}
        onClose={() => setIsLikeModalOpen(false)}
        title="Like movie"
        message="Sign in to like movies."
      />
    </>
  );
}