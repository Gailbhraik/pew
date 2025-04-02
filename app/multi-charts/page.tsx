"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function MultiChartsPage() {
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex items-center mb-8">
        <Link 
          href="/" 
          className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Retour
        </Link>
        <h1 className="ml-4 text-3xl font-bold tracking-tight">Multi Charts</h1>
      </div>
      
      <Card className="gradient-card">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Fonctionnalité en maintenance</h2>
            <p className="text-muted-foreground mb-6">
              La fonctionnalité Multi Charts est temporairement indisponible pendant que nous effectuons des améliorations.
            </p>
            <p className="text-muted-foreground mb-6">
              Nous travaillons à rétablir cette fonctionnalité dès que possible. Merci de votre patience.
            </p>
            <Button asChild>
              <Link href="/">
                Retour à l'accueil
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
