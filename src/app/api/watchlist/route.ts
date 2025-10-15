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

// GET /api/watchlist - Get all watchlist items for the current user
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or create the user in our database
    const dbUser = await getOrCreateUser(userId);

    // Get all watchlist items for the user
    const watchlist = await prisma.watchlist.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(watchlist);
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/watchlist - Add a TV series to watchlist
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { tvSeriesId, tvSeriesName } = body;

    if (!tvSeriesId || !tvSeriesName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get or create the user in our database
    const dbUser = await getOrCreateUser(userId);

    // Check if watchlist item already exists
    const existingWatchlistItem = await prisma.watchlist.findUnique({
      where: {
        userId_tvSeriesId: {
          userId: dbUser.id,
          tvSeriesId: tvSeriesId,
        },
      },
    });

    if (existingWatchlistItem) {
      return NextResponse.json({ error: 'TV series already in watchlist' }, { status: 409 });
    }

    // Add to watchlist
    const watchlistItem = await prisma.watchlist.create({
      data: {
        tvSeriesId,
        tvSeriesName,
        userId: dbUser.id,
      },
    });

    return NextResponse.json(watchlistItem, { status: 201 });
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/watchlist - Remove a TV series from watchlist
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tvSeriesId = searchParams.get('tvSeriesId');

    if (!tvSeriesId) {
      return NextResponse.json({ error: 'Missing tvSeriesId parameter' }, { status: 400 });
    }

    // Get or create the user in our database
    const dbUser = await getOrCreateUser(userId);

    // Remove from watchlist
    await prisma.watchlist.deleteMany({
      where: {
        userId: dbUser.id,
        tvSeriesId: parseInt(tvSeriesId),
      },
    });

    return NextResponse.json({ message: 'Removed from watchlist successfully' });
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}