import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Ce middleware s'exécute avant que les requêtes n'atteignent vos routes
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  
  // Si l'URL se termine par un slash et n'est pas la racine, rediriger vers la version sans slash
  if (url.pathname.endsWith('/') && url.pathname !== '/') {
    url.pathname = url.pathname.slice(0, -1)
    return NextResponse.redirect(url)
  }
  
  return NextResponse.next()
}

// Configurer le middleware pour s'exécuter sur toutes les routes
export const config = {
  matcher: [
    /*
     * Match toutes les routes de pages sauf:
     * 1. /api (routes API)
     * 2. /_next (routes Next.js internes)
     * 3. /_static (généralement pour les ressources statiques)
     * 4. /_vercel (routes internes Vercel)
     * 5. Les fichiers statiques comme les images, les polices, etc.
     */
    '/((?!api|_next|_static|_vercel|.*\\..*|favicon.ico).*)',
  ],
}
