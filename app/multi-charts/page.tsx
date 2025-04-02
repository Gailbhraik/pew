"use client"

import { useState } from "react"
import { TradingViewChart } from "@/components/trading-view-chart"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserAuth } from "@/components/user-auth"
import { LocalTime } from "@/components/local-time"
import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MultiChartsPage() {
  // État pour les graphiques
  const [charts, setCharts] = useState([
    { id: "chart1", symbol: "BINANCE:BTCUSDT", interval: "1h" },
  ])
  const [layout, setLayout] = useState<"1x1" | "1x2" | "2x1" | "2x2">("1x1")
  const [maximizedChart, setMaximizedChart] = useState<string | null>(null)
  
  // Ajouter un nouveau graphique
  const addChart = () => {
    if (charts.length < 4) {
      setCharts([...charts, { 
        id: `chart${charts.length + 1}`, 
        symbol: "BINANCE:ETHUSDT", 
        interval: "1h" 
      }])
      
      // Mettre à jour automatiquement la disposition
      if (charts.length === 1) {
        setLayout("1x2")
      } else if (charts.length === 2) {
        setLayout("2x2")
      }
    }
  }
  
  // Supprimer un graphique
  const removeChart = (id: string) => {
    setCharts(charts.filter(chart => chart.id !== id))
    
    // Mettre à jour automatiquement la disposition
    if (charts.length === 2) {
      setLayout("1x1")
    } else if (charts.length === 3) {
      setLayout("1x2")
    } else if (charts.length === 4) {
      setLayout("2x2")
    }
    
    // Réinitialiser le graphique maximisé si c'est celui qui est supprimé
    if (maximizedChart === id) {
      setMaximizedChart(null)
    }
  }
  
  // Maximiser/minimiser un graphique
  const toggleMaximize = (id: string) => {
    setMaximizedChart(maximizedChart === id ? null : id)
  }
  
  // Déterminer les classes CSS pour la grille en fonction de la disposition
  const getGridClasses = () => {
    if (maximizedChart) {
      return "grid-cols-1 grid-rows-1"
    }
    
    switch (layout) {
      case "1x1":
        return "grid-cols-1 grid-rows-1"
      case "1x2":
        return "grid-cols-1 grid-rows-2"
      case "2x1":
        return "grid-cols-2 grid-rows-1"
      case "2x2":
        return "grid-cols-2 grid-rows-2"
      default:
        return "grid-cols-1 grid-rows-1"
    }
  }
  
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
            onClick={addChart} 
            disabled={charts.length >= 4 || maximizedChart !== null}
            className="glow-effect"
          >
            <Plus className="mr-1 h-4 w-4" />
            Ajouter un graphique
          </Button>
          
          {!maximizedChart && (
            <Tabs value={layout} onValueChange={(value) => setLayout(value as any)} className="w-auto">
              <TabsList>
                <TabsTrigger value="1x1" disabled={charts.length > 1}>1×1</TabsTrigger>
                <TabsTrigger value="1x2" disabled={charts.length > 2}>1×2</TabsTrigger>
                <TabsTrigger value="2x1" disabled={charts.length > 2}>2×1</TabsTrigger>
                <TabsTrigger value="2x2" disabled={charts.length > 4}>2×2</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>
        
        <div className="text-sm text-muted-foreground">
          {charts.length}/4 graphiques
        </div>
      </div>
      
      <div className={`grid ${getGridClasses()} gap-4 h-[calc(100vh-200px)]`}>
        {charts.map((chart) => {
          // Si un graphique est maximisé, n'afficher que celui-ci
          if (maximizedChart && chart.id !== maximizedChart) {
            return null
          }
          
          return (
            <TradingViewChart 
              key={chart.id}
              chartId={chart.id}
              initialOptions={{
                symbol: chart.symbol,
                interval: chart.interval as any,
                height: 500,
                autosize: true
              }}
              onRemove={() => removeChart(chart.id)}
              onMaximize={() => toggleMaximize(chart.id)}
              isMaximized={maximizedChart === chart.id}
            />
          )
        })}
      </div>
    </div>
  )
}
