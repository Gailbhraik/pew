"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, RefreshCw, Maximize2, X } from "lucide-react"

interface TradingViewChartProps {
  chartId: string
  initialOptions?: {
    symbol: string
    interval: string
    height: number
    autosize: boolean
  }
  onRemove?: () => void
  onMaximize?: () => void
  isMaximized?: boolean
}

export function TradingViewChart({
  chartId,
  initialOptions = {
    symbol: "BINANCE:BTCUSDT",
    interval: "1h",
    height: 500,
    autosize: true
  },
  onRemove,
  onMaximize,
  isMaximized = false
}: TradingViewChartProps) {
  const symbol = initialOptions.symbol || "BINANCE:BTCUSDT"
  
  return (
    <Card className={`gradient-card ${isMaximized ? "col-span-full row-span-full" : ""}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">{symbol.replace("BINANCE:", "")}</CardTitle>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-muted"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-muted"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          {onMaximize && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onMaximize}
              className="hover:bg-muted"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          )}
          {onRemove && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onRemove}
              className="hover:bg-muted text-destructive hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="w-full h-[500px] flex flex-col items-center justify-center bg-muted/20 rounded-md">
          <p className="text-muted-foreground">
            Graphique TradingView en cours de chargement...
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            (Fonctionnalité temporairement désactivée pour résoudre les problèmes de déploiement)
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
