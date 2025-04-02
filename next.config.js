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
  // Ajouter la configuration de rewrites pour les pages
  async rewrites() {
    return {
      beforeFiles: [
        // Ces rewrites sont appliqués avant de chercher les fichiers
        {
          source: '/multi-charts',
          destination: '/app/multi-charts/page',
        },
        {
          source: '/dofus-map',
          destination: '/app/dofus-map/page',
        },
      ],
      afterFiles: [
        // Ces rewrites sont appliqués après avoir cherché les fichiers mais avant les routes dynamiques
        {
          source: '/:path*',
          destination: '/:path*',
        },
      ],
      fallback: [
        // Ces rewrites sont appliqués si aucune des routes précédentes ne correspond
        {
          source: '/:path*',
          destination: '/',
        },
      ],
    }
  },
}

module.exports = nextConfig