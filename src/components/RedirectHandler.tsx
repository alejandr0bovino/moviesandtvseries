'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

/**
 * Component that handles redirect parameter preservation across Clerk authentication flows
 * This component should be included in the root layout to ensure redirect parameters
 * are preserved throughout the entire authentication process
 */
function RedirectHandlerInner() {
  const searchParams = useSearchParams()
  const redirectParam = searchParams.get('redirect')

  useEffect(() => {
    // Store redirect parameter in session storage when available
    if (redirectParam) {
      console.log('RedirectHandler: Found redirect parameter:', redirectParam)
      // Validate redirect URL to prevent open redirect vulnerabilities
      try {
        const parsedUrl = new URL(redirectParam, window.location.origin)
        // Only allow redirects to the same origin
        if (parsedUrl.origin === window.location.origin) {
          sessionStorage.setItem('clerk_redirect_url', redirectParam)
          console.log('RedirectHandler: Stored redirect URL in session storage:', redirectParam)
        } else {
          console.warn('RedirectHandler: Invalid redirect URL origin:', parsedUrl.origin)
        }
      } catch (error) {
        console.warn('RedirectHandler: Invalid redirect URL:', redirectParam, error)
      }
    }
  }, [redirectParam])

  // This component doesn't render anything
  return null
}

export default function RedirectHandler() {
  return (
    <Suspense fallback={null}>
      <RedirectHandlerInner />
    </Suspense>
  )
}
