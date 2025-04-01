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

// Liste des cryptomonnaies majeures sur Solana
const SOLANA_MAJOR_TOKENS = [
  {
    id: "solana",
    name: "Solana",
    symbol: "sol",
    contract_address: "So11111111111111111111111111111111111111112",
    blockchain: "solana",
    is_memecoin: false,
    market_cap: 60000000000,
    current_price: 150,
    platform: "Standard",
  },
  {
    id: "raydium",
    name: "Raydium",
    symbol: "ray",
    contract_address: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
    blockchain: "solana",
    is_memecoin: false,
    market_cap: 4500000000,
    current_price: 2.5,
    platform: "Standard",
  },
  {
    id: "bonk",
    name: "Bonk",
    symbol: "bonk",
    contract_address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    blockchain: "solana",
    is_memecoin: true,
    market_cap: 1200000000,
    current_price: 0.000012,
    platform: "Standard",
  },
  // ... autres tokens majeurs ...
]

// Liste des memecoins lowcap sur Solana (liste initiale)
const SOLANA_LOWCAPS_INITIAL = [
  {
    id: "bork",
    name: "Bork",
    symbol: "bork",
    contract_address: "BorkfDMz1qWXXtKmxnhKDgjkqMTQUaKlarNMzCjpXmG1",
    blockchain: "solana",
    is_memecoin: true,
    market_cap: 2500000,
    current_price: 0.000012,
    platform: "Standard",
  },
  {
    id: "slerf",
    name: "Slerf",
    symbol: "slerf",
    contract_address: "4LrnNvXD4ZzLQRcUQZE3ZzgQQDTza6r8rVLQxjV5XiYs",
    blockchain: "solana",
    is_memecoin: true,
    market_cap: 1800000,
    current_price: 0.000008,
    platform: "Standard",
  },
  // Coins de pump.fun
  {
    id: "fwog",
    name: "FWOG",
    symbol: "fwog",
    contract_address: "FWoGFvH7xrZ5VC5CtYu4K2X2iyWLxBarge1NQkr8NbYE",
    blockchain: "solana",
    is_memecoin: true,
    market_cap: 1250000,
    current_price: 0.0000052,
    platform: "pump.fun",
  },
  {
    id: "pepe-solana",
    name: "Pepe Solana",
    symbol: "pepes",
    contract_address: "6qAYEbDGBRNFhvMJPTGANrpN7VKGkZJkXvnJQhZ3sDNT",
    blockchain: "solana",
    is_memecoin: true,
    market_cap: 950000,
    current_price: 0.0000045,
    platform: "pump.fun",
  },
  {
    id: "wojak",
    name: "Wojak",
    symbol: "wojak",
    contract_address: "WojakcPkHtXTfqviECzBEWZiQZQA5sti4mxvmRXcfA9",
    blockchain: "solana",
    is_memecoin: true,
    market_cap: 1200000,
    current_price: 0.0000078,
    platform: "pump.fun",
  },
  {
    id: "frog",
    name: "Frog",
    symbol: "frog",
    contract_address: "FroG1gVhBWZxw6bPr7GNQo9D8YBK6NHkBNQfzfZ4YBzP",
    blockchain: "solana",
    is_memecoin: true,
    market_cap: 850000,
    current_price: 0.0000032,
    platform: "pump.fun",
  },
  {
    id: "dj-khaled",
    name: "DJ Khaled",
    symbol: "khaled",
    contract_address: "KhaLedLookatMeImRichandSuccessfuLLLLL111111",
    blockchain: "solana",
    is_memecoin: true,
    market_cap: 720000,
    current_price: 0.0000025,
    platform: "pump.fun",
  },
  {
    id: "pepecoin",
    name: "PepeCoin",
    symbol: "pepe",
    contract_address: "PEPEWDg3RZZt4pVgqwrK3NEJuAqJHBpGbZGPVNKNGS9",
    blockchain: "solana",
    is_memecoin: true,
    market_cap: 1500000,
    current_price: 0.0000065,
    platform: "pump.fun",
  },
  {
    id: "cat",
    name: "Cat",
    symbol: "cat",
    contract_address: "CATjwTxRiWUxUVdVMPiTcQHmGKLw4oCEUmGpP5kLzYAJ",
    blockchain: "solana",
    is_memecoin: true,
    market_cap: 980000,
    current_price: 0.0000038,
    platform: "pump.fun",
  },
  {
    id: "wif-pump",
    name: "WIF Pump",
    symbol: "wifp",
    contract_address: "WifPnZYkCYjqP1wUe7zMZmYQVKfpkXJKQVZYXH1zLyj",
    blockchain: "solana",
    is_memecoin: true,
    market_cap: 1100000,
    current_price: 0.0000042,
    platform: "pump.fun",
  },
  {
    id: "based",
    name: "Based",
    symbol: "based",
    contract_address: "BASEDxd5nCZYPfgG5KX2d82rJypYBnX9PkUXzqZnLDT",
    blockchain: "solana",
    is_memecoin: true,
    market_cap: 1350000,
    current_price: 0.0000055,
    platform: "pump.fun",
  },
  {
    id: "monkey",
    name: "Monkey",
    symbol: "monk",
    contract_address: "MoNKEYnJRqZpYsKrKmfB61pzVjrFkqjsHPEZqGTzA1C",
    blockchain: "solana",
    is_memecoin: true,
    market_cap: 890000,
    current_price: 0.0000029,
    platform: "pump.fun",
  },
  {
    id: "degen",
    name: "Degen",
    symbol: "degen",
    contract_address: "DeGenRXTRiCHXkYXZbKLf7GjgzFRbLRnGKqiiMEGNY9",
    blockchain: "solana",
    is_memecoin: true,
    market_cap: 1050000,
    current_price: 0.0000041,
    platform: "pump.fun",
  },
]

// Générer une liste plus complète de cryptomonnaies Solana (simulation)
const generateSolanaTokens = (count: number) => {
  const tokens = [...SOLANA_MAJOR_TOKENS, ...SOLANA_LOWCAPS_INITIAL]

  // Noms aléatoires pour les tokens Solana
  const prefixes = ["Sol", "S", "Luna", "Star", "Sun", "Moon", "Degen", "Ape", "Frog", "Meme"]
  const suffixes = ["Doge", "Cat", "Pepe", "Shib", "Floki", "Elon", "Moon", "Rocket", "Lambo", "Inu", "Coin", "Token"]

  for (let i = 0; i < count; i++) {
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)]
    const name = `${prefix}${suffix}`
    const symbol = name.substring(0, 4).toLowerCase()

    // Générer une adresse de contrat Solana aléatoire (format Base58)
    const contractAddress =
      Array.from({ length: 44 }, () => "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"[Math.floor(Math.random() * 58)]).join("")

    // Générer un prix aléatoire
    const price = Math.random() * 100

    // Générer une capitalisation aléatoire (entre 100K et 1B)
    const marketCap = price * (Math.random() * 990000000 + 100000)

    tokens.push({
      id: `${symbol}-${i}`,
      name,
      symbol,
      contract_address: contractAddress,
      blockchain: "solana",
      is_memecoin: Math.random() > 0.3, // 70% de chance d'être un memecoin
      market_cap: marketCap,
      current_price: price,
      platform: Math.random() > 0.7 ? "pump.fun" : "Standard", // 30% de chance d'être sur pump.fun
    })
  }

  return tokens
}

// Générer une liste complète de tokens Solana
const SOLANA_TOKENS = generateSolanaTokens(95) // 100 tokens au total

export function SolanaLowcap() {
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
  const [platformFilter, setPlatformFilter] = useState<"all" | "Standard" | "pump.fun">("all")
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
    const convertedTokens = SOLANA_TOKENS.map((crypto) => {
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

  // Effet pour appliquer les filtres lorsque les critères changent
  useEffect(() => {
    applyFilters()
  }, [sortBy, sortDirection, marketCapFilter, nameSearchTerm, platformFilter])

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
      // Recherche dans notre liste de lowcaps Solana
      const searchTermLower = searchTerm.toLowerCase()
      const foundInList = allTokens.find((crypto) => crypto.contract_address?.toLowerCase() === searchTermLower)

      if (foundInList) {
        setResults([foundInList])
        setSelectedCrypto(foundInList)
      } else {
        // Simuler une recherche sur l'API Solana (dans un cas réel, on utiliserait une API)
        // Attendre un peu pour simuler une requête réseau
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // 30% de chance de trouver un résultat aléatoire
        if (Math.random() > 0.7) {
          const randomName = `SOL${Math.random().toString(36).substring(2, 7).toUpperCase()}`
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
            blockchain: "solana",
            is_memecoin: Math.random() > 0.5,
            platform: "Standard",
          }

          setResults([randomCrypto])
          setSelectedCrypto(randomCrypto)
        } else {
          setResults([])
          setSelectedCrypto(null)
          toast({
            title: "No results found",
            description: "No cryptocurrency found with this contract address on Solana",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Error searching Solana contract:", error)
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
          <Select 
            value={marketCapFilter} 
            onValueChange={(value: "all" | "large" | "medium" | "small" | "micro" | "nano" | "pico") => setMarketCapFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Market Cap" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Market Caps</SelectItem>
              <SelectItem value="large">Large Cap (&gt;$1B)</SelectItem>
              <SelectItem value="medium">Medium Cap ($100M-$1B)</SelectItem>
              <SelectItem value="small">Small Cap ($10M-$100M)</SelectItem>
              <SelectItem value="micro">Micro Cap ($1M-$10M)</SelectItem>
              <SelectItem value="nano">Nano Cap ($100K-$1M)</SelectItem>
              <SelectItem value="pico">Pico Cap (&lt;$100K)</SelectItem>
            </SelectContent>
          </Select>
          <Select 
            value={platformFilter} 
            onValueChange={(value: "all" | "Standard" | "pump.fun") => setPlatformFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="Standard">Standard</SelectItem>
              <SelectItem value="pump.fun">pump.fun</SelectItem>
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
          <TabsTrigger value="browse">Browse All Lowcaps</TabsTrigger>
          <TabsTrigger value="search">Search by Contract</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentItems.map((crypto) => (
              <Card
                key={crypto.id}
                className="overflow-hidden border-purple-200 dark:border-purple-800 hover:shadow-md transition-shadow"
              >
                <CardHeader className="p-4 pb-2 bg-purple-100/50 dark:bg-purple-900/20">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center text-xs font-bold">
                        {crypto.symbol.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <CardTitle className="text-base">{crypto.name}</CardTitle>
                        <CardDescription className="text-xs uppercase">{crypto.symbol}</CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge
                        variant="outline"
                        className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
                      >
                        Solana
                      </Badge>
                      {crypto.platform === "pump.fun" && (
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        >
                          pump.fun
                        </Badge>
                      )}
                    </div>
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
                  <div className="mt-3 pt-3 border-t border-purple-100 dark:border-purple-900">
                    <div className="text-xs text-muted-foreground flex items-center justify-between">
                      <span className="truncate max-w-[180px]">{crypto.contract_address}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-purple-600 hover:text-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900"
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
            <div className="text-center p-8 bg-purple-50 dark:bg-purple-950 rounded-lg">
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
                placeholder="Enter Solana contract address..."
                className="pl-8 bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchByContract()}
              />
            </div>
            <Button
              onClick={searchByContract}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              disabled={loading}
            >
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
            <Card className="mt-6 border-purple-200 dark:border-purple-800">
              <CardHeader className="bg-purple-100/50 dark:bg-purple-900/20">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center text-sm font-bold">
                      {selectedCrypto.symbol.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <CardTitle>{selectedCrypto.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <span className="uppercase">{selectedCrypto.symbol}</span>
                        <Badge
                          variant="outline"
                          className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
                        >
                          Solana
                        </Badge>
                        {selectedCrypto.is_memecoin && (
                          <Badge
                            variant="outline"
                            className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                          >
                            Meme
                          </Badge>
                        )}
                        {selectedCrypto.platform === "pump.fun" && (
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          >
                            pump.fun
                          </Badge>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={`https://solscan.io/token/${selectedCrypto.contract_address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Solscan</span>
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
                        <span className="font-medium">Solana</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground">Contract Address</span>
                        <code className="text-xs bg-purple-50 dark:bg-purple-950 p-2 rounded break-all">
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

