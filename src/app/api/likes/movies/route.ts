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

// GET /api/likes/movies - Get all likes for the current user, or check if user liked a specific movie
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or create the user in our database
    const user = await getOrCreateUser(userId);

    // Check if movieId parameter is provided
    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get('movieId');

    if (movieId) {
      // Check if user has liked this specific movie
      const like = await prisma.like.findUnique({
        where: {
          userId_contentId_contentType: {
            userId: user.id,
            contentId: parseInt(movieId),
            contentType: 'movie',
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

// POST /api/likes/movies - Add a movie to likes
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { movieId, movieName } = await request.json();

    if (!movieId || !movieName) {
      return NextResponse.json({ error: 'Movie ID and name are required' }, { status: 400 });
    }

    // Get or create the user in our database
    const user = await getOrCreateUser(userId);

    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_contentId_contentType: {
          userId: user.id,
          contentId: movieId,
          contentType: 'movie',
        },
      },
    });

    if (existingLike) {
      return NextResponse.json({ error: 'Movie already liked' }, { status: 400 });
    }

    const like = await prisma.like.create({
      data: {
        contentId: movieId,
        contentName: movieName,
        contentType: 'movie',
        userId: user.id,
      },
    });

    return NextResponse.json(like);
  } catch (error) {
    console.error('Error creating like:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/likes/movies?movieId=X - Remove a movie from likes
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get('movieId');

    if (!movieId) {
      return NextResponse.json({ error: 'Movie ID is required' }, { status: 400 });
    }

    // Get or create the user in our database
    const user = await getOrCreateUser(userId);

    const like = await prisma.like.deleteMany({
      where: {
        userId: user.id,
        contentId: parseInt(movieId),
        contentType: 'movie',
      },
    });

    return NextResponse.json({ message: 'Like removed successfully' });
  } catch (error) {
    console.error('Error removing like:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}