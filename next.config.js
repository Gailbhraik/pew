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
  // Ajouter trailingSlash pour éviter certains problèmes de routage
  trailingSlash: true,
}

module.exports = nextConfig 