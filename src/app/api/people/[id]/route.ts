import { NextRequest, NextResponse } from 'next/server';
import { PersonDetails, Credits, CastMember, CrewMember } from '@/types/api';
import { handleApiError, AppError, validateEnvironment } from '@/lib/errors';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    validateEnvironment();

    const { id } = await params;
    const personId = parseInt(id, 10);

    if (isNaN(personId) || personId <= 0) {
      throw new AppError('Invalid person ID', 400, 'INVALID_PERSON_ID');
    }

    const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN!;

    // Fetch person details
    const personRes = await fetch(
      `https://api.themoviedb.org/3/person/${personId}?append_to_response=images,external_ids`,
      {
        headers: {
          Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
        },
      }
    );

    if (!personRes.ok) {
      if (personRes.status === 404) {
        throw new AppError('Person not found', 404, 'PERSON_NOT_FOUND');
      }
      throw new AppError(`Failed to fetch person data: ${personRes.statusText}`, personRes.status);
    }

    const personData = await personRes.json();

    // Fetch person's external IDs to get IMDB ID
    const externalIdsRes = await fetch(
      `https://api.themoviedb.org/3/person/${personId}/external_ids`,
      {
        headers: {
          Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
        },
      }
    );

    if (!externalIdsRes.ok) {
      throw new AppError(`Failed to fetch external IDs: ${externalIdsRes.statusText}`, externalIdsRes.status);
    }

    const externalIdsData = await externalIdsRes.json();

    // Fetch movie credits with detailed information
    const movieCreditsRes = await fetch(
      `https://api.themoviedb.org/3/person/${personId}/movie_credits`,
      {
        headers: {
          Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
        },
      }
    );

    if (!movieCreditsRes.ok) {
      throw new AppError(`Failed to fetch movie credits: ${movieCreditsRes.statusText}`, movieCreditsRes.status);
    }

    const movieCreditsData = await movieCreditsRes.json();

    // Fetch TV credits with detailed information
    const tvCreditsRes = await fetch(
      `https://api.themoviedb.org/3/person/${personId}/tv_credits`,
      {
        headers: {
          Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
        },
      }
    );

    if (!tvCreditsRes.ok) {
      throw new AppError(`Failed to fetch TV credits: ${tvCreditsRes.statusText}`, tvCreditsRes.status);
    }

    const tvCreditsData = await tvCreditsRes.json();

    // Combine the credits data
    const combinedCreditsData: Credits = {
      cast: [
        ...(movieCreditsData.cast || []).map((item: any): CastMember => ({
          ...item,
          media_type: 'movie' as const
        })),
        ...(tvCreditsData.cast || []).map((item: any): CastMember => ({
          ...item,
          media_type: 'tv' as const
        }))
      ],
      crew: [
        ...(movieCreditsData.crew || []).map((item: any): CrewMember => ({
          ...item,
          media_type: 'movie' as const
        })),
        ...(tvCreditsData.crew || []).map((item: any): CrewMember => ({
          ...item,
          media_type: 'tv' as const
        }))
      ]
    };

    const responseData: PersonDetails = {
      id: personData.id,
      name: personData.name,
      profile_path: personData.profile_path,
      adult: personData.adult,
      gender: personData.gender,
      known_for_department: personData.known_for_department,
      popularity: personData.popularity,
      biography: personData.biography,
      birthday: personData.birthday,
      place_of_birth: personData.place_of_birth,
      imdb_id: externalIdsData.imdb_id,
      credits: combinedCreditsData,
    };

    return NextResponse.json(responseData);

  } catch (error) {
    return handleApiError(error);
  }
}


