import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

// GET /api/likes/tv-series/count?tvSeriesId=X - Get total likes count for a TV series
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tvSeriesId = searchParams.get('tvSeriesId');
    const tvSeriesIdsParam = searchParams.get('tvSeriesIds');

    if (tvSeriesIdsParam) {
      const tvSeriesIds = tvSeriesIdsParam
        .split(',')
        .map((id) => parseInt(id.trim(), 10))
        .filter((id) => Number.isFinite(id));

      if (tvSeriesIds.length === 0) {
        return NextResponse.json({ counts: {} });
      }

      const groupedLikes = await prisma.like.groupBy({
        by: ['contentId'],
        where: {
          contentType: 'tv-series',
          contentId: { in: tvSeriesIds },
        },
        _count: {
          _all: true,
        },
      });

      const groupedMap = new Map<number, number>(
        groupedLikes.map((entry) => [entry.contentId, entry._count._all])
      );

      const counts: Record<number, number> = {};
      for (const id of tvSeriesIds) {
        counts[id] = groupedMap.get(id) ?? 0;
      }

      return NextResponse.json({ counts });
    }

    if (!tvSeriesId) {
      return NextResponse.json({ error: 'TV Series ID is required' }, { status: 400 });
    }

    const count = await prisma.like.count({
      where: {
        contentId: parseInt(tvSeriesId),
        contentType: 'tv-series',
      },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching likes count:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
