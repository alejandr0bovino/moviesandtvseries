'use client'

import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

/**
 * Custom hook to get the redirect URL from either URL parameters or session storage
 * This ensures the redirect parameter is preserved throughout Clerk's authentication flow
 */
export function useRedirectUrl() {
  const searchParams = useSearchParams()
  const urlRedirect = searchParams.get('redirect')

  const redirectUrl = useMemo(() => {
    // First, try to get from URL parameters
    if (urlRedirect) {
      try {
        const parsedUrl = new URL(urlRedirect, window.location.origin)
        if (parsedUrl.origin === window.location.origin) {
          console.log('Using redirect URL from params:', urlRedirect)
          return urlRedirect
        }
      } catch (_error) {
        console.warn('Invalid redirect URL from params:', urlRedirect)
      }
    }

    // If not in URL params, try session storage
    if (typeof window !== 'undefined') {
      const storedRedirect = sessionStorage.getItem('clerk_redirect_url')
      if (storedRedirect) {
        try {
          const parsedUrl = new URL(storedRedirect, window.location.origin)
          if (parsedUrl.origin === window.location.origin) {
            console.log('Using redirect URL from session storage:', storedRedirect)
            return storedRedirect
          }
        } catch (_error) {
          console.warn('Invalid redirect URL from storage:', storedRedirect)
          // Clear invalid stored redirect
          sessionStorage.removeItem('clerk_redirect_url')
        }
      }
    }

    // Default fallback
    console.log('Using default redirect URL: /dashboard')
    return '/dashboard'
  }, [urlRedirect])

  const clearStoredRedirect = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('clerk_redirect_url')
    }
  }

  return {
    redirectUrl,
    hasRedirect: !!urlRedirect || (typeof window !== 'undefined' && !!sessionStorage.getItem('clerk_redirect_url')),
    clearStoredRedirect
  }
}
