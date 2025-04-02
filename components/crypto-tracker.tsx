"use client"

import { useState, useEffect } from "react"
import { Search, Star, RefreshCw, TrendingUp } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CryptoCard from "@/components/crypto-card"
import CryptoDetail from "@/components/crypto-detail"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserAuth } from "@/components/user-auth"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { LocalTime } from "@/components/local-time"
import { ParticleLogo } from "@/components/particle-logo"
import Link from "next/link"
import { CryptoConverter } from "@/components/crypto-converter"
import TradingView from "@/components/trading-view"

export type Crypto = {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  fully_diluted_valuation: number
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  circulating_supply: number
  total_supply: number
  max_supply: number
  ath: number
  ath_change_percentage: number
  ath_date: string
  atl: number
  atl_change_percentage: number
  atl_date: string
  last_updated: string
  contract_address?: string
  blockchain?: string
  is_memecoin?: boolean
  platform?: string
}

// Liste des memecoins populaires sur Solana
const SOLANA_MEMECOINS = [
  {
    id: "bonk",
    name: "Bonk",
    symbol: "bonk",
    contract_address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    blockchain: "solana",
    is_memecoin: true,
  },
  {
    id: "dogwifhat",
    name: "dogwifhat",
    symbol: "wif",
    contract_address: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
    blockchain: "solana",
    is_memecoin: true,
  },
  {
    id: "popcat",
    name: "Popcat",
    symbol: "popcat",
    contract_address: "5WsdTXZaGQdUJNVXcwkJvGv9Jej3Zs3r3tnqQz6aRjPD",
    blockchain: "solana",
    is_memecoin: true,
  },
  {
    id: "book-of-meme",
    name: "Book of Meme",
    symbol: "bome",
    contract_address: "Aj1VGZzpR7uGgcYA3jALR92KJnFuGWYTQNbzAyMvFU9Q",
    blockchain: "solana",
    is_memecoin: true,
  },
  {
    id: "slothana",
    name: "Slothana",
    symbol: "sloth",
    contract_address: "SLTHjcoPufAjL7NgDn8xJJYRgG18xUyqD5EAc7j3GDo",
    blockchain: "solana",
    is_memecoin: true,
  },
  {
    id: "mog-coin",
    name: "MOG Coin",
    symbol: "mog",
    contract_address: "7Xn4mGsEXmMnJcLaEYTvgLH6b8JRUAcxcGx63tgMpvpT",
    blockchain: "solana",
    is_memecoin: true,
  },
  {
    id: "goat",
    name: "GOAT",
    symbol: "goat",
    contract_address: "3QTXTvswHXXM5Z9PMdrCvQVXXrBGEPspYxBCvXwYP5nJ",
    blockchain: "solana",
    is_memecoin: true,
  },
  {
    id: "cat-in-a-dogs-world",
    name: "Cat in a Dogs World",
    symbol: "caw",
    contract_address: "H7HGtiLh2gDBTaHRKTQyFXpBFwZW6Mnw57JTXcmjBHLo",
    blockchain: "solana",
    is_memecoin: true,
  },
  {
    id: "jup",
    name: "Jupiter",
    symbol: "jup",
    contract_address: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
    blockchain: "solana",
    is_memecoin: false,
  },
]

export default function CryptoTracker() {
  const [cryptos, setCryptos] = useState<Crypto[]>([])
  const [solanaCryptos, setSolanaCryptos] = useState<Crypto[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null)
  const [localFavorites, setLocalFavorites] = useLocalStorage<string[]>("crypto-favorites", [])
  const [contractSearch, setContractSearch] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [blockchainFilter, setBlockchainFilter] = useState("all")
  const [showMemecoinsOnly, setShowMemecoinsOnly] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [activeDetailTab, setActiveDetailTab] = useState<string>("tradingview")

  const { user, isAuthenticated, updateFavorites } = useAuth()
  const { toast } = useToast()

  // Utiliser les favoris du compte utilisateur s'il est connecté, sinon utiliser les favoris locaux
  const favorites = isAuthenticated && user ? user.favorites : localFavorites

  useEffect(() => {
    fetchCryptos()
    fetchSolanaCryptos()
  }, [])

  const fetchCryptos = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en",
      )
      const data = await response.json()

      // Ajouter la propriété blockchain pour les cryptos standard
      const processedData = data.map((crypto: any) => ({
        ...crypto,
        blockchain: "ethereum", // Par défaut, on considère que ce sont des tokens Ethereum
        is_memecoin: isMemeToken(crypto.id, crypto.name, crypto.symbol),
      }))

      setCryptos(processedData)
    } catch (error) {
      console.error("Error fetching crypto data:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSolanaCryptos = async () => {
    // Dans un cas réel, on utiliserait une API pour récupérer les données
    // Ici, on utilise des données statiques pour les memecoins Solana
    try {
      // Simuler une requête API
      const solanaMemecoinsWithPrices = await Promise.all(
        SOLANA_MEMECOINS.map(async (memecoin) => {
          // Dans un cas réel, on récupérerait les prix depuis une API
          // Ici, on génère des prix aléatoires pour la démo
          const randomPrice =
            Math.random() *
            (memecoin.id === "bonk" ? 0.00001 : memecoin.id === "dogwifhat" ? 1.5 : memecoin.id === "jup" ? 8 : 0.01)

          return {
            ...memecoin,
            image: `/placeholder.svg?height=50&width=50&text=${memecoin.symbol.toUpperCase()}`,
            current_price: randomPrice,
            market_cap: randomPrice * 1000000000,
            market_cap_rank: Math.floor(Math.random() * 500) + 1,
            fully_diluted_valuation: randomPrice * 2000000000,
            total_volume: randomPrice * 500000000,
            high_24h: randomPrice * 1.1,
            low_24h: randomPrice * 0.9,
            price_change_24h: (Math.random() - 0.5) * randomPrice * 0.2,
            price_change_percentage_24h: (Math.random() - 0.5) * 20,
            market_cap_change_24h: (Math.random() - 0.5) * 1000000,
            market_cap_change_percentage_24h: (Math.random() - 0.5) * 10,
            circulating_supply: Math.random() * 1000000000000,
            total_supply: Math.random() * 2000000000000,
            max_supply: Math.random() * 3000000000000,
            ath: randomPrice * 2,
            ath_change_percentage: -30,
            ath_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            atl: randomPrice * 0.5,
            atl_change_percentage: 100,
            atl_date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
            last_updated: new Date().toISOString(),
          } as Crypto
        }),
      )

      setSolanaCryptos(solanaMemecoinsWithPrices)
    } catch (error) {
      console.error("Error fetching Solana memecoins:", error)
    }
  }

  // Fonction pour déterminer si un token est un memecoin
  const isMemeToken = (id: string, name: string, symbol: string) => {
    const memeKeywords = [
      "doge",
      "shib",
      "pepe",
      "meme",
      "inu",
      "floki",
      "elon",
      "moon",
      "safe",
      "cum",
      "chad",
      "wojak",
      "cat",
    ]
    return memeKeywords.some(
      (keyword: string) =>
        id.toLowerCase().includes(keyword) ||
        name.toLowerCase().includes(keyword) ||
        symbol.toLowerCase().includes(keyword),
    )
  }

  const searchCryptoByContract = async () => {
    // Réinitialiser l'erreur de recherche
    setSearchError(null)

    // Vérifier si contractSearch est vide ou undefined
    if (!contractSearch || contractSearch.trim() === "") {
      setSearchError("Please enter a contract address")
      return
    }

    setLoading(true)

    try {
      // Convertir en minuscules une seule fois et stocker dans une variable
      const searchTermLower = contractSearch.toLowerCase()

      // Vérifier d'abord dans les memecoins Solana
      const solanaCoin = solanaCryptos.find((crypto) => {
        // Vérifier si contract_address existe avant d'appeler toLowerCase()
        if (!crypto.contract_address) return false
        return crypto.contract_address.toLowerCase() === searchTermLower
      })

      if (solanaCoin) {
        setSelectedCrypto(solanaCoin)
        setLoading(false)
        return
      }

      // Sinon, chercher dans l'API Ethereum
      try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${searchTermLower}`)

        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}`)
        }

        const data = await response.json()

        if (data && data.id) {
          setSelectedCrypto({
            ...data,
            blockchain: "ethereum",
            is_memecoin: isMemeToken(data.id, data.name, data.symbol),
          })
        } else {
          setSearchError("No cryptocurrency found with this contract address")
        }
      } catch (apiError) {
        console.error("API Error:", apiError)
        setSearchError("No cryptocurrency found with this contract address")
      }
    } catch (error) {
      console.error("Error searching by contract:", error)
      setSearchError("An error occurred while searching. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = (cryptoId: string) => {
    let newFavorites: string[]

    if (favorites.includes(cryptoId)) {
      newFavorites = favorites.filter((id) => id !== cryptoId)
    } else {
      newFavorites = [...favorites, cryptoId]
    }

    // Si l'utilisateur est connecté, mettre à jour les favoris dans son compte
    if (isAuthenticated && user) {
      updateFavorites(newFavorites)
      toast({
        title: favorites.includes(cryptoId) ? "Removed from favorites" : "Added to favorites",
        description: "Your favorites have been updated",
      })
    } else {
      // Sinon, mettre à jour les favoris locaux
      setLocalFavorites(newFavorites)
    }
  }

  // Combiner les cryptos Ethereum et Solana
  const allCryptos = [...cryptos, ...solanaCryptos]

  // Filtrer selon les critères
  const filteredCryptos = allCryptos.filter((crypto) => {
    // Filtre de recherche
    const matchesSearch =
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtre de blockchain
    const matchesBlockchain = blockchainFilter === "all" || crypto.blockchain === blockchainFilter

    // Filtre de memecoin
    const matchesMemecoin = !showMemecoinsOnly || crypto.is_memecoin

    return matchesSearch && matchesBlockchain && matchesMemecoin
  })

  const favoriteCryptos = allCryptos.filter((crypto) => favorites.includes(crypto.id))

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <ParticleLogo />
          <h1 className="text-2xl font-bold">Saperlipocrypto</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            <Link 
              href="/" 
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Accueil
            </Link>
            <Link 
              href="/scanner" 
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Scanner
            </Link>
            <Link 
              href="/pokemon" 
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Pokémon
            </Link>
            <Link 
              href="/dofus-map" 
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring glow-effect"
            >
              Carte Dofus
            </Link>
          </div>
          <Button
            onClick={() => {
              fetchCryptos()
              fetchSolanaCryptos()
            }}
            variant="outline"
            size="sm"
            className="gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </Button>
          <LocalTime />
          <ThemeToggle />
          <UserAuth />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card rounded-lg border shadow-sm p-4">
            <h2 className="text-xl font-semibold mb-4">Search Cryptocurrencies</h2>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name or symbol..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Search by Contract Address</h3>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Enter contract address..."
                      value={contractSearch}
                      onChange={(e) => setContractSearch(e.target.value)}
                    />
                    <Button onClick={searchCryptoByContract} size="sm">
                      Search
                    </Button>
                  </div>
                  {searchError && <p className="text-red-500 text-xs">{searchError}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Filters</h3>
                <div className="flex flex-col gap-3">
                  <Select value={blockchainFilter} onValueChange={setBlockchainFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blockchain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Blockchains</SelectItem>
                      <SelectItem value="ethereum">Ethereum</SelectItem>
                      <SelectItem value="solana">Solana</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="memecoin-filter"
                      checked={showMemecoinsOnly}
                      onChange={(e) => setShowMemecoinsOnly(e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="memecoin-filter" className="text-sm">
                      Show memecoins only
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border shadow-sm">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="all">All Cryptos</TabsTrigger>
                <TabsTrigger value="favorites">
                  <Star className="h-4 w-4 mr-2" />
                  Favorites
                </TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="p-0">
                <div className="max-h-[600px] overflow-y-auto">
                  {loading ? (
                    <div className="p-8 text-center">Loading cryptocurrencies...</div>
                  ) : filteredCryptos.length > 0 ? (
                    filteredCryptos.map((crypto) => (
                      <CryptoCard
                        key={crypto.id}
                        crypto={crypto}
                        isFavorite={favorites.includes(crypto.id)}
                        onSelect={() => setSelectedCrypto(crypto)}
                        onToggleFavorite={() => toggleFavorite(crypto.id)}
                      />
                    ))
                  ) : (
                    <div className="p-8 text-center">No cryptocurrencies found</div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="favorites" className="p-0">
                <div className="max-h-[600px] overflow-y-auto">
                  {favoriteCryptos.length > 0 ? (
                    favoriteCryptos.map((crypto) => (
                      <CryptoCard
                        key={crypto.id}
                        crypto={crypto}
                        isFavorite={true}
                        onSelect={() => setSelectedCrypto(crypto)}
                        onToggleFavorite={() => toggleFavorite(crypto.id)}
                      />
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      {isAuthenticated ? "No favorites added yet" : "Sign in to save your favorites across devices"}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="tradingview" value={activeDetailTab} onValueChange={setActiveDetailTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Détails</TabsTrigger>
              <TabsTrigger value="tradingview">TradingView</TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              {selectedCrypto ? (
                <CryptoDetail
                  crypto={selectedCrypto}
                  isFavorite={favorites.includes(selectedCrypto.id)}
                  onToggleFavorite={() => toggleFavorite(selectedCrypto.id)}
                />
              ) : (
                <div className="bg-card rounded-lg border shadow-sm p-8 text-center h-full flex flex-col items-center justify-center">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
                  <h2 className="text-xl font-semibold">Sélectionnez une cryptomonnaie</h2>
                  <p className="text-muted-foreground mt-2">
                    Cliquez sur une cryptomonnaie pour voir ses informations détaillées et ses graphiques
                  </p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="tradingview">
              <TradingView cryptos={allCryptos} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Section de convertisseur de crypto (déplacée en bas) */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Convertisseur de Cryptomonnaies</h2>
        <div className="bg-card rounded-lg border shadow-sm p-6">
          <CryptoConverter cryptos={allCryptos} />
        </div>
      </div>
    </div>
  )
}
