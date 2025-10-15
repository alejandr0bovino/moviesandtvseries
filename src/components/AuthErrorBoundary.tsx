'use client'

import { useAuth, useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface AuthErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function AuthErrorBoundary({ children, fallback }: AuthErrorBoundaryProps) {
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  const router = useRouter()
  const pathname = usePathname()


  useEffect(() => {
    if (!isLoaded) return

    // Check if we're on a protected route
    const isProtectedRoute = window.location.pathname.startsWith('/dashboard') ||
      window.location.pathname.startsWith('/settings')

    if (isProtectedRoute && !isSignedIn) {
      // Redirect to sign-in if not authenticated
      router.push(`/sign-in?redirect=${encodeURIComponent(pathname)}`)
      return
    }

    // Listen for authentication state changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === '__clerk_client_jwt') {
        if (e.newValue && !e.oldValue && isProtectedRoute) {
          // User just signed in from another tab, no need to refresh
          // Clerk will handle the auth state automatically
        } else if (!e.newValue && e.oldValue) {
          // User just signed out from another tab, redirect to home
          router.push('/')
        }
      }
    }

    // Listen for focus events to check auth state
    const handleFocus = () => {
      // Removed automatic refresh logic to prevent unwanted page reloads
      // The auth state is already managed by Clerk and doesn't need manual refresh
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('focus', handleFocus)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [isSignedIn, isLoaded, router, pathname])



  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isSignedIn) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please sign in to access this page.</p>
          <button
            onClick={() => router.push(`/sign-in?redirect=${encodeURIComponent(pathname)}`)}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}