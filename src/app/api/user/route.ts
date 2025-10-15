import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const { userId } = await auth();
    const clerkUser = await currentUser();

    if (!userId || !clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        documents: { take: 5, orderBy: { createdAt: 'desc' } },
        bookmarks: { take: 10, orderBy: { createdAt: 'desc' } },
        watchlist: { take: 10, orderBy: { createdAt: 'desc' } },
        movieBookmarks: { take: 10, orderBy: { createdAt: 'desc' } },
        movieWatchlist: { take: 10, orderBy: { createdAt: 'desc' } },
        likes: { take: 10, orderBy: { createdAt: 'desc' } }
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    const clerkUser = await currentUser();

    if (!userId || !clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, email } = await request.json();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (existingUser) {
      return NextResponse.json(existingUser);
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        clerkId: userId,
        name: name || (clerkUser.firstName && clerkUser.lastName
          ? `${clerkUser.firstName} ${clerkUser.lastName}`
          : clerkUser.emailAddresses[0]?.emailAddress || 'User'),
        email: email || clerkUser.emailAddresses[0]?.emailAddress,
      },
      include: {
        documents: { take: 5, orderBy: { createdAt: 'desc' } },
        bookmarks: { take: 10, orderBy: { createdAt: 'desc' } },
        watchlist: { take: 10, orderBy: { createdAt: 'desc' } },
        movieBookmarks: { take: 10, orderBy: { createdAt: 'desc' } },
        movieWatchlist: { take: 10, orderBy: { createdAt: 'desc' } },
        likes: { take: 10, orderBy: { createdAt: 'desc' } }
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
