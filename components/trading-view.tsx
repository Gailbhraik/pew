"use client"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, AlertTriangle } from "lucide-react"
import type { Crypto } from "@/components/crypto-tracker"

interface TradingViewProps {
  cryptos: Crypto[]
}

export default function TradingView({ cryptos }: TradingViewProps) {
  const [selectedCrypto, setSelectedCrypto] = useState<string>("BTCUSD")
  const [selectedInterval, setSelectedInterval] = useState<string>("D")
  const [selectedChartType, setSelectedChartType] = useState<string>("1")
  const [iframeKey, setIframeKey] = useState<number>(Date.now())
  const [iframeError, setIframeError] = useState<boolean>(false)
  const { theme } = useTheme()
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Initialize chart on mount
  useEffect(() => {
    updateChartSource()
  }, [])

  // Update iframe source when settings change
  useEffect(() => {
    updateChartSource()
  }, [selectedCrypto, selectedInterval, selectedChartType, theme, iframeKey])

  // Update the chart iframe source
  const updateChartSource = () => {
    if (iframeRef.current) {
      const symbol = selectedCrypto;
      const interval = selectedInterval;
      const chartType = selectedChartType;
      const themeColor = theme === "dark" ? "dark" : "light";
      
      // Reset error state
      setIframeError(false);
      
      // TradingView advanced chart with parameters
      const iframeSrc = `https://s.tradingview.com/widgetembed/?symbol=${symbol}&interval=${interval}&style=${chartType}&theme=${themeColor}&locale=fr&enable_publishing=false&hide_side_toolbar=false&allow_symbol_change=true&studies=%5B%22RSI%40tv-basicstudies%22%2C%22MACDHisto%40tv-basicstudies%22%2C%22MASimple%40tv-basicstudies%22%5D&withdateranges=true&hide_volume=false&timezone=Europe%2FParis`;
      
      // Set iframe source
      iframeRef.current.src = iframeSrc;
    }
  }

  // Force refresh the iframe
  const refreshChart = () => {
    setIframeError(false);
    setIframeKey(Date.now());
  }

  // Generate symbols options for the Select component
  const getSymbolOptions = () => {
    // Default options if cryptos are not available
    const defaultOptions = [
      { value: "BTCUSD", label: "Bitcoin (BTC/USD)" },
      { value: "ETHUSD", label: "Ethereum (ETH/USD)" },
      { value: "SOLUSD", label: "Solana (SOL/USD)" },
      { value: "ADAUSD", label: "Cardano (ADA/USD)" },
      { value: "DOTUSD", label: "Polkadot (DOT/USD)" },
    ]

    if (!cryptos || cryptos.length === 0) {
      return defaultOptions
    }

    // Top 30 cryptos by market cap and user favorites
    return cryptos
      .filter((crypto) => crypto.symbol && crypto.name)
      .slice(0, 50)
      .map((crypto) => ({
        value: `${crypto.symbol.toUpperCase()}USD`,
        label: `${crypto.name} (${crypto.symbol.toUpperCase()}/USD)`,
      }))
  }

  // Interval options
  const intervalOptions = [
    { value: "1", label: "1 minute" },
    { value: "5", label: "5 minutes" },
    { value: "15", label: "15 minutes" },
    { value: "30", label: "30 minutes" },
    { value: "60", label: "1 heure" },
    { value: "120", label: "2 heures" },
    { value: "240", label: "4 heures" },
    { value: "D", label: "1 jour" },
    { value: "W", label: "1 semaine" },
    { value: "M", label: "1 mois" },
  ]

  // Chart type options
  const chartTypeOptions = [
    { value: "0", label: "Bougies" },
    { value: "1", label: "Barres" },
    { value: "2", label: "Ligne" },
    { value: "3", label: "Zone" },
  ]

  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>TradingView Charts</CardTitle>
            <CardDescription>Afficher et analyser les graphiques des cryptomonnaies</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={refreshChart} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Rafraîchir
          </Button>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Cryptomonnaie</label>
            <Select
              value={selectedCrypto}
              onValueChange={(value) => setSelectedCrypto(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner une crypto" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {getSymbolOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Intervalle</label>
            <Select
              value={selectedInterval}
              onValueChange={(value) => setSelectedInterval(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Intervalle de temps" />
              </SelectTrigger>
              <SelectContent>
                {intervalOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Type de graphique</label>
            <Select
              value={selectedChartType}
              onValueChange={(value) => setSelectedChartType(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Type de graphique" />
              </SelectTrigger>
              <SelectContent>
                {chartTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-[600px] bg-muted/10 rounded-md border">
          {iframeError ? (
            <div className="flex flex-col items-center justify-center h-full p-4">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
              <p className="text-center text-muted-foreground mb-4">
                Impossible de charger le graphique TradingView. Veuillez vérifier votre connexion internet.
              </p>
              <Button onClick={refreshChart} variant="outline" size="sm">
                Réessayer
              </Button>
            </div>
          ) : (
            <iframe 
              key={iframeKey}
              ref={iframeRef}
              title="TradingView Chart" 
              style={{ width: "100%", height: "100%", border: "none" }}
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onError={() => setIframeError(true)}
              onLoad={() => setIframeError(false)}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}