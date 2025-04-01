"use client"

import { useState } from "react"
import { Star, StarOff, ExternalLink, TrendingUp, TrendingDown, DollarSign, BarChart3, Clock } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Crypto } from "@/components/crypto-tracker"
import { CryptoChart } from "@/components/crypto-chart"
import TradingViewEmbed from "@/components/trading-view-embed"

interface CryptoDetailProps {
  crypto: Crypto
  isFavorite: boolean
  onToggleFavorite: () => void
}

export default function CryptoDetail({ crypto, isFavorite, onToggleFavorite }: CryptoDetailProps) {
  const [timeframe, setTimeframe] = useState("24h")
  const [chartView, setChartView] = useState("basic") // "basic" or "tradingview"
  const priceChangeIsPositive = crypto.price_change_percentage_24h > 0

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <img
              src={crypto.image || `/placeholder.svg?height=40&width=40&text=${crypto.symbol.toUpperCase()}`}
              alt={crypto.name}
              className="w-10 h-10 rounded-full"
              onError={(e) => {
                e.currentTarget.src = `/placeholder.svg?height=40&width=40&text=${crypto.symbol.toUpperCase()}`
              }}
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-bold">{crypto.name}</h2>
                <span className="text-sm bg-muted px-2 py-0.5 rounded-md uppercase">{crypto.symbol}</span>
                {crypto.market_cap_rank && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    Rank #{crypto.market_cap_rank}
                  </span>
                )}
                {crypto.blockchain === "solana" && (
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                    Solana
                  </Badge>
                )}
                {crypto.is_memecoin && (
                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                    Memecoin
                  </Badge>
                )}
              </div>
              {crypto.contract_address && (
                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <span>Contract:</span>
                  <code className="bg-muted px-1 py-0.5 rounded text-xs">
                    {crypto.contract_address.substring(0, 10)}...
                    {crypto.contract_address.substring(crypto.contract_address.length - 8)}
                  </code>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={onToggleFavorite}>
              {isFavorite ? (
                <>
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  Favorited
                </>
              ) : (
                <>
                  <StarOff className="h-4 w-4" />
                  Add to Favorites
                </>
              )}
            </Button>
            <Button variant="outline" size="icon" asChild>
              <a href={`https://www.coingecko.com/en/coins/${crypto.id}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardDescription>Current Price</CardDescription>
              <CardTitle className="text-2xl">
                ${crypto.current_price.toLocaleString(undefined, { maximumFractionDigits: 6 })}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className={`text-sm flex items-center ${priceChangeIsPositive ? "text-green-500" : "text-red-500"}`}>
                {priceChangeIsPositive ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {priceChangeIsPositive ? "+" : ""}
                {crypto.price_change_percentage_24h.toFixed(2)}% (24h)
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 pb-2">
              <CardDescription>Market Cap</CardDescription>
              <CardTitle className="text-2xl">${(crypto.market_cap / 1000000000).toFixed(2)}B</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-sm text-muted-foreground flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                Volume: ${(crypto.total_volume / 1000000).toFixed(2)}M
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 pb-2">
              <CardDescription>All Time High</CardDescription>
              <CardTitle className="text-2xl">
                ${crypto.ath.toLocaleString(undefined, { maximumFractionDigits: 6 })}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-sm text-muted-foreground flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {formatDate(crypto.ath_date)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 pb-2">
              <CardDescription>Circulating Supply</CardDescription>
              <CardTitle className="text-2xl">{(crypto.circulating_supply / 1000000).toFixed(2)}M</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-sm text-muted-foreground flex items-center">
                <BarChart3 className="h-4 w-4 mr-1" />
                {crypto.max_supply ? `Max: ${(crypto.max_supply / 1000000).toFixed(2)}M` : "No max supply"}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Price Chart</h3>
            <div className="flex items-center gap-4">
              <Tabs value={chartView} onValueChange={setChartView} className="w-[260px]">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Basic Chart</TabsTrigger>
                  <TabsTrigger value="tradingview">TradingView</TabsTrigger>
                </TabsList>
              </Tabs>
              
              {chartView === "basic" && (
                <Tabs value={timeframe} onValueChange={setTimeframe}>
                  <TabsList>
                    <TabsTrigger value="24h">24H</TabsTrigger>
                    <TabsTrigger value="7d">7D</TabsTrigger>
                    <TabsTrigger value="30d">30D</TabsTrigger>
                    <TabsTrigger value="1y">1Y</TabsTrigger>
                  </TabsList>
                </Tabs>
              )}
            </div>
          </div>

          {chartView === "basic" ? (
            <CryptoChart cryptoId={crypto.id} timeframe={timeframe} blockchain={crypto.blockchain} />
          ) : (
            <TradingViewEmbed symbol={`${crypto.symbol.toUpperCase()}USD`} />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Market Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Market Cap Rank</span>
              <span className="font-medium">#{crypto.market_cap_rank}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Market Cap</span>
              <span className="font-medium">${crypto.market_cap.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Trading Volume (24h)</span>
              <span className="font-medium">${crypto.total_volume.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">24h High</span>
              <span className="font-medium">
                ${crypto.high_24h.toLocaleString(undefined, { maximumFractionDigits: 6 })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">24h Low</span>
              <span className="font-medium">
                ${crypto.low_24h.toLocaleString(undefined, { maximumFractionDigits: 6 })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">All-Time High</span>
              <span className="font-medium">${crypto.ath.toLocaleString(undefined, { maximumFractionDigits: 6 })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">All-Time Low</span>
              <span className="font-medium">${crypto.atl.toLocaleString(undefined, { maximumFractionDigits: 6 })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Blockchain</span>
              <span className="font-medium capitalize">{crypto.blockchain || "Ethereum"}</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Supply Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Circulating Supply</span>
              <span className="font-medium">
                {crypto.circulating_supply.toLocaleString()} {crypto.symbol.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Supply</span>
              <span className="font-medium">
                {crypto.total_supply ? crypto.total_supply.toLocaleString() : "N/A"} {crypto.symbol.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Max Supply</span>
              <span className="font-medium">
                {crypto.max_supply ? crypto.max_supply.toLocaleString() : "Unlimited"} {crypto.symbol.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fully Diluted Valuation</span>
              <span className="font-medium">
                {crypto.fully_diluted_valuation ? `$${crypto.fully_diluted_valuation.toLocaleString()}` : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Updated</span>
              <span className="font-medium">{new Date(crypto.last_updated).toLocaleString()}</span>
            </div>
            {crypto.contract_address && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Contract Address</span>
                <span className="font-medium text-xs break-all">{crypto.contract_address}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

