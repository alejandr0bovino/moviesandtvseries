import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

// Helper function to get or create user
async function getOrCreateUser(userId: string) {
  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    // User doesn't exist in database, create them
    const clerkUser = await currentUser();
    if (!clerkUser) {
      throw new Error('User not found in Clerk');
    }

    user = await prisma.user.create({
      data: {
        clerkId: userId,
        name: clerkUser.firstName && clerkUser.lastName
          ? `${clerkUser.firstName} ${clerkUser.lastName}`
          : clerkUser.emailAddresses[0]?.emailAddress || 'User',
        email: clerkUser.emailAddresses[0]?.emailAddress || null,
      },
    });
  }

  return user;
}

// GET /api/likes/tv-series - Get all likes for the current user, or check if user liked a specific TV series
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or create the user in our database
    const user = await getOrCreateUser(userId);

    // Check if tvSeriesId parameter is provided
    const { searchParams } = new URL(request.url);
    const tvSeriesId = searchParams.get('tvSeriesId');

    if (tvSeriesId) {
      // Check if user has liked this specific TV series
      const like = await prisma.like.findUnique({
        where: {
          userId_contentId_contentType: {
            userId: user.id,
            contentId: parseInt(tvSeriesId),
            contentType: 'tv-series',
          },
        },
      });

      // Return array with single item if liked, empty array if not liked
      return NextResponse.json(like ? [like] : []);
    } else {
      // Get all likes for the user
      const likes = await prisma.like.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json(likes);
    }
  } catch (error) {
    console.error('Error fetching likes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/likes/tv-series - Add a TV series to likes
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tvSeriesId, tvSeriesName } = await request.json();

    if (!tvSeriesId || !tvSeriesName) {
      return NextResponse.json({ error: 'TV Series ID and name are required' }, { status: 400 });
    }

    // Get or create the user in our database
    const user = await getOrCreateUser(userId);

    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_contentId_contentType: {
          userId: user.id,
          contentId: tvSeriesId,
          contentType: 'tv-series',
        },
      },
    });

    if (existingLike) {
      return NextResponse.json({ error: 'TV Series already liked' }, { status: 400 });
    }

    const like = await prisma.like.create({
      data: {
        contentId: tvSeriesId,
        contentName: tvSeriesName,
        contentType: 'tv-series',
        userId: user.id,
      },
    });

    return NextResponse.json(like);
  } catch (error) {
    console.error('Error creating like:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/likes/tv-series?tvSeriesId=X - Remove a TV series from likes
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tvSeriesId = searchParams.get('tvSeriesId');

    if (!tvSeriesId) {
      return NextResponse.json({ error: 'TV Series ID is required' }, { status: 400 });
    }

    // Get or create the user in our database
    const user = await getOrCreateUser(userId);

    const like = await prisma.like.deleteMany({
      where: {
        userId: user.id,
        contentId: parseInt(tvSeriesId),
        contentType: 'tv-series',
      },
    });

    return NextResponse.json({ message: 'Like removed successfully' });
  } catch (error) {
    console.error('Error removing like:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}