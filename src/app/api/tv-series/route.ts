import { NextRequest, NextResponse } from 'next/server';
import { TvSeriesApiResponse, TvSeriesQueryParams } from '@/types/api';
import { handleApiError, AppError, validateEnvironment } from '@/lib/errors';

const TMDB_REVALIDATE_SECONDS = 60 * 30;

export async function GET(request: NextRequest) {
  try {
    validateEnvironment();

    const { searchParams } = new URL(request.url);
    const params: TvSeriesQueryParams = {
      year: searchParams.get('year') || undefined,
      genre: searchParams.get('genre') || undefined,
      name: searchParams.get('name') || undefined,
      page: searchParams.get('page') || '1',
      sort: searchParams.get('sort') || undefined,
    };

    const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN!;
    const headers = {
      Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
    };

    let apiUrl: string;

    if (params.name) {
      // Use search endpoint if a name query is present
      const searchUrl = new URL("https://api.themoviedb.org/3/search/tv");
      searchUrl.searchParams.set("language", "en-US");
      searchUrl.searchParams.set("query", params.name);
      searchUrl.searchParams.set("page", params.page || '1');
      searchUrl.searchParams.set("include_adult", "false");
      apiUrl = searchUrl.toString();
    } else {
      // Use discover endpoint if no name query, but year or genre are present
      const discoverUrl = new URL("https://api.themoviedb.org/3/discover/tv");
      discoverUrl.searchParams.set("language", "en-US");
      discoverUrl.searchParams.set("page", params.page || '1');
      discoverUrl.searchParams.set("include_adult", "false");
      discoverUrl.searchParams.set("include_null_first_air_dates", "false");
      discoverUrl.searchParams.set("sort_by", params.sort || "popularity.desc");

      if (params.year) discoverUrl.searchParams.set("first_air_date_year", params.year);
      if (params.genre) discoverUrl.searchParams.set("with_genres", params.genre);

      apiUrl = discoverUrl.toString();
    }

    const response = await fetch(apiUrl, {
      headers,
      next: { revalidate: TMDB_REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new AppError(
        `TMDB API error: ${response.status} - ${errorData.status_message || 'Unknown error'}`,
        response.status
      );
    }

    const data: TvSeriesApiResponse = await response.json();

    return NextResponse.json(
      {
        results: data.results,
        page: data.page,
        total_pages: data.total_pages,
        total_results: data.total_results,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=86400',
        },
      }
    );

  } catch (error) {
    return handleApiError(error);
  }
}


