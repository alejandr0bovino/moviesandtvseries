import { useRouter } from 'next/navigation';

interface TvSeriesHandlersProps {
  sort: string;
  setCurrentPage: (page: number) => void;
  setTitleQuery: (query: string) => void;
  setYear: (year: string) => void;
  setGenre: (genre: string) => void;
  setSort: (sort: string) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  setFiltersVisible: (visible: boolean | ((prev: boolean) => boolean)) => void;
  setIsFilterAnimating: (animating: boolean) => void;
  setLoading?: (loading: boolean) => void;
  currentPage: number;
  year: string;
  genre: string;
  totalPages: number;
}

export function useTvSeriesHandlers({
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
}: TvSeriesHandlersProps) {
  const router = useRouter();

  // Function to update URL query parameters
  const updateQueryParams = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(window.location.search);

    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Always include sort in the URL
    if ('sort' in newParams) {
      if (newParams.sort) {
        params.set('sort', newParams.sort);
      } else {
        params.delete('sort');
      }
    } else if (sort) {
      params.set('sort', sort);
    }

    // Use replace instead of push for better performance
    router.replace(`/tv-series?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      updateQueryParams({ p: newPage.toString() });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handler for title search changes
  const handleTitleSearchChange = (val: string) => {
    setTitleQuery(val);
    // Reset to page 1 on search/filter changes
    if (currentPage !== 1) setCurrentPage(1);
    updateQueryParams({ s: val, p: '1' });
  };

  // Handler for year selection changes
  const handleYearChange = (selected: string) => {
    // Only update if the year actually changed or if it's being cleared
    if (selected !== year || selected === '') {
      // Set loading immediately to prevent UI glitch
      if (setLoading) {
        setLoading(true);
      }
      setYear(selected);
      if (currentPage !== 1) setCurrentPage(1);
      updateQueryParams({ y: selected, p: '1' });
    }
  };

  // Handler for genre selection changes
  const handleGenreChange = (selected: string) => {
    // Only update if the genre actually changed or if it's being cleared
    if (selected !== genre || selected === '') {
      // Set loading immediately to prevent UI glitch
      if (setLoading) {
        setLoading(true);
      }
      setGenre(selected);
      if (currentPage !== 1) setCurrentPage(1);
      updateQueryParams({ g: selected, p: '1' });
    }
  };

  // Add handler for sort change
  const handleSortChange = (selected: string) => {
    if (!selected) return; // Do nothing if 'Sort by' is selected
    // Only update if the sort actually changed
    if (selected !== sort) {
      setSort(selected);
      if (currentPage !== 1) setCurrentPage(1);
      updateQueryParams({ sort: selected, p: '1' });
    }
  };

  // Handler for view mode toggle
  const handleViewModeToggle = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    updateQueryParams({ v: mode });
  };

  // Handler for filters toggle
  const handleFiltersToggle = () => {
    setFiltersVisible(prev => !prev);
    setIsFilterAnimating(true);
    // Animation duration is 300ms as defined in the CSS transition
    setTimeout(() => setIsFilterAnimating(false), 300);
  };

  // Handler for clear search
  const handleClearSearch = () => {
    // Set loading immediately to prevent UI glitch and provide instant feedback
    if (setLoading) {
      setLoading(true);
    }
    setTitleQuery('');
    setCurrentPage(1);
    updateQueryParams({ s: '', p: '1' });
  };

  // Handler for clear filters
  const handleClearFilters = (defaultSort: string) => {
    // Set loading immediately to prevent UI glitch and provide instant feedback
    if (setLoading) {
      setLoading(true);
    }
    // Batch state updates for better performance
    setYear('');
    setGenre('');
    setSort(defaultSort);
    setCurrentPage(1);
    updateQueryParams({ y: '', g: '', sort: defaultSort, p: '1' });
  };

  return {
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
  };
}
