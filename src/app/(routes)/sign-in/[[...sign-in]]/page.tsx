'use client'

import { SignIn } from '@clerk/nextjs'
import { useRedirectUrl } from '@/hooks/useRedirectUrl'

export default function SignInPage() {
	const { redirectUrl } = useRedirectUrl()

	return (
		<>
			<hr className="mt-3 mb-6 hr-text w-full" data-content="SIGN IN" />

			<div className="min-h-94 sm:mt-15 sm:mb-24 mx-auto sm:w-[480px]">
				<SignIn
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