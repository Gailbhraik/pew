"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SolanaLowcap } from "@/components/solana-lowcap"
import { BaseLowcap } from "@/components/base-lowcap"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserAuth } from "@/components/user-auth"
import { LocalTime } from "@/components/local-time"
import { ParticleLogo } from "@/components/particle-logo"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { Crypto } from "@/components/crypto-tracker"
import { Skeleton } from "@/components/ui/skeleton"
import { CryptoConverter } from "@/components/crypto-converter"

export function LowcapExplorer() {
  const [activeTab, setActiveTab] = useState("solana")
  const [allCryptos, setAllCryptos] = useState<Crypto[]>([])
  const [loading, setLoading] = useState(true)

  // Simuler le chargement de quelques cryptos pour le graphique
  useEffect(() => {
    const fetchSomeCryptos = async () => {
      setLoading(true)
      try {
        // Dans un cas réel, on ferait un appel API ici
        // Pour la démo, on génère des données fictives
        const mockCryptos: Crypto[] = [
          {
            id: "bitcoin",
            name: "Bitcoin",
            symbol: "btc",
            image: "/placeholder.svg?height=50&width=50&text=BTC",
            current_price: 60000 + Math.random() * 5000,
            market_cap: 1000000000000,
            market_cap_rank: 1,
            fully_diluted_valuation: 1200000000000,
            total_volume: 50000000000,
            high_24h: 62000,
            low_24h: 59000,
            price_change_24h: 1500,
            price_change_percentage_24h: 2.5,
            market_cap_change_24h: 25000000000,
            market_cap_change_percentage_24h: 2.5,
            circulating_supply: 19000000,
            total_supply: 21000000,
            max_supply: 21000000,
            ath: 69000,
            ath_change_percentage: -10,
            ath_date: "2021-11-10T00:00:00.000Z",
            atl: 67,
            atl_change_percentage: 90000,
            atl_date: "2013-07-06T00:00:00.000Z",
            last_updated: new Date().toISOString(),
            blockchain: "bitcoin",
          },
          {
            id: "ethereum",
            name: "Ethereum",
            symbol: "eth",
            image: "/placeholder.svg?height=50&width=50&text=ETH",
            current_price: 3000 + Math.random() * 300,
            market_cap: 350000000000,
            market_cap_rank: 2,
            fully_diluted_valuation: 350000000000,
            total_volume: 20000000000,
            high_24h: 3100,
            low_24h: 2950,
            price_change_24h: 50,
            price_change_percentage_24h: 1.7,
            market_cap_change_24h: 5000000000,
            market_cap_change_percentage_24h: 1.7,
            circulating_supply: 120000000,
            total_supply: 120000000,
            max_supply: null,
            ath: 4800,
            ath_change_percentage: -35,
            ath_date: "2021-11-10T00:00:00.000Z",
            atl: 0.4,
            atl_change_percentage: 750000,
            atl_date: "2015-10-20T00:00:00.000Z",
            last_updated: new Date().toISOString(),
            blockchain: "ethereum",
          },
          {
            id: "solana",
            name: "Solana",
            symbol: "sol",
            image: "/placeholder.svg?height=50&width=50&text=SOL",
            current_price: 150 + Math.random() * 20,
            market_cap: 60000000000,
            market_cap_rank: 5,
            fully_diluted_valuation: 80000000000,
            total_volume: 5000000000,
            high_24h: 160,
            low_24h: 145,
            price_change_24h: 8,
            price_change_percentage_24h: 5.3,
            market_cap_change_24h: 3000000000,
            market_cap_change_percentage_24h: 5.3,
            circulating_supply: 400000000,
            total_supply: 500000000,
            max_supply: 500000000,
            ath: 260,
            ath_change_percentage: -40,
            ath_date: "2021-11-06T00:00:00.000Z",
            atl: 0.5,
            atl_change_percentage: 30000,
            atl_date: "2020-05-11T00:00:00.000Z",
            last_updated: new Date().toISOString(),
            blockchain: "solana",
          },
          {
            id: "dogwifhat",
            name: "Dogwifhat",
            symbol: "wif",
            image: "/placeholder.svg?height=50&width=50&text=WIF",
            current_price: 2.5 + Math.random() * 0.5,
            market_cap: 2500000000,
            market_cap_rank: 30,
            fully_diluted_valuation: 3000000000,
            total_volume: 500000000,
            high_24h: 2.7,
            low_24h: 2.3,
            price_change_24h: 0.2,
            price_change_percentage_24h: 8.5,
            market_cap_change_24h: 200000000,
            market_cap_change_percentage_24h: 8.5,
            circulating_supply: 1000000000,
            total_supply: 1200000000,
            max_supply: 1200000000,
            ath: 4.5,
            ath_change_percentage: -45,
            ath_date: "2023-12-15T00:00:00.000Z",
            atl: 0.01,
            atl_change_percentage: 25000,
            atl_date: "2023-10-01T00:00:00.000Z",
            last_updated: new Date().toISOString(),
            blockchain: "solana",
            is_memecoin: true,
          },
          {
            id: "fwog",
            name: "FWOG",
            symbol: "fwog",
            image: "/placeholder.svg?height=50&width=50&text=FWOG",
            current_price: 0.0000052 + Math.random() * 0.0000005,
            market_cap: 1250000,
            market_cap_rank: 1500,
            fully_diluted_valuation: 1500000,
            total_volume: 250000,
            high_24h: 0.0000057,
            low_24h: 0.0000048,
            price_change_24h: 0.0000003,
            price_change_percentage_24h: 6.2,
            market_cap_change_24h: 75000,
            market_cap_change_percentage_24h: 6.2,
            circulating_supply: 240000000000,
            total_supply: 300000000000,
            max_supply: 300000000000,
            ath: 0.000008,
            ath_change_percentage: -35,
            ath_date: "2024-03-15T00:00:00.000Z",
            atl: 0.0000001,
            atl_change_percentage: 5100,
            atl_date: "2024-02-01T00:00:00.000Z",
            last_updated: new Date().toISOString(),
            blockchain: "solana",
            is_memecoin: true,
            contract_address: "FWoGFvH7xrZ5VC5CtYu4K2X2iyWLxBarge1NQkr8NbYE",
            platform: "pump.fun",
          },
        ]

        setAllCryptos(mockCryptos)
      } catch (error) {
        console.error("Error fetching crypto data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSomeCryptos()
  }, [])

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <ParticleLogo />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Saperlipocrypto Lowcap Explorer</h1>
            <p className="text-muted-foreground mt-1">Discover low market cap gems on Solana and Base</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LocalTime />
          <ThemeToggle />
          <UserAuth />
          <Link
            href="/"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tracker
          </Link>
        </div>
      </header>

      {/* Section de convertisseur de crypto */}
      <div className="mb-8">
        {loading ? <Skeleton className="h-[400px] w-full" /> : <CryptoConverter cryptos={allCryptos} />}
      </div>

      <div className="space-y-6">
        <Tabs defaultValue="solana" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="solana"
              className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900 dark:data-[state=active]:bg-purple-900 dark:data-[state=active]:text-purple-100"
            >
              Solana Lowcaps
            </TabsTrigger>
            <TabsTrigger
              value="base"
              className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900 dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-blue-100"
            >
              Base Lowcaps
            </TabsTrigger>
          </TabsList>
          <TabsContent value="solana" className="mt-6">
            <SolanaLowcap />
          </TabsContent>
          <TabsContent value="base" className="mt-6">
            <BaseLowcap />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

