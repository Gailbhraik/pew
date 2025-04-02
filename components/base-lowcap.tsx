"use client"

import { useState, useEffect } from "react"
import { Search, ExternalLink, RefreshCw, ArrowUpDown, TrendingUp, TrendingDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Crypto } from "@/components/crypto-tracker"

// Liste des cryptomonnaies majeures sur Base
const BASE_MAJOR_TOKENS = [
  {
    id: "base",
    name: "Base",
    symbol: "base",
    contract_address: "0x4200000000000000000000000000000000000006",
    blockchain: "base",
    is_memecoin: false,
    market_cap: 5000000000,
    current_price: 0.5,
    platform: "Standard",
  },
  {
    id: "friend-tech",
    name: "Friend.tech",
    symbol: "friend",
    contract_address: "0xcf205808ed36593aa40a44f10c7f7a2e0216041e",
    blockchain: "base",
    is_memecoin: false,
    market_cap: 2500000000,
    current_price: 2.5,
    platform: "Standard",
  },
  {
    id: "meme",
    name: "Meme",
    symbol: "meme",
    contract_address: "0xb131f4a55907b10d1f0a50d8ab8f09d342a94685",
    blockchain: "base",
    is_memecoin: true,
    market_cap: 1800000000,
    current_price: 0.000018,
    platform: "Standard",
  },
]

// Liste des memecoins lowcap sur Base (liste initiale)
const BASE_LOWCAPS_INITIAL: Crypto[] = [
  {
    id: "based-doge",
    name: "Based Doge",
    symbol: "bdoge",
    contract_address: "0x8226f8a374ea7d4b87d4c18ba9d191f2dc8caac8",
    blockchain: "base",
    is_memecoin: true,
    market_cap: 3200000,
    current_price: 0.000018,
    image: "/placeholder.svg?height=50&width=50&text=BDOGE",
    market_cap_rank: 1000,
    fully_diluted_valuation: 6400000,
    total_volume: 640000,
    high_24h: 0.000022,
    low_24h: 0.000015,
    price_change_24h: 0.000002,
    price_change_percentage_24h: 12.5,
    market_cap_change_24h: 320000,
    market_cap_change_percentage_24h: 10,
    circulating_supply: 177777777777,
    total_supply: 177777777777,
    max_supply: 177777777777,
    ath: 0.000025,
    ath_change_percentage: -28,
    ath_date: "2024-03-15T00:00:00.000Z",
    atl: 0.000005,
    atl_change_percentage: 260,
    atl_date: "2024-02-15T00:00:00.000Z",
    last_updated: new Date().toISOString(),
  },
  {
    id: "basenji",
    name: "Basenji",
    symbol: "basenji",
    contract_address: "0x3170d9b9597d0aa9a5a5d0b7f5edc4b667f8a5d3",
    blockchain: "base",
    is_memecoin: true,
    market_cap: 2100000,
    current_price: 0.000009,
    image: "/placeholder.svg?height=50&width=50&text=BASENJI",
    market_cap_rank: 1200,
    fully_diluted_valuation: 4200000,
    total_volume: 420000,
    high_24h: 0.000011,
    low_24h: 0.000008,
    price_change_24h: 0.000001,
    price_change_percentage_24h: 11.1,
    market_cap_change_24h: 210000,
    market_cap_change_percentage_24h: 10,
    circulating_supply: 233333333333,
    total_supply: 233333333333,
    max_supply: 233333333333,
    ath: 0.000015,
    ath_change_percentage: -40,
    ath_date: "2024-03-15T00:00:00.000Z",
    atl: 0.000003,
    atl_change_percentage: 200,
    atl_date: "2024-02-15T00:00:00.000Z",
    last_updated: new Date().toISOString(),
  },
  {
    id: "based-pepe",
    name: "Based Pepe",
    symbol: "bpepe",
    contract_address: "0x8c2a3a1f6b1c1e6817e0a1c5e8a8ec4b67f4e0b9",
    blockchain: "base",
    is_memecoin: true,
    market_cap: 4500000,
    current_price: 0.000025,
    image: "/placeholder.svg?height=50&width=50&text=BPEPE",
    market_cap_rank: 800,
    fully_diluted_valuation: 9000000,
    total_volume: 900000,
    high_24h: 0.000030,
    low_24h: 0.000020,
    price_change_24h: 0.000003,
    price_change_percentage_24h: 12,
    market_cap_change_24h: 450000,
    market_cap_change_percentage_24h: 10,
    circulating_supply: 180000000000,
    total_supply: 180000000000,
    max_supply: 180000000000,
    ath: 0.000035,
    ath_change_percentage: -28.6,
    ath_date: "2024-03-15T00:00:00.000Z",
    atl: 0.000008,
    atl_change_percentage: 212.5,
    atl_date: "2024-02-15T00:00:00.000Z",
    last_updated: new Date().toISOString(),
  },
  {
    id: "base-dawgz",
    name: "Base Dawgz",
    symbol: "dawgz",
    contract_address: "0x4a2b4f0e4b8c3e88d1d0a5eb0b1c3d4e5f6a7b8c",
    blockchain: "base",
    is_memecoin: true,
    market_cap: 1800000,
    current_price: 0.000007,
    image: "/placeholder.svg?height=50&width=50&text=DAWGZ",
    market_cap_rank: 1500,
    fully_diluted_valuation: 3600000,
    total_volume: 360000,
    high_24h: 0.000009,
    low_24h: 0.000006,
    price_change_24h: 0.000001,
    price_change_percentage_24h: 14.3,
    market_cap_change_24h: 180000,
    market_cap_change_percentage_24h: 10,
    circulating_supply: 257142857142,
    total_supply: 257142857142,
    max_supply: 257142857142,
    ath: 0.000012,
    ath_change_percentage: -41.7,
    ath_date: "2024-03-15T00:00:00.000Z",
    atl: 0.000002,
    atl_change_percentage: 250,
    atl_date: "2024-02-15T00:00:00.000Z",
    last_updated: new Date().toISOString(),
  },
  {
    id: "base-chad",
    name: "Base Chad",
    symbol: "chad",
    contract_address: "0x9d8e7a6c2e5f8b9c1d2e3f4a5b6c7d8e9f0a1b2c",
    blockchain: "base",
    is_memecoin: true,
    market_cap: 3900000,
    current_price: 0.000021,
    image: "/placeholder.svg?height=50&width=50&text=CHAD",
    market_cap_rank: 900,
    fully_diluted_valuation: 7800000,
    total_volume: 780000,
    high_24h: 0.000025,
    low_24h: 0.000018,
    price_change_24h: 0.000002,
    price_change_percentage_24h: 9.5,
    market_cap_change_24h: 390000,
    market_cap_change_percentage_24h: 10,
    circulating_supply: 185714285714,
    total_supply: 185714285714,
    max_supply: 185714285714,
    ath: 0.000030,
    ath_change_percentage: -30,
    ath_date: "2024-03-15T00:00:00.000Z",
    atl: 0.000006,
    atl_change_percentage: 250,
    atl_date: "2024-02-15T00:00:00.000Z",
    last_updated: new Date().toISOString(),
  },
]

// Générer une liste plus complète de cryptomonnaies Base (simulation)
const generateBaseTokens = (count: number) => {
  const tokens = [...BASE_MAJOR_TOKENS, ...BASE_LOWCAPS_INITIAL]

  // Noms aléatoires pour les tokens Base
  const prefixes = ["Base", "B", "Eth", "Optimism", "Layer", "Coin", "Degen", "Ape", "Frog", "Meme"]
  const suffixes = ["Doge", "Cat", "Pepe", "Shib", "Floki", "Elon", "Moon", "Rocket", "Lambo", "Inu", "Coin", "Token"]

  for (let i = 0; i < count; i++) {
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)]
    const name = `${prefix}${suffix}`
    const symbol = name.substring(0, 4).toLowerCase()

    // Générer une adresse de contrat Base aléatoire (format Ethereum)
    const contractAddress =
      "0x" + Array.from({ length: 40 }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("")

    // Générer un prix aléatoire
    const price = Math.random() * 100

    // Générer une capitalisation aléatoire (entre 100K et 1B)
    const marketCap = price * (Math.random() * 990000000 + 100000)

    tokens.push({
      id: `${symbol}-${i}`,
      name,
      symbol,
      contract_address: contractAddress,
      blockchain: "base",
      is_memecoin: Math.random() > 0.3, // 70% de chance d'être un memecoin
      market_cap: marketCap,
      current_price: price,
      platform: "Standard",
    })
  }

  return tokens
}

// Générer une liste complète de tokens Base
const BASE_TOKENS = generateBaseTokens(95) // 100 tokens au total

export function BaseLowcap() {
  const [searchTerm, setSearchTerm] = useState("")
  const [nameSearchTerm, setNameSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Crypto[]>([])
  const [allTokens, setAllTokens] = useState<Crypto[]>([])
  const [filteredTokens, setFilteredTokens] = useState<Crypto[]>([])
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState<"market_cap" | "price" | "name">("market_cap")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [marketCapFilter, setMarketCapFilter] = useState<"all" | "large" | "medium" | "small" | "micro" | "nano" | "pico">("all")
  const [platformFilter, setPlatformFilter] = useState<"all" | "Standard">("all")
  const [activeTab, setActiveTab] = useState<"browse" | "search">("browse")
  const { toast } = useToast()

  const itemsPerPage = 12

  const ONE_BILLION = 1000000000
  const ONE_HUNDRED_MILLION = 100000000
  const TEN_MILLION = 10000000
  const ONE_MILLION = 1000000
  const ONE_HUNDRED_THOUSAND = 100000

  // Convertir les tokens en objets Crypto complets
  useEffect(() => {
    const convertedTokens = BASE_TOKENS.map((crypto) => {
      return {
        ...crypto,
        id: crypto.id,
        image: `/placeholder.svg?height=50&width=50&text=${crypto.symbol.toUpperCase()}`,
        market_cap_rank: Math.floor(Math.random() * 2000) + 1,
        fully_diluted_valuation: crypto.market_cap * 2,
        total_volume: crypto.market_cap * 0.2,
        high_24h: crypto.current_price * 1.2,
        low_24h: crypto.current_price * 0.8,
        price_change_24h: (Math.random() - 0.5) * crypto.current_price * 0.1,
        price_change_percentage_24h: (Math.random() - 0.5) * 15,
        market_cap_change_24h: (Math.random() - 0.5) * crypto.market_cap * 0.05,
        market_cap_change_percentage_24h: (Math.random() - 0.5) * 5,
        circulating_supply: crypto.market_cap / crypto.current_price,
        total_supply: (crypto.market_cap / crypto.current_price) * 1.5,
        max_supply: (crypto.market_cap / crypto.current_price) * 2,
        ath: crypto.current_price * 2,
        ath_change_percentage: -30,
        ath_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        atl: crypto.current_price * 0.5,
        atl_change_percentage: 100,
        atl_date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
        last_updated: new Date().toISOString(),
        platform: crypto.platform,
      } as Crypto
    })

    setAllTokens(convertedTokens)
    applyFilters(convertedTokens)
  }, [])

  // Appliquer les filtres et le tri
  const applyFilters = (cryptos = allTokens) => {
    let filtered = [...cryptos]

    // Filtre par capitalisation
    if (marketCapFilter !== "all") {
      filtered = filtered.filter((crypto) => {
        switch (marketCapFilter) {
          case "large":
            return crypto.market_cap >= ONE_BILLION
          case "medium":
            return crypto.market_cap >= ONE_HUNDRED_MILLION && crypto.market_cap < ONE_BILLION
          case "small":
            return crypto.market_cap >= TEN_MILLION && crypto.market_cap < ONE_HUNDRED_MILLION
          case "micro":
            return crypto.market_cap >= ONE_MILLION && crypto.market_cap < TEN_MILLION
          case "nano":
            return crypto.market_cap >= ONE_HUNDRED_THOUSAND && crypto.market_cap < ONE_MILLION
          case "pico":
            return crypto.market_cap < ONE_HUNDRED_THOUSAND
          default:
            return true
        }
      })
    }

    // Filtre par plateforme
    if (platformFilter !== "all") {
      filtered = filtered.filter((crypto) => crypto.platform === platformFilter)
    }

    // Filtre par nom/symbole
    if (nameSearchTerm) {
      const term = nameSearchTerm.toLowerCase()
      filtered = filtered.filter(
        (crypto) => crypto.name.toLowerCase().includes(term) || crypto.symbol.toLowerCase().includes(term),
      )
    }

    // Tri
    filtered.sort((a, b) => {
      if (sortBy === "market_cap") {
        return sortDirection === "desc" ? b.market_cap - a.market_cap : a.market_cap - b.market_cap
      }
      if (sortBy === "price") {
        return sortDirection === "desc" ? b.current_price - a.current_price : a.current_price - b.current_price
      }
      // Tri par nom
      const nameA = a.name.toLowerCase()
      const nameB = b.name.toLowerCase()
      return sortDirection === "desc" ? nameB.localeCompare(nameA) : nameA.localeCompare(nameB)
    })

    setFilteredTokens(filtered)
    setCurrentPage(1) // Réinitialiser à la première page après filtrage
  }

  // Recherche par adresse de contrat
  const searchByContract = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Error",
        description: "Please enter a contract address",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Recherche dans notre liste de tokens Base
      const searchTermLower = searchTerm.toLowerCase()
      const foundInList = allTokens.find((crypto) => crypto.contract_address?.toLowerCase() === searchTermLower)

      if (foundInList) {
        setResults([foundInList])
        setSelectedCrypto(foundInList)
      } else {
        // Simuler une recherche sur l'API Base (dans un cas réel, on utiliserait une API)
        // Attendre un peu pour simuler une requête réseau
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // 30% de chance de trouver un résultat aléatoire
        if (Math.random() > 0.7) {
          const randomName = `BASE${Math.random().toString(36).substring(2, 7).toUpperCase()}`
          const randomPrice = Math.random() * 0.0001

          const randomCrypto: Crypto = {
            id: randomName.toLowerCase(),
            name: randomName,
            symbol: randomName.toLowerCase(),
            image: `/placeholder.svg?height=50&width=50&text=${randomName}`,
            current_price: randomPrice,
            market_cap: randomPrice * Math.random() * 10000000,
            market_cap_rank: Math.floor(Math.random() * 2000) + 1000,
            fully_diluted_valuation: randomPrice * Math.random() * 20000000,
            total_volume: randomPrice * Math.random() * 2000000,
            high_24h: randomPrice * 1.2,
            low_24h: randomPrice * 0.8,
            price_change_24h: (Math.random() - 0.5) * randomPrice * 0.1,
            price_change_percentage_24h: (Math.random() - 0.5) * 15,
            market_cap_change_24h: (Math.random() - 0.5) * 100000,
            market_cap_change_percentage_24h: (Math.random() - 0.5) * 5,
            circulating_supply: Math.random() * 1000000000,
            total_supply: Math.random() * 1500000000,
            max_supply: Math.random() * 2000000000,
            ath: randomPrice * 2,
            ath_change_percentage: -30,
            ath_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            atl: randomPrice * 0.5,
            atl_change_percentage: 100,
            atl_date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
            last_updated: new Date().toISOString(),
            contract_address: searchTerm,
            blockchain: "base",
            is_memecoin: Math.random() > 0.5,
          }

          setResults([randomCrypto])
          setSelectedCrypto(randomCrypto)
        } else {
          setResults([])
          setSelectedCrypto(null)
          toast({
            title: "No results found",
            description: "No cryptocurrency found with this contract address on Base",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Error searching Base contract:", error)
      toast({
        title: "Error",
        description: "Failed to search for the contract. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    if (price < 0.00001) return price.toExponential(4)
    return price.toLocaleString(undefined, { maximumFractionDigits: 8 })
  }

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1000000) return `$${(marketCap / 1000000).toFixed(2)}M`
    if (marketCap >= 1000) return `$${(marketCap / 1000).toFixed(2)}K`
    return `$${marketCap.toFixed(2)}`
  }

  // Pagination
  const totalPages = Math.ceil(filteredTokens.length / itemsPerPage)
  const currentItems = filteredTokens.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const goToPage = (page: number) => {
    if (page < 1) page = 1
    if (page > totalPages) page = totalPages
    setCurrentPage(page)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by name or symbol..."
            value={nameSearchTerm}
            onChange={(e) => setNameSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <Select value={marketCapFilter} onValueChange={(value: "small" | "all" | "large" | "medium" | "micro" | "nano" | "pico") => setMarketCapFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Market Cap" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Market Caps</SelectItem>
              <SelectItem value="large">Large Cap ($1B)</SelectItem>
              <SelectItem value="medium">Medium Cap ($100M-$1B)</SelectItem>
              <SelectItem value="small">Small Cap ($10M-$100M)</SelectItem>
              <SelectItem value="micro">Micro Cap ($1M-$10M)</SelectItem>
              <SelectItem value="nano">Nano Cap ($100K-$1M)</SelectItem>
              <SelectItem value="pico">Pico Cap ($100K)</SelectItem>
            </SelectContent>
          </Select>
          <Select value={platformFilter} onValueChange={(value: "all" | "Standard") => setPlatformFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="Standard">Standard</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}>
            <ArrowUpDown className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Sort by: {sortBy === "market_cap" ? "Market Cap" : sortBy === "price" ? "Price" : "Name"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy("market_cap")}>Market Cap</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("price")}>Price</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("name")}>Name</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs
        defaultValue="browse"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "browse" | "search")}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse">Browse All Tokens</TabsTrigger>
          <TabsTrigger value="search">Search by Contract</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentItems.map((crypto) => (
              <Card
                key={crypto.id}
                className="overflow-hidden border-blue-200 dark:border-blue-800 hover:shadow-md transition-shadow"
              >
                <CardHeader className="p-4 pb-2 bg-blue-100/50 dark:bg-blue-900/20">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-200 dark:bg-blue-800 rounded-full flex items-center justify-center text-xs font-bold">
                        {crypto.symbol ? crypto.symbol.substring(0, 2).toUpperCase() : ""}
                      </div>
                      <div>
                        <CardTitle className="text-base">{crypto.name}</CardTitle>
                        <CardDescription className="text-xs uppercase">{crypto.symbol}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                      Base
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-sm">
                      <div className="text-muted-foreground text-xs">Price</div>
                      <div className="font-medium">${formatPrice(crypto.current_price)}</div>
                    </div>
                    <div className="text-sm text-right">
                      <div className="text-muted-foreground text-xs">Market Cap</div>
                      <div className="font-medium">{formatMarketCap(crypto.market_cap)}</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-sm">
                      <div className="text-muted-foreground text-xs">24h</div>
                      <div
                        className={`font-medium flex items-center ${crypto.price_change_percentage_24h >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {crypto.price_change_percentage_24h >= 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {crypto.price_change_percentage_24h >= 0 ? "+" : ""}
                        {crypto.price_change_percentage_24h.toFixed(2)}%
                      </div>
                    </div>
                    {crypto.is_memecoin && (
                      <Badge
                        variant="outline"
                        className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                      >
                        Meme
                      </Badge>
                    )}
                  </div>
                  <div className="mt-3 pt-3 border-t border-blue-100 dark:border-blue-900">
                    <div className="text-xs text-muted-foreground flex items-center justify-between">
                      <span className="truncate max-w-[180px]">{crypto.contract_address}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-blue-600 hover:text-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900"
                        onClick={() => {
                          setSearchTerm(crypto.contract_address || "")
                          setSelectedCrypto(crypto)
                          setActiveTab("search")
                        }}
                      >
                        <Search className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="text-sm">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {filteredTokens.length === 0 && !loading && (
            <div className="text-center p-8 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <p>No cryptocurrencies found matching your criteria.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="search" className="space-y-4 mt-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter Base contract address..."
                className="pl-8 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchByContract()}
              />
            </div>
            <Button onClick={searchByContract} className="bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Search"}
            </Button>
          </div>

          {loading && (
            <div className="space-y-4 mt-6">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-20 w-full" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
            </div>
          )}

          {selectedCrypto && !loading && (
            <Card className="mt-6 border-blue-200 dark:border-blue-800">
              <CardHeader className="bg-blue-100/50 dark:bg-blue-900/20">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-200 dark:bg-blue-800 rounded-full flex items-center justify-center text-sm font-bold">
                      {selectedCrypto.symbol.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <CardTitle>{selectedCrypto.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <span className="uppercase">{selectedCrypto.symbol}</span>
                        <Badge
                          variant="outline"
                          className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                        >
                          Base
                        </Badge>
                        {selectedCrypto.is_memecoin && (
                          <Badge
                            variant="outline"
                            className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                          >
                            Meme
                          </Badge>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={`https://basescan.org/token/${selectedCrypto.contract_address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Basescan</span>
                    </a>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Token Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price</span>
                        <span className="font-medium">${formatPrice(selectedCrypto.current_price)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Market Cap</span>
                        <span className="font-medium">${selectedCrypto.market_cap.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">24h Change</span>
                        <span
                          className={`font-medium ${selectedCrypto.price_change_percentage_24h >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {selectedCrypto.price_change_percentage_24h >= 0 ? "+" : ""}
                          {selectedCrypto.price_change_percentage_24h.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">24h Volume</span>
                        <span className="font-medium">${selectedCrypto.total_volume.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Contract Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Blockchain</span>
                        <span className="font-medium">Base</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground">Contract Address</span>
                        <code className="text-xs bg-blue-50 dark:bg-blue-950 p-2 rounded break-all">
                          {selectedCrypto.contract_address}
                        </code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Updated</span>
                        <span className="font-medium">{new Date(selectedCrypto.last_updated).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

