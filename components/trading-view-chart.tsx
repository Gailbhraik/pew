"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function TradingViewChart() {
  return (
    <Card className="gradient-card">
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Fonctionnalité en maintenance</h2>
          <p className="text-muted-foreground mb-6">
            La fonctionnalité TradingView est temporairement indisponible pendant que nous effectuons des améliorations.
          </p>
          <Button asChild>
            <Link href="/">
              Retour à l'accueil
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
