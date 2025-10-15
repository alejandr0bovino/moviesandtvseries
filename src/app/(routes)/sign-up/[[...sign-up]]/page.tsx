'use client'

import { SignUp } from '@clerk/nextjs'
import { useRedirectUrl } from '@/hooks/useRedirectUrl'

export default function SignUpPage() {
  const { redirectUrl } = useRedirectUrl()

  return (
    <>
      <hr className="mt-3 mb-6 hr-text w-full" data-content="SIGN UP" />

      <div className="min-h-94 sm:mt-22 sm:mb-30 mx-auto sm:w-[480px]">
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto sm:scale-120",
            },
          }}
          fallbackRedirectUrl={redirectUrl}
          forceRedirectUrl={redirectUrl}
        />
      </div>
    </>
  )
}