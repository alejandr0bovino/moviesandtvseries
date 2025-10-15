import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Custom hook to handle redirect parameters throughout the authentication flow
 * This ensures the redirect parameter is preserved across all Clerk authentication steps
 * using session storage as a fallback when URL parameters are lost
 */
export function useRedirectHandler() {
  const searchParams = useSearchParams()
  const urlRedirect = searchParams.get('redirect')

  // Validate redirect URL to prevent open redirect vulnerabilities
  const isValidRedirect = (url: string): boolean => {
    try {
      const parsedUrl = new URL(url, window.location.origin)
      // Only allow redirects to the same origin
      return parsedUrl.origin === window.location.origin
    } catch {
      return false
    }
  }

  // Store redirect URL in session storage when available
  useEffect(() => {
    if (urlRedirect && isValidRedirect(urlRedirect)) {
      sessionStorage.setItem('clerk_redirect_url', urlRedirect)
    }
  }, [urlRedirect])

  // Get redirect URL from URL params or session storage
  const getRedirectUrl = (): string => {
    if (urlRedirect && isValidRedirect(urlRedirect)) {
      return urlRedirect
    }

    if (typeof window !== 'undefined') {
      const storedRedirect = sessionStorage.getItem('clerk_redirect_url')
      if (storedRedirect && isValidRedirect(storedRedirect)) {
        return storedRedirect
      }
    }

    return '/dashboard'
  }

  const redirectUrl = getRedirectUrl()

  return {
    redirectUrl,
    hasRedirect: searchParams.has('redirect') || (typeof window !== 'undefined' && !!sessionStorage.getItem('clerk_redirect_url')),
    originalRedirect: urlRedirect || (typeof window !== 'undefined' ? sessionStorage.getItem('clerk_redirect_url') : null),
    clearStoredRedirect: () => {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('clerk_redirect_url')
      }
    }
  }
}

/**
 * Utility function to create redirect URLs with proper encoding
 */
export function createRedirectUrl(baseUrl: string, redirectPath?: string): string {
  if (!redirectPath) return baseUrl

  const url = new URL(baseUrl, window.location.origin)
  url.searchParams.set('redirect', redirectPath)
  return url.toString()
}
