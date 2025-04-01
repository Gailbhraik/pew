"use client"

import { useState, useEffect } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { LineChartIcon, CandlestickChart } from "lucide-react"

interface ChartData {
  date: string
  price: number
}

interface CandlestickData {
  date: string
  open: number
  high: number
  low: number
  close: number
}

interface CryptoChartProps {
  cryptoId: string
  timeframe: string
  blockchain?: string
}

export function CryptoChart({ cryptoId, timeframe, blockchain = "ethereum" }: CryptoChartProps) {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [candlestickData, setCandlestickData] = useState<CandlestickData[]>([])
  const [loading, setLoading] = useState(true)
  const [chartType, setChartType] = useState<"line" | "candlestick">("line")

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true)

      let days = "1"
      switch (timeframe) {
        case "7d":
          days = "7"
          break
        case "30d":
          days = "30"
          break
        case "1y":
          days = "365"
          break
        default:
          days = "1"
      }

      try {
        // Pour les tokens Solana, on génère des données fictives
        // Dans un cas réel, on utiliserait une API spécifique à Solana
        if (blockchain === "solana") {
          generateMockData(timeframe)
          return
        }

        // Données pour le graphique en ligne
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=usd&days=${days}`,
        )
        const data = await response.json()

        if (data && data.prices) {
          const formattedData = data.prices.map((item: [number, number]) => ({
            date: new Date(item[0]).toISOString(),
            price: item[1],
          }))

          setChartData(formattedData)

          // Générer des données de bougie à partir des données de prix
          // Dans un cas réel, on utiliserait une API spécifique pour les données OHLC
          generateCandlestickData(formattedData)
        }
      } catch (error) {
        console.error("Error fetching chart data:", error)
        // Generate mock data for demo purposes
        generateMockData(timeframe)
      } finally {
        setLoading(false)
      }
    }

    fetchChartData()
  }, [cryptoId, timeframe, blockchain])

  const generateCandlestickData = (lineData: ChartData[]) => {
    // Déterminer l'intervalle pour les bougies en fonction du timeframe
    let interval = 1 // heures par défaut
    if (timeframe === "7d") interval = 6 // 6 heures
    if (timeframe === "30d") interval = 24 // 1 jour
    if (timeframe === "1y") interval = 7 * 24 // 1 semaine

    const candleData: CandlestickData[] = []

    // Regrouper les données par intervalle
    for (let i = 0; i < lineData.length; i += interval) {
      const slice = lineData.slice(i, i + interval)
      if (slice.length === 0) continue

      const prices = slice.map((item) => item.price)
      const open = prices[0]
      const close = prices[prices.length - 1]
      const high = Math.max(...prices)
      const low = Math.min(...prices)

      candleData.push({
        date: slice[0].date,
        open,
        high,
        low,
        close,
      })
    }

    setCandlestickData(candleData)
  }

  const generateMockData = (timeframe: string) => {
    const now = new Date()
    const data: ChartData[] = []
    const candleData: CandlestickData[] = []

    let points = 24
    let interval = 60 * 60 * 1000 // 1 hour in milliseconds

    switch (timeframe) {
      case "7d":
        points = 7 * 24
        interval = 60 * 60 * 1000 // 1 hour
        break
      case "30d":
        points = 30
        interval = 24 * 60 * 60 * 1000 // 1 day
        break
      case "1y":
        points = 365
        interval = 24 * 60 * 60 * 1000 // 1 day
        break
      default:
        points = 24
        interval = 60 * 60 * 1000 // 1 hour
    }

    // Générer un prix de base aléatoire selon le blockchain
    let basePrice = 30000 + Math.random() * 10000
    let volatility = 0.02 // 2% de volatilité par défaut

    if (blockchain === "solana") {
      basePrice = Math.random() * 0.01 // Prix très bas pour les memecoins Solana
      volatility = 0.1 // 10% de volatilité pour les memecoins (plus volatile)
    }

    let currentPrice = basePrice

    // Générer des données pour le graphique en ligne
    for (let i = points; i >= 0; i--) {
      const date = new Date(now.getTime() - i * interval)

      // Simuler des mouvements de prix plus réalistes
      const randomChange = (Math.random() - 0.5) * 2 * volatility
      currentPrice = currentPrice * (1 + randomChange)

      data.push({
        date: date.toISOString(),
        price: currentPrice,
      })
    }

    setChartData(data)

    // Générer des données pour le graphique en bougie
    // Regrouper les données par intervalle
    let candleInterval = 1 // heures par défaut
    if (timeframe === "7d") candleInterval = 6 // 6 heures
    if (timeframe === "30d") candleInterval = 24 // 1 jour
    if (timeframe === "1y") candleInterval = 7 * 24 // 1 semaine

    for (let i = 0; i < data.length; i += candleInterval) {
      const slice = data.slice(i, i + candleInterval)
      if (slice.length === 0) continue

      const prices = slice.map((item) => item.price)
      const open = prices[0]
      const close = prices[prices.length - 1]
      const high = Math.max(...prices)
      const low = Math.min(...prices)

      candleData.push({
        date: slice[0].date,
        open,
        high,
        low,
        close,
      })
    }

    setCandlestickData(candleData)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)

    switch (timeframe) {
      case "24h":
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      case "7d":
      case "30d":
        return date.toLocaleDateString([], { month: "short", day: "numeric" })
      case "1y":
        return date.toLocaleDateString([], { month: "short", year: "2-digit" })
      default:
        return date.toLocaleTimeString()
    }
  }

  if (loading) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center bg-muted/20 rounded-lg">
        Loading chart data...
      </div>
    )
  }

  // Fonction pour rendre le graphique en bougie personnalisé
  const renderCandlestick = (props: any) => {
    const { x, y, width, height, open, close } = props
    const fill = open > close ? "hsl(var(--destructive))" : "hsl(var(--chart-4))"

    return (
      <g>
        <line
          x1={x + width / 2}
          y1={y}
          x2={x + width / 2}
          y2={y + height}
          stroke="hsl(var(--foreground))"
          strokeWidth={1}
        />
        <rect x={x} y={open > close ? y : y + height} width={width} height={Math.abs(height)} fill={fill} />
      </g>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ToggleGroup
          type="single"
          value={chartType}
          onValueChange={(value) => value && setChartType(value as "line" | "candlestick")}
        >
          <ToggleGroupItem value="line" aria-label="Line chart">
            <LineChartIcon className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="candlestick" aria-label="Candlestick chart">
            <CandlestickChart className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <ChartContainer
        config={{
          price: {
            label: "Price",
            color: blockchain === "solana" ? "hsl(var(--chart-2))" : "hsl(var(--chart-1))",
          },
        }}
        className="h-[300px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "line" ? (
            <LineChart data={chartData}>
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tickLine={false}
                axisLine={false}
                padding={{ left: 20, right: 20 }}
                minTickGap={30}
              />
              <YAxis
                dataKey="price"
                tickFormatter={(value) => {
                  // Format differently based on price range
                  if (value < 0.01) {
                    return `$${value.toExponential(2)}`
                  }
                  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 6 })}`
                }}
                domain={["auto", "auto"]}
                tickLine={false}
                axisLine={false}
                width={80}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const price = payload[0].value as number
                    let formattedPrice = price.toLocaleString(undefined, { maximumFractionDigits: 6 })

                    // Format differently based on price range
                    if (price < 0.01) {
                      formattedPrice = price.toExponential(2)
                    }

                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">Date</span>
                            <span className="font-bold text-muted-foreground">
                              {formatDate(payload[0].payload.date)}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">Price</span>
                            <span className="font-bold">${formattedPrice}</span>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                strokeWidth={2}
                activeDot={{
                  r: 6,
                  style: {
                    fill: blockchain === "solana" ? "hsl(var(--chart-2))" : "hsl(var(--chart-1))",
                    stroke: "hsl(var(--background))",
                    strokeWidth: 2,
                  },
                }}
                dot={false}
                stroke={blockchain === "solana" ? "hsl(var(--chart-2))" : "hsl(var(--chart-1))"}
                fill="url(#gradient)"
              />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={blockchain === "solana" ? "hsl(var(--chart-2))" : "hsl(var(--chart-1))"}
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="100%"
                    stopColor={blockchain === "solana" ? "hsl(var(--chart-2))" : "hsl(var(--chart-1))"}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
            </LineChart>
          ) : (
            <LineChart data={candlestickData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tickLine={false}
                axisLine={false}
                padding={{ left: 20, right: 20 }}
                minTickGap={30}
              />
              <YAxis
                dataKey="high"
                tickFormatter={(value) => {
                  // Format differently based on price range
                  if (value < 0.01) {
                    return `$${value.toExponential(2)}`
                  }
                  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 6 })}`
                }}
                domain={["auto", "auto"]}
                tickLine={false}
                axisLine={false}
                width={80}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const open = payload[0].payload.open
                    const close = payload[0].payload.close
                    const high = payload[0].payload.high
                    const low = payload[0].payload.low
                    const date = payload[0].payload.date

                    const formatPrice = (price: number) => {
                      if (price < 0.01) {
                        return price.toExponential(2)
                      }
                      return price.toLocaleString(undefined, { maximumFractionDigits: 6 })
                    }

                    const priceChange = close - open
                    const priceChangePercent = (priceChange / open) * 100
                    const isPositive = priceChange >= 0

                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid gap-1">
                          <div className="text-sm font-medium">{formatDate(date)}</div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex flex-col">
                              <span className="text-muted-foreground">Open</span>
                              <span>${formatPrice(open)}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-muted-foreground">Close</span>
                              <span>${formatPrice(close)}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-muted-foreground">High</span>
                              <span>${formatPrice(high)}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-muted-foreground">Low</span>
                              <span>${formatPrice(low)}</span>
                            </div>
                          </div>
                          <div className={`text-xs ${isPositive ? "text-green-500" : "text-red-500"}`}>
                            {isPositive ? "+" : ""}
                            {formatPrice(priceChange)} ({isPositive ? "+" : ""}
                            {priceChangePercent.toFixed(2)}%)
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              {candlestickData.map((entry, index) => {
                const isPositive = entry.close >= entry.open
                const color = isPositive ? "hsl(var(--chart-4))" : "hsl(var(--destructive))"

                return (
                  <g key={`candle-${index}`}>
                    {/* Ligne verticale (mèche) */}
                    <line
                      x1={index * (100 / candlestickData.length) + 50 / candlestickData.length}
                      y1={entry.low}
                      x2={index * (100 / candlestickData.length) + 50 / candlestickData.length}
                      y2={entry.high}
                      stroke={color}
                      strokeWidth={1}
                    />
                    {/* Corps de la bougie */}
                    <rect
                      x={index * (100 / candlestickData.length) + 25 / candlestickData.length}
                      y={Math.min(entry.open, entry.close)}
                      width={50 / candlestickData.length}
                      height={Math.abs(entry.close - entry.open) || 1}
                      fill={color}
                    />
                  </g>
                )
              })}
            </LineChart>
          )}
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}

