/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // swcMinify est obsolète dans Next.js 15+
  // swcMinify: true, 
  output: 'standalone',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Supprimer trailingSlash qui peut causer des problèmes avec certaines routes
  // trailingSlash: true,
}

module.exports = nextConfig