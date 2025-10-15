import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

// GET /api/likes/movies/count?movieId=X - Get total likes count for a movie
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get('movieId');

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
