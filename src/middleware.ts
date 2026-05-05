// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// const isProtectedRoute = createRouteMatcher([
//     '/dashboard(.*)',
//     '/settings(.*)',
//     '/profile(.*)',
//     '/admin(.*)',
// ])

// export default clerkMiddleware(async (auth, req) => {
//     if (isProtectedRoute(req)) await auth.protect()
// })

// export const config = {
//     matcher: [
//         '/((?!_next|[^?]*\\.(?:css|js|png|jpg|jpeg|svg|ico)).*)',
//         '/(api|trpc)(.*)',
//     ],
// }

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
    '/dashboard(.*)',
])

export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) await auth.protect()
})

// Dashboard: auth.protect(). API routes: clerkMiddleware must run so `auth()` works in route handlers.
export const config = {
    matcher: [
        '/dashboard(.*)',
        '/api/(.*)',
    ],
}