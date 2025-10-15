import { NextRequest, NextResponse } from 'next/server';
import { MovieApiResponse, MovieQueryParams, Genre, Movie } from '@/types/api';
import { handleApiError, AppError, validateEnvironment } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    validateEnvironment();

    const { searchParams } = new URL(request.url);
    const params: MovieQueryParams = {
      year: searchParams.get('year') || undefined,
      genre: searchParams.get('genre') || undefined,
      query: searchParams.get('query') || undefined,
      page: searchParams.get('page') || '1',
      sort: searchParams.get('sort') || undefined,
    };

    const page = parseInt(params.page || '1', 10);
    const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN!;

    let moviesUrl: string;

    if (params.query) {
      // Search endpoint
      moviesUrl = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(params.query)}&language=en-US&page=${page}&include_adult=false`;
    } else {
      // Discover endpoint
      moviesUrl = `https://api.themoviedb.org/3/discover/movie?vote_count.gte=1000&language=en-US&include_adult=false&page=${page}`;
      if (params.year) moviesUrl += `&primary_release_year=${params.year}`;
      if (params.genre) moviesUrl += `&with_genres=${params.genre}`;
      if (params.sort) moviesUrl += `&sort_by=${params.sort}`;
    }

    const [moviesResponse, genresResponse] = await Promise.all([
      fetch(moviesUrl, {
        headers: {
          Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
        },
      }),
      fetch('https://api.themoviedb.org/3/genre/movie/list?language=en-US', {
        headers: {
          Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
        },
      }),
    ]);

    if (!moviesResponse.ok) {
      throw new AppError(`Failed to fetch movies from TMDB: ${moviesResponse.statusText}`, moviesResponse.status);
    }
    if (!genresResponse.ok) {
      throw new AppError(`Failed to fetch genres from TMDB: ${genresResponse.statusText}`, genresResponse.status);
    }

    const moviesData: MovieApiResponse = await moviesResponse.json();
    const genresData: { genres: Genre[] } = await genresResponse.json();

    let processedMovies = moviesData.results;
    let actualTotalResults = moviesData.total_results;
    let actualTotalPages = moviesData.total_pages;

    // Apply server-side filtering if a search query is active AND year/genre filters are present
    if (params.query) {
      if (params.year) {
        processedMovies = processedMovies.filter(m =>
          m.release_date && m.release_date.startsWith(params.year!)
        );
      }
      if (params.genre) {
        const genreId = Number(params.genre);
        processedMovies = processedMovies.filter(m =>
          m.genre_ids && m.genre_ids.includes(genreId)
        );
      }

      // Adjust pagination for filtered results
      if (processedMovies.length < 20 && page === 1 && processedMovies.length > 0) {
        actualTotalPages = 1;
        actualTotalResults = processedMovies.length;
      } else if (processedMovies.length === 0) {
        actualTotalPages = 1;
        actualTotalResults = 0;
      }
    }

    return NextResponse.json({
      movies: {
        results: processedMovies,
        page: moviesData.page,
        total_pages: actualTotalPages,
        total_results: actualTotalResults
      },
      genres: genresData.genres
    });

  } catch (error) {
    return handleApiError(error);
  }
}


