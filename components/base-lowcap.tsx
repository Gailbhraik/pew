"use client"

import { useState, useEffect, useRef } from "react"
import { Search, ExternalLink, RefreshCw, ArrowUpDown, TrendingUp, TrendingDown, Wallet, Plus, Trash2, MessageCircle, X, Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Crypto } from "@/components/crypto-tracker"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

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

// Message type for chat
type Message = {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
}

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
  const [activeTab, setActiveTab] = useState<"browse" | "search" | "portfolio" | "explorer">("browse")
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [portfolio, setPortfolio] = useState<{token: Crypto, amount: number}[]>([])
  const [explorerSearch, setExplorerSearch] = useState("")
  const [explorerNetwork, setExplorerNetwork] = useState<"solana" | "base">("solana")
  const [explorerResults, setExplorerResults] = useState<any>(null)
  const [explorerLoading, setExplorerLoading] = useState(false)
  const { toast } = useToast()
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const [messageText, setMessageText] = useState("")
  const [userName, setUserName] = useState("")
  const chatEndRef = useRef<HTMLDivElement>(null)

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

  // Load portfolio from local storage
  useEffect(() => {
    if (walletConnected && walletAddress) {
      const savedPortfolio = localStorage.getItem(`portfolio-${walletAddress}`)
      if (savedPortfolio) {
        try {
          setPortfolio(JSON.parse(savedPortfolio))
        } catch (error) {
          console.error("Failed to parse portfolio data:", error)
        }
      }
    }
  }, [walletConnected, walletAddress])
  
  // Save portfolio to local storage
  useEffect(() => {
    if (walletConnected && walletAddress && portfolio.length > 0) {
      localStorage.setItem(`portfolio-${walletAddress}`, JSON.stringify(portfolio))
    }
  }, [portfolio, walletConnected, walletAddress])
  
  // Connect wallet function
  const connectWallet = async () => {
    // Simulating wallet connection for demo purposes
    setLoading(true)
    
    try {
      // In a real app, you would use a proper wallet connection library
      // like @solana/wallet-adapter for Solana or ethers.js for Base/Ethereum
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Generate a fake wallet address for demo
      const fakeAddress = explorerNetwork === "solana"
        ? `${Array.from({length: 32}, () => "123456789abcdef"[Math.floor(Math.random() * 16)]).join("")}`
        : `0x${Array.from({length: 40}, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("")}`
      
      setWalletAddress(fakeAddress)
      setWalletConnected(true)
      
      toast({
        title: "Wallet Connected",
        description: "You have successfully connected your wallet",
      })
    } catch (error) {
      console.error("Error connecting wallet:", error)
      toast({
        title: "Connection failed",
        description: "Failed to connect your wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }
  
  // Disconnect wallet
  const disconnectWallet = () => {
    setWalletConnected(false)
    setWalletAddress("")
    // In a real application, you would also disconnect from the wallet provider
  }
  
  // Add token to portfolio
  const addToPortfolio = (token: Crypto, amount: number) => {
    if (!walletConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first to manage your portfolio",
        variant: "destructive",
      })
      return
    }
    
    // Check if token already exists in portfolio
    const existingIndex = portfolio.findIndex(item => item.token.id === token.id)
    
    if (existingIndex >= 0) {
      // Update existing token
      const updatedPortfolio = [...portfolio]
      updatedPortfolio[existingIndex] = {
        ...updatedPortfolio[existingIndex],
        amount: updatedPortfolio[existingIndex].amount + amount
      }
      setPortfolio(updatedPortfolio)
    } else {
      // Add new token
      setPortfolio([...portfolio, { token, amount }])
    }
    
    toast({
      title: "Added to portfolio",
      description: `Added ${amount} ${token.symbol.toUpperCase()} to your portfolio`,
    })
  }
  
  // Remove token from portfolio
  const removeFromPortfolio = (tokenId: string) => {
    setPortfolio(portfolio.filter(item => item.token.id !== tokenId))
    
    toast({
      title: "Removed from portfolio",
      description: "Token removed from your portfolio",
    })
  }
  
  // Calculate portfolio value
  const calculatePortfolioValue = () => {
    return portfolio.reduce((total, item) => {
      return total + (item.token.current_price * item.amount)
    }, 0)
  }

  // Search using blockchain explorers (Solscan/Basescan)
  const searchExplorer = async () => {
    if (!explorerSearch.trim()) {
      toast({
        title: "Error",
        description: "Please enter a wallet address or token address",
        variant: "destructive",
      })
      return
    }
    
    setExplorerLoading(true)
    
    try {
      // In a real app, you would use the actual APIs for Solscan and Basescan
      // This is a mock implementation for demonstration purposes
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Generate mock results based on the network
      if (explorerNetwork === "solana") {
        // Mock Solscan results
        const isSolToken = explorerSearch.length === 44 || explorerSearch.length === 43
        const isSolWallet = explorerSearch.length >= 32 && explorerSearch.length <= 44
        
        if (isSolToken) {
          // Mock token data for Solana
          setExplorerResults({
            type: "token",
            network: "solana",
            name: `SOL${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
            symbol: `SOL${Math.random().toString(36).substring(2, 4).toUpperCase()}`,
            address: explorerSearch,
            decimals: 9,
            supply: Math.random() * 1000000000,
            holders: Math.floor(Math.random() * 10000),
            price: Math.random() * 10,
            transactions: Math.floor(Math.random() * 100000),
            website: Math.random() > 0.5 ? "https://example.com" : null,
            twitter: Math.random() > 0.5 ? "https://twitter.com/example" : null,
          })
        } else if (isSolWallet) {
          // Mock wallet data for Solana
          const tokenCount = Math.floor(Math.random() * 10) + 1
          const tokens = Array.from({length: tokenCount}, (_, i) => ({
            name: `SOL${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
            symbol: `S${Math.random().toString(36).substring(2, 4).toUpperCase()}`,
            amount: Math.random() * 1000,
            value: Math.random() * 10000,
          }))
          
          setExplorerResults({
            type: "wallet",
            network: "solana",
            address: explorerSearch,
            balance: Math.random() * 100,
            value: Math.random() * 10000,
            tokens: tokens,
            transactions: Math.floor(Math.random() * 1000),
            nfts: Math.floor(Math.random() * 20),
          })
        } else {
          throw new Error("Invalid Solana address format")
        }
      } else {
        // Mock Basescan results
        const isBaseToken = explorerSearch.startsWith("0x") && explorerSearch.length === 42
        const isBaseWallet = explorerSearch.startsWith("0x") && explorerSearch.length === 42
        
        if (isBaseToken) {
          // Mock token data for Base
          setExplorerResults({
            type: "token",
            network: "base",
            name: `BASE${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
            symbol: `B${Math.random().toString(36).substring(2, 4).toUpperCase()}`,
            address: explorerSearch,
            decimals: 18,
            supply: Math.random() * 1000000000,
            holders: Math.floor(Math.random() * 5000),
            price: Math.random() * 5,
            transactions: Math.floor(Math.random() * 50000),
            website: Math.random() > 0.5 ? "https://example.com" : null,
            twitter: Math.random() > 0.5 ? "https://twitter.com/example" : null,
          })
        } else if (isBaseWallet) {
          // Mock wallet data for Base
          const tokenCount = Math.floor(Math.random() * 8) + 1
          const tokens = Array.from({length: tokenCount}, (_, i) => ({
            name: `BASE${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
            symbol: `B${Math.random().toString(36).substring(2, 4).toUpperCase()}`,
            amount: Math.random() * 1000,
            value: Math.random() * 5000,
          }))
          
          setExplorerResults({
            type: "wallet",
            network: "base",
            address: explorerSearch,
            balance: Math.random() * 50,
            value: Math.random() * 5000,
            tokens: tokens,
            transactions: Math.floor(Math.random() * 500),
            nfts: Math.floor(Math.random() * 10),
          })
        } else {
          throw new Error("Invalid Base address format")
        }
      }
    } catch (error) {
      console.error("Explorer search error:", error)
      setExplorerResults(null)
      toast({
        title: "Search failed",
        description: error instanceof Error ? error.message : "Failed to retrieve data. Please check the address and try again.",
        variant: "destructive",
      })
    } finally {
      setExplorerLoading(false)
    }
  }

  // Load chat messages from local storage
  useEffect(() => {
    const savedMessages = localStorage.getItem("chat-messages")
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages) as Message[]
        // Convert string timestamps back to Date objects
        const messagesWithDates = parsedMessages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
        setChatMessages(messagesWithDates)
      } catch (error) {
        console.error("Failed to parse chat messages:", error)
      }
    }
    
    // Generate random username if not set
    const savedUserName = localStorage.getItem("chat-username")
    if (savedUserName) {
      setUserName(savedUserName)
    } else {
      const randomName = `User${Math.floor(Math.random() * 10000)}`
      setUserName(randomName)
      localStorage.setItem("chat-username", randomName)
    }
  }, [])
  
  // Save chat messages to local storage
  useEffect(() => {
    if (chatMessages.length > 0) {
      localStorage.setItem("chat-messages", JSON.stringify(chatMessages))
    }
  }, [chatMessages])
  
  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    if (chatEndRef.current && chatOpen) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [chatMessages, chatOpen])
  
  // Send a chat message
  const sendMessage = () => {
    if (!messageText.trim()) return
    
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: userName,
      text: messageText.trim(),
      timestamp: new Date()
    }
    
    setChatMessages([...chatMessages, newMessage])
    setMessageText("")
  }
  
  // Format time for chat messages
  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="space-y-6 relative">
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
            onValueChange={(value: "all" | "Standard") => setPlatformFilter(value)}
          >
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
        onValueChange={(value) => setActiveTab(value as "browse" | "search" | "portfolio" | "explorer")}
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="browse">Browse All Tokens</TabsTrigger>
          <TabsTrigger value="search">Search by Contract</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="explorer">Blockchain Explorer</TabsTrigger>
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
                        {crypto.symbol.substring(0, 2).toUpperCase()}
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
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-blue-600 hover:text-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900"
                          onClick={() => {
                            setSearchTerm(crypto.contract_address || "")
                            setSelectedCrypto(crypto)
                            setActiveTab("search")
                          }}
                          title="View Details"
                        >
                          <Search className="h-3.5 w-3.5" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-green-600 hover:text-green-800 hover:bg-green-100 dark:hover:bg-green-900"
                          onClick={() => {
                            if (walletConnected) {
                              // Open a dialog to ask for amount
                              const dialog = document.createElement('dialog')
                              dialog.innerHTML = `
                                <div class="p-4">
                                  <h3 class="font-bold mb-2">Add ${crypto.name} to Portfolio</h3>
                                  <input type="number" min="0" step="0.01" placeholder="Enter amount" class="border p-2 w-full mb-2">
                                  <div class="flex justify-end gap-2">
                                    <button id="cancel" class="px-3 py-1 bg-gray-200 rounded">Cancel</button>
                                    <button id="confirm" class="px-3 py-1 bg-blue-600 text-white rounded">Add</button>
                                  </div>
                                </div>
                              `
                              document.body.appendChild(dialog)
                              dialog.showModal()
                              
                              // Handle dialog actions
                              dialog.querySelector('#cancel')?.addEventListener('click', () => {
                                dialog.close()
                                document.body.removeChild(dialog)
                              })
                              
                              dialog.querySelector('#confirm')?.addEventListener('click', () => {
                                const input = dialog.querySelector('input')
                                const amount = parseFloat(input?.value || '0')
                                if (amount > 0) {
                                  addToPortfolio(crypto, amount)
                                }
                                dialog.close()
                                document.body.removeChild(dialog)
                              })
                            } else {
                              toast({
                                title: "Wallet not connected",
                                description: "Please connect your wallet to add tokens to your portfolio",
                                variant: "destructive",
                              })
                            }
                          }}
                          title="Add to Portfolio"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
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
                  
                  {walletConnected && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="ml-2">
                          <Plus className="h-3 w-3 mr-1" />
                          <span>Add to Portfolio</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Add to Portfolio</DialogTitle>
                          <DialogDescription>
                            Enter the amount of {selectedCrypto.name} ({selectedCrypto.symbol.toUpperCase()}) you want to add to your portfolio.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right">
                              Amount
                            </Label>
                            <Input
                              id="amount"
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="Enter amount"
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant="secondary">
                              Cancel
                            </Button>
                          </DialogClose>
                          <Button
                            type="button"
                            onClick={() => {
                              const amountInput = document.getElementById('amount') as HTMLInputElement
                              const amount = parseFloat(amountInput?.value || '0')
                              if (amount > 0) {
                                addToPortfolio(selectedCrypto, amount)
                                // Close the dialog
                                const closeButton = document.querySelector('[data-state="open"] button[data-state="closed"]') as HTMLButtonElement
                                if (closeButton) closeButton.click()
                              } else {
                                toast({
                                  title: "Invalid amount",
                                  description: "Please enter a valid amount greater than 0",
                                  variant: "destructive",
                                })
                              }
                            }}
                          >
                            Add
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
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

        <TabsContent value="portfolio" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Your Portfolio</h2>
            {!walletConnected ? (
              <Button onClick={connectWallet} className="bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
                {loading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Wallet className="h-4 w-4 mr-2" />}
                Connect Wallet
              </Button>
            ) : (
              <div className="flex gap-2 items-center">
                <div className="text-sm bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full">
                  <span className="font-medium">{walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}</span>
                </div>
                <Button variant="outline" size="sm" onClick={disconnectWallet}>Disconnect</Button>
              </div>
            )}
          </div>
          
          {walletConnected ? (
            <div className="space-y-4">
              {portfolio.length > 0 ? (
                <>
                  <Card className="border-blue-200 dark:border-blue-800">
                    <CardHeader className="bg-blue-100/50 dark:bg-blue-900/20">
                      <CardTitle className="text-lg">Portfolio Overview</CardTitle>
                      <CardDescription>
                        Total value: ${calculatePortfolioValue().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        {portfolio.map((item) => (
                          <div key={item.token.id} className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-200 dark:bg-blue-800 rounded-full flex items-center justify-center text-sm font-bold">
                                {item.token.symbol.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-medium">{item.token.name}</div>
                                <div className="text-xs text-muted-foreground">{item.amount.toLocaleString()} {item.token.symbol.toUpperCase()}</div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="font-medium">${(item.token.current_price * item.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                                onClick={() => removeFromPortfolio(item.token.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Add tokens from your browsing</h3>
                    <p className="text-sm text-muted-foreground mb-4">Browse tokens and add them to your portfolio by selecting them and clicking "Add to Portfolio".</p>
                  </div>
                </>
              ) : (
                <div className="bg-blue-50 dark:bg-blue-950 p-8 rounded-lg text-center">
                  <Wallet className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-lg font-medium mb-2">Your portfolio is empty</h3>
                  <p className="text-muted-foreground mb-4">Browse tokens and add them to start building your portfolio</p>
                  <Button onClick={() => setActiveTab("browse")} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Browse Tokens
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-blue-50 dark:bg-blue-950 p-8 rounded-lg text-center">
              <Wallet className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-lg font-medium mb-2">Connect your wallet</h3>
              <p className="text-muted-foreground mb-4">Connect your wallet to manage your portfolio</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="explorer" className="space-y-4 mt-4">
          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader className="bg-blue-100/50 dark:bg-blue-900/20">
              <CardTitle className="text-lg">Blockchain Explorer</CardTitle>
              <CardDescription>
                Search for wallet addresses or token contracts on Solana and Base blockchains
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Enter wallet or token address..."
                        className="pl-8 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800"
                        value={explorerSearch}
                        onChange={(e) => setExplorerSearch(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && searchExplorer()}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={explorerNetwork}
                      onValueChange={(value: "solana" | "base") => setExplorerNetwork(value)}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Network" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solana">Solana (Solscan)</SelectItem>
                        <SelectItem value="base">Base (Basescan)</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={searchExplorer} 
                      className="bg-blue-600 hover:bg-blue-700 text-white" 
                      disabled={explorerLoading}
                    >
                      {explorerLoading ? (
                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Search className="h-4 w-4 mr-2" />
                      )}
                      Search
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {explorerLoading && (
            <div className="space-y-4 mt-6">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-20 w-full" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
            </div>
          )}

          {explorerResults && !explorerLoading && (
            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader className="bg-blue-100/50 dark:bg-blue-900/20">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>
                      {explorerResults.type === "token" ? "Token Details" : "Wallet Details"}
                    </CardTitle>
                    <CardDescription>
                      {explorerResults.network === "solana" ? "Solana Blockchain" : "Base Blockchain"}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={
                        explorerResults.network === "solana"
                          ? `https://solscan.io/${explorerResults.type === "token" ? "token" : "account"}/${explorerResults.address}`
                          : `https://basescan.org/${explorerResults.type === "token" ? "token" : "address"}/${explorerResults.address}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>{explorerResults.network === "solana" ? "View on Solscan" : "View on Basescan"}</span>
                    </a>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                {explorerResults.type === "token" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Token Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Name</span>
                          <span className="font-medium">{explorerResults.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Symbol</span>
                          <span className="font-medium">{explorerResults.symbol}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Decimals</span>
                          <span className="font-medium">{explorerResults.decimals}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Supply</span>
                          <span className="font-medium">{explorerResults.supply.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Holders</span>
                          <span className="font-medium">{explorerResults.holders.toLocaleString()}</span>
                        </div>
                        {explorerResults.price && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Price</span>
                            <span className="font-medium">${explorerResults.price.toFixed(6)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2">Contract Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex flex-col gap-1">
                          <span className="text-muted-foreground">Token Address</span>
                          <code className="text-xs bg-blue-50 dark:bg-blue-950 p-2 rounded break-all">
                            {explorerResults.address}
                          </code>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Transactions</span>
                          <span className="font-medium">{explorerResults.transactions.toLocaleString()}</span>
                        </div>
                        {explorerResults.website && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Website</span>
                            <a href={explorerResults.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {explorerResults.website.replace("https://", "")}
                            </a>
                          </div>
                        )}
                        {explorerResults.twitter && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Twitter</span>
                            <a href={explorerResults.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {explorerResults.twitter.split("/").pop()}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Balance</div>
                        <div className="text-lg font-bold">
                          {explorerResults.balance.toLocaleString()} {explorerResults.network === "solana" ? "SOL" : "ETH"}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          ${explorerResults.value.toLocaleString()}
                        </div>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Tokens</div>
                        <div className="text-lg font-bold">{explorerResults.tokens.length}</div>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Transactions</div>
                        <div className="text-lg font-bold">{explorerResults.transactions.toLocaleString()}</div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-3">Token Holdings</h3>
                      <div className="space-y-3">
                        {explorerResults.tokens.map((token: any, index: number) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-200 dark:bg-blue-800 rounded-full flex items-center justify-center text-xs font-bold">
                                {token.symbol.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-medium">{token.name}</div>
                                <div className="text-xs text-muted-foreground">{token.amount.toLocaleString()} {token.symbol}</div>
                              </div>
                            </div>
                            <div className="text-sm font-medium">${token.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-muted-foreground">Wallet Address</span>
                      <code className="text-xs bg-blue-50 dark:bg-blue-950 p-2 rounded break-all">
                        {explorerResults.address}
                      </code>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Chat toggle button */}
      <Button
        className="fixed right-4 bottom-4 rounded-full p-3 shadow-md bg-blue-600 hover:bg-blue-700 text-white"
        onClick={() => setChatOpen(!chatOpen)}
      >
        {chatOpen ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </Button>
      
      {/* Chat panel */}
      <div 
        className={`fixed right-4 bottom-16 w-80 bg-white dark:bg-gray-950 rounded-lg shadow-xl transition-transform duration-300 border border-blue-200 dark:border-blue-800 ${
          chatOpen ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-0 pointer-events-none'
        }`}
      >
        <div className="p-3 border-b border-blue-200 dark:border-blue-800 bg-blue-100/50 dark:bg-blue-900/20 rounded-t-lg flex justify-between items-center">
          <h3 className="font-medium">Community Chat</h3>
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            {chatMessages.length} messages
          </Badge>
        </div>
        <div className="p-3 max-h-80 overflow-y-auto flex flex-col space-y-3">
          {chatMessages.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-8">
              No messages yet. Be the first to chat!
            </div>
          ) : (
            chatMessages.map((message) => (
              <div 
                key={message.id} 
                className={`flex flex-col rounded-lg p-2 max-w-[90%] ${
                  message.sender === userName 
                    ? 'self-end bg-blue-100 dark:bg-blue-900/40' 
                    : 'self-start bg-gray-100 dark:bg-gray-800/40'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium">{message.sender}</span>
                  <span className="text-xs text-muted-foreground">{formatMessageTime(message.timestamp)}</span>
                </div>
                <p className="text-sm">{message.text}</p>
              </div>
            ))
          )}
          <div ref={chatEndRef} />
        </div>
        <div className="p-3 border-t border-blue-200 dark:border-blue-800 flex gap-2">
          <Input
            placeholder="Type a message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="text-sm"
          />
          <Button 
            size="icon" 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={sendMessage}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

