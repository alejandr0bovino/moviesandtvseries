import { NextRequest, NextResponse } from 'next/server';
import { TvSeriesDetails, VideosResponse, Credits } from '@/types/api';
import { handleApiError, AppError, validateEnvironment } from '@/lib/errors';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    validateEnvironment();

    const { id } = await params;
    const tvSeriesId = parseInt(id, 10);

    if (isNaN(tvSeriesId) || tvSeriesId <= 0) {
      throw new AppError('Invalid TV series ID', 400, 'INVALID_TV_SERIES_ID');
    }

    const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN!;

    const [tvSeriesRes, videoRes, creditsRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/tv/${tvSeriesId}`, {
        headers: {
          Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }),
      fetch(`https://api.themoviedb.org/3/tv/${tvSeriesId}/videos`, {
        headers: {
          Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }),
      fetch(`https://api.themoviedb.org/3/tv/${tvSeriesId}/credits`, {
        headers: {
          Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }),
    ]);

    if (!tvSeriesRes.ok || !videoRes.ok || !creditsRes.ok) {
      if (tvSeriesRes.status === 404 || videoRes.status === 404 || creditsRes.status === 404) {
        throw new AppError('TV series not found', 404, 'TV_SERIES_NOT_FOUND');
      }
      throw new AppError('Failed to fetch TV series data', tvSeriesRes.status || videoRes.status || creditsRes.status);
    }

    const tvSeriesData: TvSeriesDetails = await tvSeriesRes.json();
    const videoData: VideosResponse = await videoRes.json();
    const creditsData: Credits = await creditsRes.json();

    const trailer = videoData.results.find(
      (vid) => vid.type === 'Trailer' && vid.site === 'YouTube'
    );

    const responseData: TvSeriesDetails = {
      ...tvSeriesData,
      ...creditsData,
      youtubeTrailerKey: trailer?.key || null
    };

    return NextResponse.json(responseData);

  } catch (error) {
    return handleApiError(error);
  }
}


