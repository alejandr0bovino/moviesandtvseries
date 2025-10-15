import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
    '/dashboard(.*)',
    '/settings(.*)',
    '/profile(.*)',
    '/admin(.*)',
])

export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) await auth.protect()
})

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:css|js|png|jpg|jpeg|svg|ico)).*)',
        '/(api|trpc)(.*)',
    ],
}