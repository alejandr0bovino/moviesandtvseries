import { useState, useEffect, useRef, useCallback } from 'react';
import { Movie, MovieApiResponse } from '@/types/movies';

interface UseMoviesParams {
  titleQuery: string;
  year: string;
  genre: string;
  currentPage: number;
  sort: string;
}

interface UseMoviesReturn {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  hasInitialLoad: boolean;
  setLoading: (loading: boolean) => void;
  fetchMovies: (selectedYear?: string, selectedGenre?: string, selectedTitleQuery?: string, pageNum?: number, selectedSort?: string) => Promise<void>;
}

export function useMovies({ titleQuery, year, genre, currentPage, sort }: UseMoviesParams): UseMoviesReturn {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasInitialLoad, setHasInitialLoad] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(1);
  const titleSearchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Function to fetch movies from the API - memoized to prevent infinite loops
  const fetchMovies = useCallback(async (selectedYear = year, selectedGenre = genre, selectedTitleQuery = titleQuery, pageNum = currentPage, selectedSort = sort) => {
    // Ensure loading is set to true immediately
    setLoading(true);
    setError(null);

    try {
      const query = new URLSearchParams();
      if (selectedYear) query.append('year', selectedYear);
      if (selectedGenre) query.append('genre', selectedGenre);
      if (selectedTitleQuery) query.append('query', selectedTitleQuery);
      query.append('page', pageNum.toString());
      if (selectedSort) query.append('sort', selectedSort);

      const response = await fetch(`/api/movies?${query.toString()}`);
      if (!response.ok) {
        setMovies([]);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: { movies?: MovieApiResponse } = await response.json();

      if (data.movies && Array.isArray(data.movies.results)) {
        setMovies(data.movies.results);
        setTotalPages(data.movies.total_pages || 1);
      } else {
        setMovies([]);
        setTotalPages(1);
        console.warn("API response 'movies.results' not found or not an array:", data);
        setError("Unexpected API response format.");
      }

    } catch (err) {
      setMovies([]);
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
      fetchMovies(year, genre, titleQuery, currentPage, sort);
      titleSearchTimeoutRef.current = null;
    }, 420);

    return () => {
      if (titleSearchTimeoutRef.current) {
        clearTimeout(titleSearchTimeoutRef.current);
        titleSearchTimeoutRef.current = null;
      }
    };
  }, [titleQuery, fetchMovies]);

  // Effect for immediate filter changes (year, genre, sort, page) - but not titleQuery
  useEffect(() => {
    // Skip if there's an active title search timeout to avoid conflicts
    if (!titleSearchTimeoutRef.current) {
      fetchMovies(year, genre, titleQuery, currentPage, sort);
    }
  }, [year, genre, currentPage, sort, fetchMovies]);

  return {
    movies,
    loading,
    error,
    totalPages,
    hasInitialLoad,
    setLoading,
    fetchMovies
  };
}
