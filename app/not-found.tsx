import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowLeft, Home, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold tracking-tighter text-primary">404</h1>
          <h2 className="text-3xl font-bold tracking-tight">Page introuvable</h2>
          <p className="text-muted-foreground">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/scanner">
              <Search className="mr-2 h-4 w-4" />
              Scanner Blockchain
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
          <Link 
            href="/multi-charts"
            className="p-4 border rounded-lg hover:bg-muted/50 transition-colors flex flex-col items-center justify-center text-center"
          >
            <div className="font-medium">Multi Charts</div>
            <div className="text-xs text-muted-foreground">Graphiques TradingView</div>
          </Link>
          <Link 
            href="/dofus-map"
            className="p-4 border rounded-lg hover:bg-muted/50 transition-colors flex flex-col items-center justify-center text-center"
          >
            <div className="font-medium">Carte Dofus</div>
            <div className="text-xs text-muted-foreground">Ressources du monde des Douze</div>
          </Link>
          <Link 
            href="/pokemon"
            className="p-4 border rounded-lg hover:bg-muted/50 transition-colors flex flex-col items-center justify-center text-center"
          >
            <div className="font-medium">Pokémon</div>
            <div className="text-xs text-muted-foreground">Explorez le Pokédex</div>
          </Link>
          <Link 
            href="/"
            className="p-4 border rounded-lg hover:bg-muted/50 transition-colors flex flex-col items-center justify-center text-center"
          >
            <div className="font-medium">Crypto Tracker</div>
            <div className="text-xs text-muted-foreground">Suivi des cryptomonnaies</div>
          </Link>
        </div>
      </div>
    </div>
  )
}
