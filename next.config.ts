import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // devIndicators: false,
  reactStrictMode: true, // Enable React strict mode for better development experience
  typescript: {
    ignoreBuildErrors: false, // Ensure TypeScript errors fail builds
  },
  eslint: {
    ignoreDuringBuilds: false, // Ensure ESLint errors fail builds
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      }
    ],
    unoptimized: true,
  },
};

export default nextConfig;
