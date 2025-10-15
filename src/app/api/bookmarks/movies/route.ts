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

// GET /api/bookmarks/movies - Get all movie bookmarks for the current user
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or create the user in our database
    const dbUser = await getOrCreateUser(userId);

    // Get all movie bookmarks for the user
    const bookmarks = await prisma.movieBookmark.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(bookmarks);
  } catch (error) {
    console.error('Error fetching movie bookmarks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/bookmarks/movies - Create a new movie bookmark
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

    // Check if bookmark already exists
    const existingBookmark = await prisma.movieBookmark.findUnique({
      where: {
        userId_movieId: {
          userId: dbUser.id,
          movieId: movieId,
        },
      },
    });

    if (existingBookmark) {
      return NextResponse.json({ error: 'Bookmark already exists' }, { status: 409 });
    }

    // Create new bookmark
    const bookmark = await prisma.movieBookmark.create({
      data: {
        movieId,
        movieName,
        userId: dbUser.id,
      },
    });

    return NextResponse.json(bookmark, { status: 201 });
  } catch (error) {
    console.error('Error creating movie bookmark:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/bookmarks/movies - Delete a movie bookmark
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

    // Delete bookmark
    await prisma.movieBookmark.deleteMany({
      where: {
        userId: dbUser.id,
        movieId: parseInt(movieId),
      },
    });

    return NextResponse.json({ message: 'Movie bookmark deleted successfully' });
  } catch (error) {
    console.error('Error deleting movie bookmark:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}