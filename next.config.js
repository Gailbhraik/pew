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
  // Désactiver le trailing slash pour éviter les problèmes de routage
  trailingSlash: false,
  // Ajouter la configuration de redirections pour les pages
  async redirects() {
    return [
      {
        source: '/multi-charts/',
        destination: '/multi-charts',
        permanent: true,
      },
      {
        source: '/dofus-map/',
        destination: '/dofus-map',
        permanent: true,
      },
      {
        source: '/scanner/',
        destination: '/scanner',
        permanent: true,
      },
      {
        source: '/pokemon/',
        destination: '/pokemon',
        permanent: true,
      },
    ]
  },
  // Configuration simplifiée des rewrites
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/:path*',
      },
    ]
  },
}

module.exports = nextConfig