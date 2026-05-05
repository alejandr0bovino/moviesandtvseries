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
        '/dashboard(.*)',
        '/settings(.*)',
        '/profile(.*)',
        '/admin(.*)',
    ],
}