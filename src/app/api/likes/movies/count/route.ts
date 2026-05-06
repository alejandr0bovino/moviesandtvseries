import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

// GET /api/likes/movies/count?movieId=X - Get total likes count for a movie
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get('movieId');
    const movieIdsParam = searchParams.get('movieIds');

    if (movieIdsParam) {
      const movieIds = movieIdsParam
        .split(',')
        .map((id) => parseInt(id.trim(), 10))
        .filter((id) => Number.isFinite(id));

      if (movieIds.length === 0) {
        return NextResponse.json({ counts: {} });
      }

      const groupedLikes = await prisma.like.groupBy({
        by: ['contentId'],
        where: {
          contentType: 'movie',
          contentId: { in: movieIds },
        },
        _count: {
          _all: true,
        },
      });

      const groupedMap = new Map<number, number>(
        groupedLikes.map((entry) => [entry.contentId, entry._count._all])
      );

      const counts: Record<number, number> = {};
      for (const id of movieIds) {
        counts[id] = groupedMap.get(id) ?? 0;
      }

      return NextResponse.json({ counts });
    }

    if (!movieId) {
      return NextResponse.json({ error: 'Movie ID is required' }, { status: 400 });
    }

    const count = await prisma.like.count({
      where: {
        contentId: parseInt(movieId),
        contentType: 'movie',
      },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching likes count:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
