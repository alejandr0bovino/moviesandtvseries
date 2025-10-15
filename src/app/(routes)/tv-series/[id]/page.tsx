'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Spinner } from "@heroui/react";
import { IconPhotoOff } from '@tabler/icons-react';

import '@vidstack/react/player/styles/base.css';
import '@vidstack/react/player/styles/plyr/theme.css';
import { formatRuntime } from '@/lib/utils';

import { useRemoveBodyScrollLock } from '@/hooks/useRemoveBodyScrollLock';
import { useTvSeriesBookmarks } from '@/hooks/useTvSeriesBookmarks';
import { useTvSeriesWatchlist } from '@/hooks/useTvSeriesWatchlist';
import { useTvSeriesLikesIndividual } from '@/hooks/useTvSeriesLikesIndividual';
import { TvSeries } from '@/types/tvSeries';

import { GlobalStats } from '@/components/GlobalStats';
import { GlobalPoster } from '@/components/GlobalPoster';
import { GlobalMedia } from '@/components/GlobalMedia';
import { GlobalDetails } from '@/components/GlobalDetails';
import { GlobalCast } from '@/components/GlobalCast';
import { GlobalGenres } from '@/components/GlobalGenres';
import { GlobalCrew } from '@/components/GlobalCrew';
import { GlobalProduction } from '@/components/GlobalProduction';
import ModalSignIn from '@/components/ModalSignIn';

export default function TvSeriePage() {
  useRemoveBodyScrollLock();
  const { id } = useParams();
  const [tvSerie, setTvSerie] = useState<TvSeries | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Custom hooks for TV series interactions
  const {
    bookmarkedSeries,
    isBookmarkModalOpen,
    setIsBookmarkModalOpen,
    handleBookmarkSuccess,
    handleRemoveBookmark,
  } = useTvSeriesBookmarks();

  const {
    watchlistedSeries,
    isWatchlistModalOpen,
    setIsWatchlistModalOpen,
    handleAddToWatchlist,
    handleRemoveFromWatchlist,
  } = useTvSeriesWatchlist();

  const {
    isLiked,
    likesCount,
    isLikeModalOpen,
    setIsLikeModalOpen,
    fetchLikes,
    fetchLikesCount,
    handleLikeTvSeries,
    handleUnlikeTvSeries,
  } = useTvSeriesLikesIndividual();

  useEffect(() => {
    const fetchTvSerie = async () => {
      try {
        const res = await fetch(`/api/tv-series/${id}`);
        if (!res.ok) throw new Error('Failed to fetch tvSerie');
        const data = await res.json();
        setTvSerie(data);
        console.log(">>>>>>>>>>>>>>>>>>", data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    };

    if (id) fetchTvSerie();
  }, [id]);

  // Fetch likes when TV series is loaded
  useEffect(() => {
    if (tvSerie?.id) {
      fetchLikes(tvSerie.id);
      fetchLikesCount(tvSerie.id);
    }
  }, [tvSerie?.id, fetchLikes, fetchLikesCount]);

  if (error) return (
    <>
      <hr className="mt-3 mb-6 hr-text" data-content="TV SERIES INFO" />
      <p>{error}</p>
    </>
  );

  if (!tvSerie) return (
    <>
      <hr className="mt-3 mb-6 hr-text" data-content="TV SERIES INFO" />
      <div className="flex justify-center items-center h-104 pt-10">
        <Spinner size="lg" />
      </div>
    </>
  );

  return (
    <>
      <hr className="mt-3 mb-6 hr-text" data-content="TV SERIES INFO" />

      <div className='flex flex-col gap-4'>

        <div className='md:flex justify-between'>
          <div className='mb-5 md:mb-0'>
            <h1 className='text-4xl font-semibold'>{tvSerie.name}</h1>
            <h2 className='text-lg font-semibold'>{tvSerie.tagline}</h2>

            <p>
              {tvSerie.first_air_date ? new Date(tvSerie.first_air_date).getFullYear() : 'Year N/A'} -&nbsp;
              {tvSerie.last_episode_to_air ? (
                <>
                  Last episode aired: {tvSerie.last_episode_to_air.air_date ?
                    new Date(tvSerie.last_episode_to_air.air_date).getFullYear() : 'Year N/A'} ({formatRuntime(tvSerie.last_episode_to_air.runtime)})
                </>
              ) : (
                'No episodes aired yet'
              )}
            </p>
          </div>

          <GlobalStats
            popularity={tvSerie.popularity}
            vote_average={tvSerie.vote_average}
            vote_count={tvSerie.vote_count}
            likesCount={likesCount}
            variant="tv-series"
          />

        </div>

        <div className='block lg:flex gap-2 mb-2'>
          <GlobalPoster
            media={tvSerie}
            bookmarkedItems={bookmarkedSeries}
            watchlistedItems={watchlistedSeries}
            isLiked={isLiked}
            onBookmark={handleBookmarkSuccess}
            onRemoveBookmark={handleRemoveBookmark}
            onAddToWatchlist={handleAddToWatchlist}
            onRemoveFromWatchlist={handleRemoveFromWatchlist}
            onLike={handleLikeTvSeries}
            onUnlike={handleUnlikeTvSeries}
            onOpenBookmarkModal={() => setIsBookmarkModalOpen(true)}
            onOpenWatchlistModal={() => setIsWatchlistModalOpen(true)}
            onOpenLikeModal={() => setIsLikeModalOpen(true)}
          />

          <GlobalMedia media={tvSerie} />

          <GlobalDetails media={tvSerie} mediaType="tv-series" />

        </div>

        <GlobalGenres genres={tvSerie.genres} mediaType="tv-series" />

        <p className="text-lg">{tvSerie.overview}</p>

        {tvSerie.seasons && tvSerie.seasons.length > 0 && (
          <>
            <hr className="-mt-2 -mb-4 hr-text" />
            <div>
              <div className='mb-2'><strong>Seasons</strong></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tvSerie.seasons.map((season) => (
                  <div key={season.id} className="border border-gray-300 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      {season.poster_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w92/${season.poster_path}`}
                          alt={`${season.name} poster`}
                          width={46}
                          height={69}
                          className="rounded object-cover saturate-65"
                        />
                      ) : (
                        <div className="w-[46px] h-[69px] bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs text-center">
                          <IconPhotoOff width={18} height={18} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm mb-1 truncate">{season.name}</h4>
                        <p className="text-xs text-gray-600 mb-1">
                          {season.air_date ? new Date(season.air_date).getFullYear() : 'TBA'} • {season.episode_count} episodes
                        </p>
                        {season.overview && (
                          <p className="text-xs text-gray-700 line-clamp-2">{season.overview}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <hr className="-mt-0 -mb-2 hr-text" />

        <GlobalCrew crew={tvSerie.crew} department="Directing" />

        <hr className="-mt-2 -mb-4 hr-text" />

        <GlobalCrew crew={tvSerie.crew} department="Writing" />

        <hr className="-mt-2 -mb-4 hr-text" />

        <GlobalCast cast={tvSerie.cast} />

        <GlobalCrew crew={tvSerie.crew} department="Production" />

        <hr className="-mt-4 -mb-4 hr-text" />

        <GlobalProduction production_companies={tvSerie.production_companies} />
      </div>

      {/* Bookmark Modal for unsigned users */}
      <ModalSignIn
        isOpen={isBookmarkModalOpen}
        onClose={() => setIsBookmarkModalOpen(false)}
        title="Bookmark tv series"
        message="Sign in to bookmark tv series."
      />

      {/* Watchlist Modal for unsigned users */}
      <ModalSignIn
        isOpen={isWatchlistModalOpen}
        onClose={() => setIsWatchlistModalOpen(false)}
        title="Add tv series to Watchlist"
        message="Sign in to add tv series to Watchlist."
      />

      {/* Like Modal for unsigned users */}
      <ModalSignIn
        isOpen={isLikeModalOpen}
        onClose={() => setIsLikeModalOpen(false)}
        title="Like tv series"
        message="Sign in to like tv series."
      />
    </>
  );
}