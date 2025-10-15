import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

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

// GET /api/watchlist/movies - Get all movie watchlist items for the current user
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or create the user in our database
    const dbUser = await getOrCreateUser(userId);

    // Get all movie watchlist items for the user
    const watchlist = await prisma.movieWatchlist.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(watchlist);
  } catch (error) {
    console.error('Error fetching movie watchlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/watchlist/movies - Add a movie to watchlist
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { movieId, movieName } = body;

    if (!movieId || !movieName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get or create the user in our database
    const dbUser = await getOrCreateUser(userId);

    // Check if watchlist item already exists
    const existingWatchlistItem = await prisma.movieWatchlist.findUnique({
      where: {
        userId_movieId: {
          userId: dbUser.id,
          movieId: movieId,
        },
      },
    });

    if (existingWatchlistItem) {
      return NextResponse.json({ error: 'Movie already in watchlist' }, { status: 409 });
    }

    // Add to watchlist
    const watchlistItem = await prisma.movieWatchlist.create({
      data: {
        movieId,
        movieName,
        userId: dbUser.id,
      },
    });

    return NextResponse.json(watchlistItem, { status: 201 });
  } catch (error) {
    console.error('Error adding movie to watchlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/watchlist/movies - Remove a movie from watchlist
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get('movieId');

    if (!movieId) {
      return NextResponse.json({ error: 'Missing movieId parameter' }, { status: 400 });
    }

    // Get or create the user in our database
    const dbUser = await getOrCreateUser(userId);

    // Remove from watchlist
    await prisma.movieWatchlist.deleteMany({
      where: {
        userId: dbUser.id,
        movieId: parseInt(movieId),
      },
    });

    return NextResponse.json({ message: 'Movie removed from watchlist successfully' });
  } catch (error) {
    console.error('Error removing movie from watchlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}