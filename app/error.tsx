'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Enregistrer l'erreur dans un service de suivi des erreurs
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="space-y-6 max-w-md">
        <div className="flex flex-col items-center space-y-2">
          <AlertTriangle className="h-12 w-12 text-destructive" />
          <h1 className="text-3xl font-bold tracking-tight">Oups ! Quelque chose s'est mal passé</h1>
          <p className="text-muted-foreground">
            Nous avons rencontré une erreur lors du traitement de votre demande.
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground">
              ID d'erreur: {error.digest}
            </p>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button onClick={reset} className="w-full sm:w-auto">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Réessayer
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
