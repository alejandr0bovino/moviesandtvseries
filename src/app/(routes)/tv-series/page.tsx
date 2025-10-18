'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Alert } from "@heroui/react";
import { useDisclosure } from "@heroui/react";

import { ShareButton } from '@/components/ShareButton';
import GlobalCard from '@/components/GlobalCard';
import ViewToggle from '@/components/ViewToggle';
import GlobalSearchSection from '@/components/GlobalSearchSection';
import GlobalFiltersSection from '@/components/GlobalFiltersSection';
import Pagination from '@/components/Pagination';
import { MovieSkeletonGrid } from '@/components/MovieSkeletonGrid';

import { useUser } from '@clerk/nextjs';
import ModalSignIn from '@/components/ModalSignIn';

import { ViewMode } from '@/types/movies';
import { tvSeriesGenres, tvSeriesSortOptions } from '@/constants/movies';
import { useRemoveBodyScrollLock } from '@/hooks/useRemoveBodyScrollLock';
import { useTvSeries } from '@/hooks/useTvSeries';
import { useTvSeriesBookmarks } from '@/hooks/useTvSeriesBookmarks';
import { useTvSeriesWatchlist } from '@/hooks/useTvSeriesWatchlist';
import { useTvSeriesLikes } from '@/hooks/useTvSeriesLikes';
import { useTvSeriesHandlers } from '@/utils/tvSeriesHandlers';

type TvSerie = {
  id: number;
  name: string;
  poster_path: string;
  first_air_date?: string;
  genre_ids?: number[];
  overview?: string;
  vote_average?: number;
};

export default function TvSeries() {
  useRemoveBodyScrollLock();

  const searchParams = useSearchParams();
  const router = useRouter();
  const _pathname = usePathname();

  // Get initial values from URL search parameters
  const initialTitleQuery = searchParams.get('s') || '';
  const initialYear = searchParams.get('y') || '';
  const initialGenre = searchParams.get('g') || '';
  const initialPage = parseInt(searchParams.get('p') || '1', 10);
  const initialViewMode = searchParams.get('v') === 'list' ? 'list' : 'grid';
  const initialSort = searchParams.get('sort') || '';

  // Set initialSort to the first sort option if not present
  const [sort, setSort] = useState<string>(initialSort || tvSeriesSortOptions[0]?.value || 'popularity.desc');
  const [titleQuery, setTitleQuery] = useState<string>(initialTitleQuery);
  const [year, setYear] = useState<string>(initialYear);
  const [genre, setGenre] = useState<string>(initialGenre);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const [filtersVisible, setFiltersVisible] = useState<boolean>(true);
  const [isFilterAnimating, setIsFilterAnimating] = useState<boolean>(false);

  // Use custom hooks for data management
  const { tvSeries, loading, error, totalPages, hasInitialLoad, setLoading, fetchTvSeries } = useTvSeries({
    titleQuery,
    year,
    genre,
    currentPage,
    sort
  });

  const { bookmarkedSeries, handleBookmarkSuccess, handleRemoveBookmark } = useTvSeriesBookmarks();
  const { watchlistedSeries, handleAddToWatchlist, handleRemoveFromWatchlist } = useTvSeriesWatchlist();
  const { likedSeries, seriesLikesCount, fetchLikesCount, refreshLikesCount, handleLikeSeries, handleUnlikeSeries } = useTvSeriesLikes();

  // Modal state
  const { isOpen: isBookmarkModalOpen, onOpen: onBookmarkModalOpen, onClose: onBookmarkModalClose } = useDisclosure();
  const { isOpen: isWatchlistModalOpen, onOpen: onWatchlistModalOpen, onClose: onWatchlistModalClose } = useDisclosure();
  const { isOpen: isLikeModalOpen, onOpen: onLikeModalOpen, onClose: onLikeModalClose } = useDisclosure();
  const [_showSuccessAlert, _setShowSuccessAlert] = useState(false);

  const { user } = useUser();

  const genreOptions = [...tvSeriesGenres.map(g => ({
    key: g.id,
    label: g.name
  }))];

  // Use the TV series handlers hook
  const {
    updateQueryParams,
    handlePageChange,
    handleTitleSearchChange,
    handleYearChange,
    handleGenreChange,
    handleSortChange,
    handleViewModeToggle,
    handleFiltersToggle,
    handleClearSearch,
    handleClearFilters
  } = useTvSeriesHandlers({
    sort,
    setCurrentPage,
    setTitleQuery,
    setYear,
    setGenre,
    setSort,
    setViewMode,
    setFiltersVisible,
    setIsFilterAnimating,
    setLoading,
    currentPage,
    year,
    genre,
    totalPages
  });

  // Fetch likes count for current TV series when component mounts
  useEffect(() => {
    if (tvSeries.length > 0) {
      fetchLikesCount(tvSeries.map(tv => tv.id));
    }
  }, [tvSeries, fetchLikesCount]);

  // Scroll to top on initial load (client-side effect)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Helper to decide skeleton count
  const getSkeletonCount = () => {
    if (titleQuery) return 6; // Searching: fewer results expected
    if (year || genre) return 10; // Filtering: moderate
    return 20; // Browsing: full page
  };

  return (
    <>
      <hr className="mt-3 mb-6 hr-text" data-content="TV SERIES" />

      <div className="block xl:flex items-center gap-4 justify-between">
        <GlobalSearchSection
          titleQuery={titleQuery}
          filtersVisible={filtersVisible}
          onTitleSearchChange={handleTitleSearchChange}
          onClearSearch={handleClearSearch}
          onFiltersToggle={handleFiltersToggle}
        />

        <div className='block xl:flex xl:gap-4'>
          {viewMode && <ViewToggle viewMode={viewMode} onViewModeToggle={handleViewModeToggle} />}
          <ShareButton />
        </div>
      </div>

      <div
        className={`block xl:flex gap-4 items-center transition-all duration-300 ease-in-out 
          ${filtersVisible
            ? 'transform translate-y-0 opacity-100 xl:max-h-20 mt-3 xl:mt-5'
            : 'transform -translate-y-full opacity-0 max-h-0 overflow-hidden'
          }`}
      >
        <GlobalFiltersSection
          year={year}
          genre={genre}
          sort={sort}
          titleQuery={titleQuery}
          isFilterAnimating={isFilterAnimating}
          genreOptions={genreOptions}
          sortOptions={tvSeriesSortOptions}
          onYearChange={handleYearChange}
          onGenreChange={handleGenreChange}
          onSortChange={handleSortChange}
          onClearFilters={handleClearFilters}
        />
      </div>

      <hr className="mt-6 mb-6.5 hr-text" />

      <div>
        {error && <p>Error: {error}</p>}

        {!loading && tvSeries.length === 0 && !error && hasInitialLoad && (
          <div className="flex items-center justify-center w-70 m-auto h-64">
            <Alert description="Please try a different search." title="No results found" variant="bordered" />
          </div>
        )}
        {loading ? (
          <MovieSkeletonGrid count={getSkeletonCount()} viewMode={viewMode} />
        ) : (
          <div className="space-y-10">
            <ul
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10 justify-items-center'
                  : 'flex flex-col gap-6'
              }
            >
              {tvSeries.map((tvSerie) => (
                <GlobalCard
                  key={tvSerie.id}
                  mediaItem={{
                    ...tvSerie,
                    type: 'tv-series' as const
                  }}
                  viewMode={viewMode}
                  bookmarkedItems={bookmarkedSeries}
                  watchlistedItems={watchlistedSeries}
                  likedItems={likedSeries}
                  likesCount={seriesLikesCount}
                  selectedGenre={genre}
                  onBookmarkSuccess={handleBookmarkSuccess}
                  onRemoveBookmark={handleRemoveBookmark}
                  onAddToWatchlist={handleAddToWatchlist}
                  onRemoveFromWatchlist={handleRemoveFromWatchlist}
                  onLikeItem={handleLikeSeries}
                  onUnlikeItem={handleUnlikeSeries}
                  onBookmarkModalOpen={onBookmarkModalOpen}
                  onWatchlistModalOpen={onWatchlistModalOpen}
                  onLikeModalOpen={onLikeModalOpen}
                />
              ))}
            </ul>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                loading={loading}
              />
            )}
          </div>
        )}
      </div>

      <ModalSignIn
        isOpen={isBookmarkModalOpen}
        onClose={onBookmarkModalClose}
        title="Bookmark TV series"
        message="Sign in to bookmark TV series."
      />

      <ModalSignIn
        isOpen={isWatchlistModalOpen}
        onClose={onWatchlistModalClose}
        title="Add TV series to Watchlist"
        message="Sign in to add TV series to Watchlist."
      />

      <ModalSignIn
        isOpen={isLikeModalOpen}
        onClose={onLikeModalClose}
        title="Like TV series"
        message="Sign in to like TV series."
      />
    </>
  );
}