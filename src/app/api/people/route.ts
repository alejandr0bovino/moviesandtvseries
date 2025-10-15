import { NextRequest, NextResponse } from 'next/server';
import { PersonApiResponse, PersonQueryParams } from '@/types/api';
import { handleApiError, AppError, validateEnvironment } from '@/lib/errors';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    validateEnvironment();

    const { searchParams } = new URL(request.url);
    const params: PersonQueryParams = {
      query: searchParams.get('query') || undefined,
      page: searchParams.get('page') || '1',
    };

    const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN!;

    const url = params.query
      ? `https://api.themoviedb.org/3/search/person?query=${encodeURIComponent(params.query)}&language=en-US&page=${params.page}&include_adult=false`
      : `https://api.themoviedb.org/3/person/popular?language=en-US&page=${params.page}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new AppError(
        `TMDB API error: ${response.status} - ${errorData.status_message || 'Unknown error'}`,
        response.status
      );
    }

    const data: PersonApiResponse = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    return handleApiError(error);
  }
}


