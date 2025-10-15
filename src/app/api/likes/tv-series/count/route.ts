import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

// GET /api/likes/tv-series/count?tvSeriesId=X - Get total likes count for a TV series
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tvSeriesId = searchParams.get('tvSeriesId');

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
