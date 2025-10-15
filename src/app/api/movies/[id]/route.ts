import { NextRequest, NextResponse } from 'next/server';
import { MovieDetails, VideosResponse } from '@/types/api';
import { handleApiError, AppError, validateEnvironment } from '@/lib/errors';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    validateEnvironment();

    const { id } = await params;
    const movieId = parseInt(id, 10);

    if (isNaN(movieId) || movieId <= 0) {
      throw new AppError('Invalid movie ID', 400, 'INVALID_MOVIE_ID');
    }

    const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN!;

    const [movieRes, videoRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/${movieId}?append_to_response=credits`, {
        headers: {
          Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }),
      fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos`, {
        headers: {
          Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }),
    ]);

    if (!movieRes.ok || !videoRes.ok) {
      if (movieRes.status === 404 || videoRes.status === 404) {
        throw new AppError('Movie not found', 404, 'MOVIE_NOT_FOUND');
      }
      throw new AppError('Failed to fetch movie data', movieRes.status || videoRes.status);
    }

    const movieData: MovieDetails = await movieRes.json();
    const videoData: VideosResponse = await videoRes.json();

    const trailer = videoData.results.find(
      (vid) => vid.type === 'Trailer' && vid.site === 'YouTube'
    );

    // Extract cast and crew from movieData.credits
    const cast = movieData.credits?.cast || [];
    const crew = movieData.credits?.crew || [];

    const responseData: MovieDetails = {
      ...movieData,
      youtubeTrailerKey: trailer?.key || null,
      cast,
      crew
    };

    return NextResponse.json(responseData);

  } catch (error) {
    return handleApiError(error);
  }
}


