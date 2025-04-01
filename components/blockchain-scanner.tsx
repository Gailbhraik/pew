"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserAuth } from "@/components/user-auth"
import { LocalTime } from "@/components/local-time"
import { ParticleLogo } from "@/components/particle-logo"
import Link from "next/link"
import { ArrowLeft, Search, ExternalLink, Wallet, Coins } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"

type ScanResult = {
  type: "wallet" | "token"
  address: string
  name?: string
  balance?: string
  value?: string
  transactions?: number
  timestamp: Date
  network: "solana" | "base"
  url: string
  tokenHolders?: number
  tokenSupply?: string
}

export function BlockchainScanner() {
  const [activeTab, setActiveTab] = useState<"solana" | "base">("solana")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState<"wallet" | "token">("wallet")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<ScanResult[]>([])
  const [recentSearches, setRecentSearches] = useState<ScanResult[]>([])
  const [error, setError] = useState<string | null>(null)

  // Charger les recherches récentes depuis le localStorage au chargement du composant
  useEffect(() => {
    // Vérifier que le code s'exécute côté client
    if (typeof window !== 'undefined') {
      const savedSearches = localStorage.getItem("blockchain-scanner-searches")
      if (savedSearches) {
        try {
          const parsedSearches = JSON.parse(savedSearches)
          // Convertir les timestamps en objets Date
          const processedSearches = parsedSearches.map((search: any) => ({
            ...search,
            timestamp: new Date(search.timestamp)
          }))
          setRecentSearches(processedSearches)
        } catch (error) {
          console.error("Error parsing saved searches:", error)
        }
      }
    }
  }, [])

  const saveSearch = (search: ScanResult) => {
    // Vérifier que le code s'exécute côté client
    if (typeof window !== 'undefined') {
      const updatedSearches = [search, ...recentSearches.slice(0, 9)]
      setRecentSearches(updatedSearches)
      localStorage.setItem("blockchain-scanner-searches", JSON.stringify(updatedSearches))
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Veuillez entrer une adresse à rechercher")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Simuler un appel API avec un délai
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Dans un cas réel, nous ferions un appel à l'API BaseScan ou SolScan ici
      // Pour la démo, nous générons des données fictives
      
      let mockResult: ScanResult

      if (activeTab === "solana") {
        if (searchType === "wallet") {
          mockResult = {
            type: "wallet",
            address: searchQuery,
            name: "Solana Wallet",
            balance: (Math.random() * 100).toFixed(4) + " SOL",
            value: "$" + (Math.random() * 10000).toFixed(2),
            transactions: Math.floor(Math.random() * 1000),
            timestamp: new Date(),
            network: "solana",
            url: `https://solscan.io/account/${searchQuery}`
          }
        } else {
          mockResult = {
            type: "token",
            address: searchQuery,
            name: "SOL Token " + searchQuery.substring(0, 6),
            balance: (Math.random() * 1000000).toFixed(0),
            timestamp: new Date(),
            network: "solana",
            url: `https://solscan.io/token/${searchQuery}`,
            tokenHolders: Math.floor(Math.random() * 10000),
            tokenSupply: (Math.random() * 1000000000).toFixed(0)
          }
        }
      } else {
        if (searchType === "wallet") {
          mockResult = {
            type: "wallet",
            address: searchQuery,
            name: "Base Wallet",
            balance: (Math.random() * 10).toFixed(4) + " ETH",
            value: "$" + (Math.random() * 20000).toFixed(2),
            transactions: Math.floor(Math.random() * 500),
            timestamp: new Date(),
            network: "base",
            url: `https://basescan.org/address/${searchQuery}`
          }
        } else {
          mockResult = {
            type: "token",
            address: searchQuery,
            name: "BASE Token " + searchQuery.substring(0, 6),
            balance: (Math.random() * 1000000).toFixed(0),
            timestamp: new Date(),
            network: "base",
            url: `https://basescan.org/token/${searchQuery}`,
            tokenHolders: Math.floor(Math.random() * 5000),
            tokenSupply: (Math.random() * 100000000).toFixed(0)
          }
        }
      }

      setResults([mockResult, ...results])
      saveSearch(mockResult)
    } catch (error) {
      console.error("Error during search:", error)
      setError("Une erreur s'est produite lors de la recherche. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const openExternalLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <ParticleLogo />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Blockchain Scanner</h1>
            <p className="text-muted-foreground mt-1">Explorez les wallets et tokens sur Solana et Base</p>
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
            Retour au Tracker
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Scanner de Blockchain</CardTitle>
            <CardDescription>Recherchez des adresses de wallet ou des tokens sur Solana et Base</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "solana" | "base")} className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="solana">
                  <img src="/solana-logo.svg" alt="Solana" className="w-4 h-4 mr-2" />
                  Solana (SolScan)
                </TabsTrigger>
                <TabsTrigger value="base">
                  <img src="/base-logo.svg" alt="Base" className="w-4 h-4 mr-2" />
                  Base (BaseScan)
                </TabsTrigger>
              </TabsList>

              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Select value={searchType} onValueChange={(value) => setSearchType(value as "wallet" | "token")}>
                      <SelectTrigger>
                        <SelectValue placeholder="Type de recherche" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wallet">
                          <div className="flex items-center">
                            <Wallet className="w-4 h-4 mr-2" />
                            Wallet
                          </div>
                        </SelectItem>
                        <SelectItem value="token">
                          <div className="flex items-center">
                            <Coins className="w-4 h-4 mr-2" />
                            Token
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex-[3] flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder={`Entrez une adresse ${searchType === "wallet" ? "de wallet" : "de token"}...`}
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                      />
                    </div>
                    <Button onClick={handleSearch} disabled={isLoading}>
                      {isLoading ? "Recherche..." : "Rechercher"}
                    </Button>
                  </div>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Résultats de recherche</h3>
                  
                  {isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ) : results.length > 0 ? (
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Adresse</TableHead>
                            <TableHead>Détails</TableHead>
                            <TableHead>Réseau</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {results.map((result, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Badge variant={result.type === "wallet" ? "default" : "secondary"}>
                                  {result.type === "wallet" ? (
                                    <><Wallet className="w-3 h-3 mr-1" /> Wallet</>
                                  ) : (
                                    <><Coins className="w-3 h-3 mr-1" /> Token</>
                                  )}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-mono text-xs">
                                {result.address.substring(0, 6)}...{result.address.substring(result.address.length - 4)}
                              </TableCell>
                              <TableCell>
                                {result.type === "wallet" ? (
                                  <div>
                                    <p className="font-medium">{result.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      Balance: {result.balance} ({result.value})
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Transactions: {result.transactions}
                                    </p>
                                  </div>
                                ) : (
                                  <div>
                                    <p className="font-medium">{result.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      Supply: {result.tokenSupply}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Holders: {result.tokenHolders}
                                    </p>
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge variant={result.network === "solana" ? "outline" : "destructive"}>
                                  {result.network === "solana" ? "Solana" : "Base"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openExternalLink(result.url)}
                                  className="flex items-center gap-1"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  Voir
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      Aucun résultat à afficher. Effectuez une recherche pour voir les résultats.
                    </p>
                  )}
                </div>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {recentSearches.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recherches récentes</CardTitle>
              <CardDescription>Historique de vos dernières recherches</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Adresse</TableHead>
                      <TableHead>Réseau</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentSearches.map((search, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Badge variant={search.type === "wallet" ? "default" : "secondary"}>
                            {search.type === "wallet" ? (
                              <><Wallet className="w-3 h-3 mr-1" /> Wallet</>
                            ) : (
                              <><Coins className="w-3 h-3 mr-1" /> Token</>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {search.address.substring(0, 6)}...{search.address.substring(search.address.length - 4)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={search.network === "solana" ? "outline" : "destructive"}>
                            {search.network === "solana" ? "Solana" : "Base"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {search.timestamp.toLocaleDateString()} {search.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openExternalLink(search.url)}
                            className="flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Voir
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>Les données sont simulées à des fins de démonstration.</p>
        <p className="mt-1">
          Alimenté par{" "}
          <a
            href="https://solscan.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            SolScan
          </a>{" "}
          et{" "}
          <a
            href="https://basescan.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            BaseScan
          </a>
        </p>
      </footer>
    </div>
  )
}
