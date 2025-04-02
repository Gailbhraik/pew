"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronDown, ChevronUp, Maximize2, Minimize2, RefreshCw, X } from "lucide-react"

// Types pour les options du graphique
type ChartInterval = "1m" | "5m" | "15m" | "30m" | "1h" | "4h" | "1d" | "1w" | "1M"
type ChartTheme = "light" | "dark"
type ChartStyle = "candles" | "bars" | "line" | "area"

interface ChartOptions {
  symbol: string
  interval: ChartInterval
  theme: ChartTheme
  style: ChartStyle
  showVolume: boolean
  autosize: boolean
  height: number
  width: number
}

interface TradingViewChartProps {
  initialOptions?: Partial<ChartOptions>
  onRemove?: () => void
  onMaximize?: () => void
  isMaximized?: boolean
  chartId: string
}

const defaultOptions: ChartOptions = {
  symbol: "BINANCE:BTCUSDT",
  interval: "1h",
  theme: "dark",
  style: "candles",
  showVolume: true,
  autosize: true,
  height: 500,
  width: 800
}

export function TradingViewChart({
  initialOptions,
  onRemove,
  onMaximize,
  isMaximized = false,
  chartId
}: TradingViewChartProps) {
  const [options, setOptions] = useState<ChartOptions>({
    ...defaultOptions,
    ...initialOptions
  })
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Symboles populaires prédéfinis
  const popularSymbols = [
    { label: "Bitcoin (BTC/USDT)", value: "BINANCE:BTCUSDT" },
    { label: "Ethereum (ETH/USDT)", value: "BINANCE:ETHUSDT" },
    { label: "Solana (SOL/USDT)", value: "BINANCE:SOLUSDT" },
    { label: "BNB (BNB/USDT)", value: "BINANCE:BNBUSDT" },
    { label: "XRP (XRP/USDT)", value: "BINANCE:XRPUSDT" },
    { label: "Cardano (ADA/USDT)", value: "BINANCE:ADAUSDT" },
    { label: "Dogecoin (DOGE/USDT)", value: "BINANCE:DOGEUSDT" },
    { label: "Polkadot (DOT/USDT)", value: "BINANCE:DOTUSDT" },
    { label: "Avalanche (AVAX/USDT)", value: "BINANCE:AVAXUSDT" },
    { label: "Shiba Inu (SHIB/USDT)", value: "BINANCE:SHIBUSDT" }
  ]
  
  // Initialiser le widget TradingView
  useEffect(() => {
    setIsLoading(true)
    
    // Nettoyer le conteneur
    if (containerRef.current) {
      containerRef.current.innerHTML = ""
    }
    
    // Créer le script pour le widget
    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/tv.js"
    script.async = true
    script.onload = () => {
      if (typeof window.TradingView !== "undefined" && containerRef.current) {
        new window.TradingView.widget({
          container_id: chartId,
          symbol: options.symbol,
          interval: options.interval,
          timezone: "Etc/UTC",
          theme: options.theme,
          style: options.style,
          locale: "fr",
          toolbar_bg: options.theme === "dark" ? "#2a2e39" : "#f1f3f6",
          enable_publishing: false,
          allow_symbol_change: true,
          save_image: true,
          studies: ["Volume@tv-basicstudies"],
          show_popup_button: true,
          popup_width: "1000",
          popup_height: "650",
          hide_side_toolbar: false,
          withdateranges: true,
          hide_volume: !options.showVolume,
          autosize: options.autosize,
          height: options.height,
          width: options.width,
        })
        setIsLoading(false)
      }
    }
    
    document.head.appendChild(script)
    
    return () => {
      // Nettoyer le script lors du démontage
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [options, chartId])
  
  // Mettre à jour les options du graphique
  const updateOptions = (newOptions: Partial<ChartOptions>) => {
    setOptions(prev => ({
      ...prev,
      ...newOptions
    }))
  }
  
  // Gérer le changement de symbole personnalisé
  const handleCustomSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateOptions({ symbol: e.target.value })
  }
  
  return (
    <Card className={`gradient-card ${isMaximized ? "col-span-full row-span-full" : ""}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">{options.symbol.replace("BINANCE:", "")}</CardTitle>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsSettingsOpen(prev => !prev)}
            className="hover:bg-muted"
          >
            {isSettingsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => updateOptions({ ...options })}
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
              {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
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
      
      {isSettingsOpen && (
        <CardContent className="pb-2">
          <Tabs defaultValue="symbol" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="symbol">Symbole</TabsTrigger>
              <TabsTrigger value="interval">Intervalle</TabsTrigger>
              <TabsTrigger value="appearance">Apparence</TabsTrigger>
            </TabsList>
            
            <TabsContent value="symbol" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="symbol-select">Symbole populaire</Label>
                <Select 
                  onValueChange={(value) => updateOptions({ symbol: value })}
                  value={options.symbol}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un symbole" />
                  </SelectTrigger>
                  <SelectContent>
                    {popularSymbols.map(symbol => (
                      <SelectItem key={symbol.value} value={symbol.value}>
                        {symbol.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="custom-symbol">Symbole personnalisé</Label>
                <Input 
                  id="custom-symbol"
                  placeholder="ex: BINANCE:BTCUSDT"
                  value={options.symbol}
                  onChange={handleCustomSymbolChange}
                  className="shimmer"
                />
                <p className="text-xs text-muted-foreground">
                  Format: EXCHANGE:SYMBOL (ex: BINANCE:BTCUSDT, COINBASE:BTC-USD)
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="interval" className="space-y-4">
              <div className="space-y-2">
                <Label>Intervalle de temps</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(["1m", "5m", "15m", "30m", "1h", "4h", "1d", "1w", "1M"] as ChartInterval[]).map(interval => (
                    <Button 
                      key={interval}
                      variant={options.interval === interval ? "default" : "outline"}
                      onClick={() => updateOptions({ interval })}
                      className="w-full"
                    >
                      {interval}
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="appearance" className="space-y-4">
              <div className="space-y-2">
                <Label>Style du graphique</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(["candles", "bars", "line", "area"] as ChartStyle[]).map(style => (
                    <Button 
                      key={style}
                      variant={options.style === style ? "default" : "outline"}
                      onClick={() => updateOptions({ style })}
                      className="w-full capitalize"
                    >
                      {style === "candles" ? "Bougies" : 
                       style === "bars" ? "Barres" : 
                       style === "line" ? "Ligne" : 
                       "Zone"}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Thème</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant={options.theme === "light" ? "default" : "outline"}
                    onClick={() => updateOptions({ theme: "light" })}
                    className="w-full"
                  >
                    Clair
                  </Button>
                  <Button 
                    variant={options.theme === "dark" ? "default" : "outline"}
                    onClick={() => updateOptions({ theme: "dark" })}
                    className="w-full"
                  >
                    Sombre
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="show-volume" className="cursor-pointer">Afficher le volume</Label>
                <Switch 
                  id="show-volume"
                  checked={options.showVolume}
                  onCheckedChange={(checked) => updateOptions({ showVolume: checked })}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
      
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center h-[500px] w-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}
        <div 
          id={chartId} 
          ref={containerRef} 
          className={`w-full ${isLoading ? 'hidden' : 'block'}`}
          style={{ height: options.height }}
        ></div>
      </CardContent>
    </Card>
  )
}

// Déclarer le type TradingView pour TypeScript
declare global {
  interface Window {
    TradingView: any
  }
}
