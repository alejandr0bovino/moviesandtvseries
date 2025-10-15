import { useState, useEffect, useRef, useCallback } from 'react';

type TvSerie = {
  id: number;
  name: string;
  poster_path: string;
  first_air_date?: string;
  genre_ids?: number[];
  overview?: string;
  vote_average?: number;
};

interface UseTvSeriesParams {
  titleQuery: string;
  year: string;
  genre: string;
  currentPage: number;
  sort: string;
}

interface UseTvSeriesReturn {
  tvSeries: TvSerie[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  hasInitialLoad: boolean;
  setLoading: (loading: boolean) => void;
  fetchTvSeries: (selectedYear?: string, selectedGenre?: string, selectedTitleQuery?: string, pageNum?: number, selectedSort?: string) => Promise<void>;
}

export function useTvSeries({ titleQuery, year, genre, currentPage, sort }: UseTvSeriesParams): UseTvSeriesReturn {
  const [tvSeries, setTvSeries] = useState<TvSerie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasInitialLoad, setHasInitialLoad] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(1);
  const titleSearchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Function to fetch TV series from the API - memoized to prevent infinite loops
  const fetchTvSeries = useCallback(async (selectedYear = year, selectedGenre = genre, selectedTitleQuery = titleQuery, pageNum = currentPage, selectedSort = sort) => {
    // Ensure loading is set to true immediately
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (selectedYear) params.append('year', selectedYear);
      if (selectedGenre) params.append('genre', selectedGenre);
      if (selectedTitleQuery) params.append('name', selectedTitleQuery);
      params.append('page', pageNum.toString());
      if (selectedSort && !selectedTitleQuery) params.append('sort', selectedSort); // Only send sort if not searching by name

      const response = await fetch(`/api/tv-series?${params.toString()}`);
      if (!response.ok) {
        setTvSeries([]);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: { results?: TvSerie[]; page?: number; total_pages?: number; total_results?: number; } = await response.json();

      let filteredTvSeries: TvSerie[] = [];

      if (data.results && Array.isArray(data.results)) {
        filteredTvSeries = data.results;

        if (selectedTitleQuery) {
          if (selectedYear) {
            filteredTvSeries = filteredTvSeries.filter((tv: TvSerie) =>
              tv.first_air_date && new Date(tv.first_air_date).getFullYear() === parseInt(selectedYear)
            );
          }
          if (selectedGenre) {
            const genreId = parseInt(selectedGenre);
            filteredTvSeries = filteredTvSeries.filter((tv: TvSerie) =>
              tv.genre_ids && tv.genre_ids.includes(genreId)
            );
          }
        }
      } else {
        console.warn("API response 'results' not found or not an array:", data);
        setError("Unexpected API response format.");
      }

      setTvSeries(filteredTvSeries);

      if (selectedTitleQuery && filteredTvSeries.length < 20 && currentPage === 1) {
        setTotalPages(1);
      } else {
        setTotalPages(data.total_pages || 1);
      }

      // Note: If no results found and we're not on page 1, 
      // the parent component should handle page reset logic

    } catch (err) {
      setTvSeries([]);
      setError((err as Error).message);
    } finally {
      // Always ensure loading is set to false
      setLoading(false);
      setHasInitialLoad(true);
    }
  }, [year, genre, titleQuery, currentPage, sort]);

  // Effect to debounce API calls on title search changes only
  useEffect(() => {
    // Clear any existing timeout
    if (titleSearchTimeoutRef.current) {
      clearTimeout(titleSearchTimeoutRef.current);
    }

    titleSearchTimeoutRef.current = setTimeout(() => {
      fetchTvSeries(year, genre, titleQuery, currentPage, sort);
      titleSearchTimeoutRef.current = null;
    }, 420);

    return () => {
      if (titleSearchTimeoutRef.current) {
        clearTimeout(titleSearchTimeoutRef.current);
        titleSearchTimeoutRef.current = null;
      }
    };
  }, [titleQuery, fetchTvSeries]);

  // Effect for immediate filter changes (year, genre, sort, page) - but not titleQuery
  useEffect(() => {
    // Skip if there's an active title search timeout to avoid conflicts
    if (!titleSearchTimeoutRef.current) {
      fetchTvSeries(year, genre, titleQuery, currentPage, sort);
    }
  }, [year, genre, currentPage, sort, fetchTvSeries]);

  return {
    tvSeries,
    loading,
    error,
    totalPages,
    hasInitialLoad,
    setLoading,
    fetchTvSeries
  };
}
