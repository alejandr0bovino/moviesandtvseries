import { NextRequest, NextResponse } from 'next/server';
import { MovieApiResponse } from '@/types/api';
import { handleApiError, AppError, validateEnvironment } from '@/lib/errors';

interface RouteParams {
  params: Promise<{ category: string }>;
}

type MovieCategory = 'featured' | 'popular' | 'upcoming';

const VALID_CATEGORIES: MovieCategory[] = ['featured', 'popular', 'upcoming'];

const TMDB_REVALIDATE_SECONDS = 60 * 30;

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    validateEnvironment();

    const { category } = await params;

    if (!VALID_CATEGORIES.includes(category as MovieCategory)) {
      throw new AppError('Invalid movie category', 400, 'INVALID_CATEGORY');
    }

    const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN!;
    let url: string;

    switch (category as MovieCategory) {
      case 'featured':
        url = "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1";
        break;
      case 'popular':
        url = "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1";
        break;
      case 'upcoming':
        url = "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1";
        break;
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
      },
      next: { revalidate: TMDB_REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new AppError(
        `TMDB API error: ${response.status} - ${errorData.status_message || 'Unknown error'}`,
        response.status
      );
    }

    const data: MovieApiResponse = await response.json();

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=86400',
      },
    });

  } catch (error) {
    return handleApiError(error);
  }
}


