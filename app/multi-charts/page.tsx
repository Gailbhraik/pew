"use client"

import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserAuth } from "@/components/user-auth"
import { LocalTime } from "@/components/local-time"
import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function MultiChartsPage() {
  const [layout, setLayout] = useState<"1x1" | "1x2" | "2x1" | "2x2">("1x1")
  const [maximizedChart, setMaximizedChart] = useState<string | null>(null)
  
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
          <h1 className="text-3xl font-bold tracking-tight">Multi Charts</h1>
        </div>
        <div className="flex items-center space-x-2">
          <LocalTime />
          <ThemeToggle />
          <UserAuth />
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <Button 
            onClick={() => {}}
            className="glow-effect"
          >
            <Plus className="mr-1 h-4 w-4" />
            Ajouter un graphique
          </Button>
          
          <Tabs value={layout} onValueChange={(value) => setLayout(value as any)} className="w-auto">
            <TabsList>
              <TabsTrigger value="1x1">1×1</TabsTrigger>
              <TabsTrigger value="1x2">1×2</TabsTrigger>
              <TabsTrigger value="2x1">2×1</TabsTrigger>
              <TabsTrigger value="2x2">2×2</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="text-sm text-muted-foreground">
          1/4 graphiques
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 h-[calc(100vh-200px)]">
        <Card className="gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">BINANCE:BTCUSDT</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[500px] flex items-center justify-center bg-muted/20 rounded-md">
              <p className="text-muted-foreground">
                Graphique TradingView en cours de chargement...
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                (Fonctionnalité temporairement désactivée pour résoudre les problèmes de déploiement)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
