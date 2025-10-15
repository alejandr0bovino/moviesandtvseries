'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import DashboardItems from '@/components/DashboardItems';
import { Spinner } from '@heroui/react';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  bookmarks: any[];
  movieBookmarks: any[];
  watchlist: any[];
  movieWatchlist: any[];
  likes: any[];
}

// Helper function to parse dates in user data
const parseUserDataDates = (userData: any) => {
  if (userData.createdAt) {
    userData.createdAt = new Date(userData.createdAt);
  }

  // Parse dates in arrays
  if (userData.bookmarks) {
    userData.bookmarks = userData.bookmarks.map((bookmark: any) => ({
      ...bookmark,
      createdAt: new Date(bookmark.createdAt)
    }));
  }

  if (userData.movieBookmarks) {
    userData.movieBookmarks = userData.movieBookmarks.map((bookmark: any) => ({
      ...bookmark,
      createdAt: new Date(bookmark.createdAt)
    }));
  }

  if (userData.watchlist) {
    userData.watchlist = userData.watchlist.map((item: any) => ({
      ...item,
      createdAt: new Date(item.createdAt)
    }));
  }

  if (userData.movieWatchlist) {
    userData.movieWatchlist = userData.movieWatchlist.map((item: any) => ({
      ...item,
      createdAt: new Date(item.createdAt)
    }));
  }

  if (userData.likes) {
    userData.likes = userData.likes.map((like: any) => ({
      ...like,
      createdAt: new Date(like.createdAt)
    }));
  }

  return userData;
};

export default function Dashboard() {
  const { user: clerkUser, isLoaded } = useUser();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isLoaded || !clerkUser) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          const userData = await response.json();
          const parsedUserData = parseUserDataDates(userData);
          setUser(parsedUserData);
        } else {
          // If user doesn't exist, create them
          const createResponse = await fetch('/api/user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: clerkUser.firstName && clerkUser.lastName
                ? `${clerkUser.firstName} ${clerkUser.lastName}`
                : clerkUser.emailAddresses[0]?.emailAddress || 'User',
              email: clerkUser.emailAddresses[0]?.emailAddress || null,
            }),
          });

          if (createResponse.ok) {
            const newUserData = await createResponse.json();
            const parsedUserData = parseUserDataDates(newUserData);
            setUser(parsedUserData);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isLoaded, clerkUser]);

  // Scroll to top on initial load (client-side effect)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!isLoaded || loading) {
    return (
      <>
        <hr className="mt-3 mb-6 hr-text" data-content="DASHBOARD" />
        <div className="flex justify-center items-center h-104 pt-10">
          <Spinner size="lg" />
        </div>
      </>
    );
  }

  if (!clerkUser) {
    return (
      <>
        <hr className="mt-3 mb-6 hr-text" data-content="DASHBOARD" />
        <p>Please sign in to continue.</p>
      </>
    );
  }

  return (
    <>
      <hr className="mt-3 mb-6 hr-text" data-content="DASHBOARD" />

      <div className='flex gap-2 min-h-[350px] mb-2'>

        <div className="space-y-6 w-full">
          <h1 className="text-2xl font-bold">Welcome, {clerkUser.username || user?.name || 'friend'}!</h1>

          {user && (
            <DashboardItems
              bookmarks={user.bookmarks}
              movieBookmarks={user.movieBookmarks}
              watchlist={user.watchlist}
              movieWatchlist={user.movieWatchlist}
              likes={user.likes}
              accountCreatedAt={user.createdAt}
            />
          )}
        </div>

      </div>
    </>
  );
}