import { DofusMap } from "../../components/dofus-map"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserAuth } from "@/components/user-auth"
import { LocalTime } from "@/components/local-time"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function DofusMapPage() {
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-2">
          <Link 
            href="/" 
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Retour
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Carte Interactive Dofus</h1>
        </div>
        <div className="flex items-center space-x-2">
          <LocalTime />
          <ThemeToggle />
          <UserAuth />
        </div>
      </div>
      
      <DofusMap />
    </div>
  )
}
