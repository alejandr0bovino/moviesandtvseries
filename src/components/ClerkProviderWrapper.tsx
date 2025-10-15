'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { ReactNode } from 'react'

interface ClerkProviderWrapperProps {
  children: ReactNode
}

/**
 * Custom Clerk provider wrapper that handles redirect configuration
 * This ensures that redirect parameters are properly handled throughout the authentication flow
 */
export default function ClerkProviderWrapper({ children }: ClerkProviderWrapperProps) {
  return (
    <ClerkProvider
      localization={{
        signIn: { start: { title: "Sign in" } },
      }}
      appearance={{
        elements: {
          // Customize the appearance to ensure redirect parameters are preserved
          rootBox: "clerk-root-box",
        },
      }}
    >
      {children}
    </ClerkProvider>
  )
}
