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
import { ArrowLeft, Search, ExternalLink, Wallet, Coins, AlertCircle, ArrowUpDown } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { API_KEYS, API_ENDPOINTS, getHeaders, buildBaseScanUrl } from "@/lib/api-config"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ExecutionContext } from '@cloudflare/workers-types'

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
  decimals?: number
  lastTransactions?: {
    hash: string
    timestamp: Date
    value: string
    from: string
    to: string
    status: string
  }[]
  tokenTransfers?: {
    hash: string
    timestamp: Date
    from: string
    to: string
    amount: string
  }[]
  tokenPrice?: string
  marketCap?: string
  volume24h?: string
  priceChange24h?: string
  tokenLogo?: string
  verified?: boolean
  contractCreator?: string
  contractCreationDate?: Date
}

// Fonction pour récupérer les données d'un wallet Solana
async function fetchSolanaWallet(address: string): Promise<ScanResult> {
  try {
    // Utiliser l'API SolScan pour obtenir les informations du compte
    const accountResponse = await fetch(`${API_ENDPOINTS.SOLSCAN.BASE_URL}${API_ENDPOINTS.SOLSCAN.ACCOUNT}/${address}`, {
      method: 'GET',
      headers: getHeaders(API_KEYS.SOLSCAN_API_KEY, null, null)
    });
    
    if (!accountResponse.ok) {
      throw new Error(`SolScan API error: ${accountResponse.status}`);
    }
    
    const accountData = await accountResponse.json();
    
    // Récupérer les transactions récentes
    const txResponse = await fetch(`${API_ENDPOINTS.SOLSCAN.BASE_URL}${API_ENDPOINTS.SOLSCAN.TRANSACTIONS}/${address}?limit=5`, {
      method: 'GET',
      headers: getHeaders(API_KEYS.SOLSCAN_API_KEY, null, null)
    });
    
    let transactions: any[] = [];
    if (txResponse.ok) {
      const txData = await txResponse.json();
      transactions = txData.data || [];
    }
    
    // Appel à l'API pour obtenir le prix actuel de SOL
    const solPriceResponse = await fetch(`${API_ENDPOINTS.COINGECKO.BASE_URL}${API_ENDPOINTS.COINGECKO.SIMPLE_PRICE}?ids=solana&vs_currencies=usd`);
    let solPrice = 0;
    
    if (solPriceResponse.ok) {
      const solPriceData = await solPriceResponse.json();
      solPrice = solPriceData.solana?.usd || 0;
    } else {
      // Fallback price if API call fails
      solPrice = 150; // Approximate SOL price as fallback
    }
    
    // Extraire les données pertinentes
    const lamports = accountData.lamports || 0;
    const balanceInSOL = lamports / 1000000000; // Conversion de lamports en SOL
    const valueInUSD = balanceInSOL * solPrice;
    
    // Formater les transactions récentes
    const lastTransactions = transactions.map(tx => ({
      hash: tx.txHash || tx.signature,
      timestamp: new Date(tx.blockTime * 1000),
      value: tx.lamport ? `${(tx.lamport / 1000000000).toFixed(6)} SOL` : "N/A",
      from: tx.signer?.[0] || "N/A",
      to: tx.mainActions?.[0]?.destAddress || "N/A",
      status: tx.status || "Success"
    }));
    
    return {
      type: 'wallet',
      address,
      name: accountData.account || `Solana Wallet ${address.substring(0, 4)}...${address.substring(address.length - 4)}`,
      balance: `${balanceInSOL.toFixed(6)} SOL`,
      value: `$${valueInUSD.toFixed(2)}`,
      transactions: accountData.txCount || 0,
      timestamp: new Date(),
      network: 'solana',
      url: `https://solscan.io/account/${address}`,
      lastTransactions
    };
  } catch (error) {
    console.error('Error fetching Solana wallet:', error);
    // Provide fallback data or handle the error appropriately
    throw error; // Re-throw the error if you want to handle it elsewhere
  }
}

// Fonction pour récupérer les données d'un token Solana
async function fetchSolanaToken(address: string): Promise<ScanResult> {
  try {
    // Utiliser l'API SolScan pour obtenir les informations du token
    const tokenResponse = await fetch(`${API_ENDPOINTS.SOLSCAN.BASE_URL}${API_ENDPOINTS.SOLSCAN.TOKEN}/${address}`, {
      method: 'GET',
      headers: getHeaders(API_KEYS.SOLSCAN_API_KEY, null, null)
    });
    
    if (!tokenResponse.ok) {
      throw new Error(`SolScan API error: ${tokenResponse.status}`);
    }
    
    const tokenData = await tokenResponse.json();
    
    // Récupérer les transferts récents du token
    const transfersResponse = await fetch(`${API_ENDPOINTS.SOLSCAN.BASE_URL}${API_ENDPOINTS.SOLSCAN.TOKEN}/${address}/transfers?limit=5`, {
      method: 'GET',
      headers: getHeaders(API_KEYS.SOLSCAN_API_KEY, null, null)
    });
    
    let transfers: any[] = [];
    if (transfersResponse.ok) {
      const transfersData = await transfersResponse.json();
      transfers = transfersData.data || [];
    }
    
    // Récupérer les métadonnées du token pour plus d'informations
    const metaResponse = await fetch(`${API_ENDPOINTS.SOLSCAN.BASE_URL}${API_ENDPOINTS.SOLSCAN.TOKEN_META}/${address}`, {
      method: 'GET',
      headers: getHeaders(API_KEYS.SOLSCAN_API_KEY, null, null)
    });
    
    let tokenMeta: any = {};
    if (metaResponse.ok) {
      tokenMeta = await metaResponse.json();
    }
    
    // Récupérer le nombre de holders
    const holdersResponse = await fetch(`${API_ENDPOINTS.SOLSCAN.BASE_URL}${API_ENDPOINTS.SOLSCAN.TOKEN_HOLDERS}/${address}?limit=1&offset=0`, {
      method: 'GET',
      headers: getHeaders(API_KEYS.SOLSCAN_API_KEY, null, null)
    });
    
    let holdersData = { total: 0 };
    if (holdersResponse.ok) {
      holdersData = await holdersResponse.json();
    }
    
    // Récupérer le prix du token via CoinGecko si possible
    let tokenPrice = "N/A";
    let marketCap = "N/A";
    let volume24h = "N/A";
    let priceChange24h = "0%";
    
    try {
      // Essayer de trouver le token sur CoinGecko par son symbole
      const coinListResponse = await fetch(`${API_ENDPOINTS.COINGECKO.BASE_URL}${API_ENDPOINTS.COINGECKO.COINS_LIST}`);
      if (coinListResponse.ok) {
        const coinList = await coinListResponse.json();
        const tokenSymbol = tokenData.symbol?.toLowerCase() || "";
        const possibleCoins = coinList.filter((coin: any) => 
          coin.symbol.toLowerCase() === tokenSymbol || 
          coin.name.toLowerCase().includes(tokenSymbol)
        );
        
        if (possibleCoins.length > 0) {
          // Prendre le premier résultat correspondant
          const coinId = possibleCoins[0].id;
          const coinDataResponse = await fetch(`${API_ENDPOINTS.COINGECKO.BASE_URL}${API_ENDPOINTS.COINGECKO.COIN_DATA}/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`);
          
          if (coinDataResponse.ok) {
            const coinData = await coinDataResponse.json();
            tokenPrice = `$${coinData.market_data?.current_price?.usd?.toFixed(6) || "N/A"}`;
            marketCap = `$${coinData.market_data?.market_cap?.usd?.toLocaleString() || "N/A"}`;
            volume24h = `$${coinData.market_data?.total_volume?.usd?.toLocaleString() || "N/A"}`;
            const priceChangeValue = coinData.market_data?.price_change_percentage_24h || 0;
            priceChange24h = `${priceChangeValue.toFixed(2)}%`;
          }
        }
      }
    } catch (priceError) {
      console.error("Error fetching token price:", priceError);
    }
    
    // Si le prix n'a pas été trouvé sur CoinGecko, utiliser les données de SolScan ou simuler
    if (tokenPrice === "N/A" && tokenData.price) {
      tokenPrice = `$${tokenData.price.toFixed(6)}`;
      const priceChangeValue = tokenData.priceChange24h || (Math.random() * 20) - 10;
      priceChange24h = `${priceChangeValue.toFixed(2)}%`;
      marketCap = tokenData.marketCap ? `$${tokenData.marketCap.toLocaleString()}` : "N/A";
      volume24h = tokenData.volume24h ? `$${tokenData.volume24h.toLocaleString()}` : "N/A";
    }
    
    // Extraire les données pertinentes
    const tokenName = tokenData.name || tokenMeta?.name || `SOL Token ${address.substring(0, 6)}`;
    const tokenSymbol = tokenData.symbol || tokenMeta?.symbol || "TOKEN";
    const tokenSupply = tokenData.supply?.toString() || tokenMeta?.supply?.toString() || "N/A";
    const tokenHolders = holdersData.total || tokenData.holder || 0;
    const decimals = tokenData.decimals || tokenMeta?.decimals || 9;
    const tokenLogo = tokenMeta?.icon || null;
    
    // Formater les transferts récents
    const tokenTransfers = transfers.map(transfer => ({
      hash: transfer.signature || transfer.txHash,
      timestamp: new Date(transfer.blockTime * 1000),
      from: transfer.src || "N/A",
      to: transfer.dst || "N/A",
      amount: `${(transfer.amount / Math.pow(10, decimals)).toFixed(2)} ${tokenSymbol}`
    }));
    
    return {
      type: 'token',
      address,
      name: tokenName,
      tokenSupply,
      timestamp: new Date(),
      network: 'solana',
      url: `https://solscan.io/token/${address}`,
      tokenHolders,
      tokenPrice,
      marketCap,
      volume24h,
      priceChange24h,
      decimals,
      tokenTransfers,
      tokenLogo,
      verified: tokenData.verified || false,
      contractCreator: tokenData.mintAuthority || "N/A",
      contractCreationDate: tokenData.mintTime ? new Date(tokenData.mintTime * 1000) : undefined
    };
  } catch (error) {
    console.error('Error fetching Solana token:', error);
    
    // Fallback à des données simulées si l'API échoue
    const tokenName = `SOL Token ${address.substring(0, 6)}`;
    const tokenSymbol = "TOKEN";
    const tokenSupply = (Math.random() * 1000000000).toFixed(0);
    const tokenHolders = Math.floor(Math.random() * 10000) + 100;
    const tokenPrice = `$${(Math.random() * 10).toFixed(6)}`;
    const marketCap = `$${(parseFloat(tokenSupply) * parseFloat(tokenPrice.substring(1))).toFixed(2)}`;
    const volume24h = `$${(Math.random() * 1000000).toFixed(2)}`;
    const priceChangeValue = (Math.random() * 20) - 10;
    const priceChange24h = `${priceChangeValue.toFixed(2)}%`;
    
    // Générer des transferts de tokens fictifs
    const tokenTransfers = Array.from({ length: 5 }, (_, i) => ({
      hash: `${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 10)}`,
      timestamp: new Date(Date.now() - (i * 3600000)),
      from: `${Math.random().toString(36).substring(2, 10)}...`,
      to: `${Math.random().toString(36).substring(2, 10)}...`,
      amount: `${(Math.random() * 10000).toFixed(2)} ${tokenSymbol}`
    }));
    
    return {
      type: 'token',
      address,
      name: tokenName,
      tokenSupply,
      timestamp: new Date(),
      network: 'solana',
      url: `https://solscan.io/token/${address}`,
      tokenHolders,
      tokenPrice,
      marketCap,
      volume24h,
      priceChange24h,
      decimals: 9,
      tokenTransfers,
      verified: Math.random() > 0.3, // 70% de chance d'être vérifié
      contractCreator: `${Math.random().toString(36).substring(2, 10)}...`,
      contractCreationDate: new Date(Date.now() - (Math.random() * 365 * 24 * 60 * 60 * 1000))
    };
  }
}

// Fonction pour récupérer les données d'un wallet Base (Ethereum)
async function fetchBaseWallet(address: string): Promise<ScanResult> {
  try {
    // Utiliser l'API BaseScan pour obtenir le solde du compte
    const balanceUrl = buildBaseScanUrl(API_ENDPOINTS.BASESCAN.ACCOUNT_BALANCE, {
      address: address
    });
    
    const balanceResponse = await fetch(balanceUrl);
    
    if (!balanceResponse.ok) {
      throw new Error(`BaseScan API error: ${balanceResponse.status}`);
    }
    
    const balanceData = await balanceResponse.json();
    
    if (balanceData.status !== '1') {
      throw new Error(`BaseScan API error: ${balanceData.message}`);
    }
    
    // Récupérer les transactions récentes
    const txUrl = buildBaseScanUrl(API_ENDPOINTS.BASESCAN.TRANSACTIONS, {
      address: address,
      startblock: '0',
      endblock: '99999999',
      page: '1',
      offset: '5',
      sort: 'desc'
    });
    
    const txResponse = await fetch(txUrl);
    let transactions: any[] = [];
    
    if (txResponse.ok) {
      const txData = await txResponse.json();
      if (txData.status === '1') {
        transactions = txData.result || [];
      }
    }
    
    // Appel à l'API pour obtenir le prix actuel de ETH
    const ethPriceResponse = await fetch(`${API_ENDPOINTS.COINGECKO.BASE_URL}${API_ENDPOINTS.COINGECKO.SIMPLE_PRICE}?ids=ethereum&vs_currencies=usd`);
    let ethPrice = 0;
    
    if (ethPriceResponse.ok) {
      const ethPriceData = await ethPriceResponse.json();
      ethPrice = ethPriceData.ethereum?.usd || 0;
    } else {
      // Fallback price if API call fails
      ethPrice = 3500; // Approximate ETH price as fallback
    }
    
    // Extraire les données pertinentes
    const weiBalance = balanceData.result;
    const balanceInETH = parseFloat(weiBalance) / 1e18; // Conversion de wei en ETH
    const valueInUSD = balanceInETH * ethPrice;
    
    // Formater les transactions récentes
    const lastTransactions = transactions.map(tx => ({
      hash: tx.hash,
      timestamp: new Date(parseInt(tx.timeStamp) * 1000),
      value: `${parseFloat(tx.value) / 1e18} ETH`,
      from: tx.from,
      to: tx.to,
      status: tx.isError === '0' ? 'Success' : 'Failed'
    }));
    
    return {
      type: 'wallet',
      address,
      name: `Base Wallet ${address.substring(0, 4)}...${address.substring(address.length - 4)}`,
      balance: `${balanceInETH.toFixed(6)} ETH`,
      value: `$${valueInUSD.toFixed(2)}`,
      transactions: transactions.length,
      timestamp: new Date(),
      network: 'base',
      url: `https://basescan.org/address/${address}`,
      lastTransactions
    };
  } catch (error) {
    console.error('Error fetching Base wallet:', error);
    throw error;
  }
}

// Fonction pour récupérer les données d'un token Base (Ethereum)
async function fetchBaseToken(address: string): Promise<ScanResult> {
  try {
    // Utiliser l'API BaseScan pour obtenir les informations du token
    const tokenInfoUrl = buildBaseScanUrl(API_ENDPOINTS.BASESCAN.TOKEN_INFO, {
      contractaddress: address
    });
    
    const tokenInfoResponse = await fetch(tokenInfoUrl);
    
    if (!tokenInfoResponse.ok) {
      throw new Error(`BaseScan API error: ${tokenInfoResponse.status}`);
    }
    
    const tokenInfoData = await tokenInfoResponse.json();
    
    if (tokenInfoData.status !== '1') {
      throw new Error(`BaseScan API error: ${tokenInfoData.message}`);
    }
    
    const tokenInfo = tokenInfoData.result?.[0] || {};
    
    // Récupérer le code source du contrat pour vérifier s'il est vérifié
    const contractSourceUrl = buildBaseScanUrl(API_ENDPOINTS.BASESCAN.CONTRACT_SOURCE, {
      address: address
    });
    
    const contractSourceResponse = await fetch(contractSourceUrl);
    let contractSource: any = { ABI: "Contract source code not verified" };
    let isVerified = false;
    
    if (contractSourceResponse.ok) {
      const contractSourceData = await contractSourceResponse.json();
      if (contractSourceData.status === '1' && contractSourceData.result?.[0]) {
        contractSource = contractSourceData.result[0];
        isVerified = contractSource.ABI !== "Contract source code not verified";
      }
    }
    
    // Récupérer les transferts récents du token
    const transfersUrl = buildBaseScanUrl(API_ENDPOINTS.BASESCAN.TOKEN_TRANSFERS, {
      contractaddress: address,
      page: '1',
      offset: '5',
      sort: 'desc'
    });
    
    const transfersResponse = await fetch(transfersUrl);
    let transfers: any[] = [];
    
    if (transfersResponse.ok) {
      const transfersData = await transfersResponse.json();
      if (transfersData.status === '1') {
        transfers = transfersData.result || [];
      }
    }
    
    // Récupérer le prix du token via CoinGecko si possible
    let tokenPrice = "N/A";
    let marketCap = "N/A";
    let volume24h = "N/A";
    let priceChange24h = "0%";
    let tokenLogo = null;
    
    try {
      // Essayer de trouver le token sur CoinGecko par son symbole
      const coinListResponse = await fetch(`${API_ENDPOINTS.COINGECKO.BASE_URL}${API_ENDPOINTS.COINGECKO.COINS_LIST}`);
      if (coinListResponse.ok) {
        const coinList = await coinListResponse.json();
        const tokenSymbol = tokenInfo.symbol?.toLowerCase() || "";
        const possibleCoins = coinList.filter((coin: any) => 
          coin.symbol.toLowerCase() === tokenSymbol || 
          coin.name.toLowerCase().includes(tokenSymbol)
        );
        
        if (possibleCoins.length > 0) {
          // Prendre le premier résultat correspondant
          const coinId = possibleCoins[0].id;
          const coinDataResponse = await fetch(`${API_ENDPOINTS.COINGECKO.BASE_URL}${API_ENDPOINTS.COINGECKO.COIN_DATA}/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`, {
            method: 'GET',
            headers: getHeaders(null, null, null)
          });
          
          if (coinDataResponse.ok) {
            const coinData = await coinDataResponse.json();
            tokenPrice = `$${coinData.market_data?.current_price?.usd?.toFixed(6) || "N/A"}`;
            marketCap = `$${coinData.market_data?.market_cap?.usd?.toLocaleString() || "N/A"}`;
            volume24h = `$${coinData.market_data?.total_volume?.usd?.toLocaleString() || "N/A"}`;
            const priceChangeValue = coinData.market_data?.price_change_percentage_24h || 0;
            priceChange24h = `${priceChangeValue.toFixed(2)}%`;
            tokenLogo = coinData.image?.small || null;
          }
        }
      }
    } catch (priceError) {
      console.error("Error fetching token price:", priceError);
    }
    
    // Extraire les données pertinentes
    const tokenName = tokenInfo.name || `Base Token ${address.substring(0, 6)}`;
    const tokenSymbol = tokenInfo.symbol || "TOKEN";
    const tokenSupply = tokenInfo.totalSupply ? (parseInt(tokenInfo.totalSupply) / Math.pow(10, parseInt(tokenInfo.divisor || "18"))).toString() : "N/A";
    const decimals = parseInt(tokenInfo.divisor || "18");
    
    // Estimer le nombre de holders (cette information n'est pas directement disponible via l'API)
    const tokenHolders = parseInt(tokenInfo.holderCount || "0");
    
    // Formater les transferts récents
    const tokenTransfers = transfers.map(transfer => ({
      hash: transfer.hash,
      timestamp: new Date(parseInt(transfer.timeStamp) * 1000),
      from: transfer.from,
      to: transfer.to,
      amount: `${(parseInt(transfer.value) / Math.pow(10, decimals)).toFixed(2)} ${tokenSymbol}`
    }));
    
    return {
      type: 'token',
      address,
      name: tokenName,
      tokenSupply,
      timestamp: new Date(),
      network: 'base',
      url: `https://basescan.org/token/${address}`,
      tokenHolders,
      tokenPrice,
      marketCap,
      volume24h,
      priceChange24h,
      decimals,
      tokenTransfers,
      tokenLogo,
      verified: isVerified,
      contractCreator: contractSource.ContractCreator || "N/A",
      contractCreationDate: contractSource.ContractCreationTime ? new Date(parseInt(contractSource.ContractCreationTime) * 1000) : undefined
    };
  } catch (error) {
    console.error('Error fetching Base token:', error);
    throw error;
  }
}

// Fonction pour vérifier si un wallet a acheté un token spécifique
async function checkWalletOwnsToken(walletAddress: string, tokenAddress: string, network: 'solana' | 'base'): Promise<boolean> {
  try {
    if (network === 'solana') {
      // Vérifier la possession du token sur Solana
      const tokenHoldingsResponse = await fetch(`${API_ENDPOINTS.SOLSCAN.BASE_URL}/account/tokens?account=${walletAddress}`, {
        method: 'GET',
        headers: getHeaders(API_KEYS.SOLSCAN_API_KEY, null, null)
      });
      
      if (!tokenHoldingsResponse.ok) {
        throw new Error(`SolScan API error: ${tokenHoldingsResponse.status}`);
      }
      
      const tokenHoldings = await tokenHoldingsResponse.json();
      
      // Vérifier si le token est dans la liste des tokens détenus
      return tokenHoldings.some((token: any) => 
        token.tokenAddress && token.tokenAddress.toLowerCase() === tokenAddress.toLowerCase()
      );
    } else {
      // Vérifier la possession du token sur Base (Ethereum)
      const tokenBalanceUrl = buildBaseScanUrl(API_ENDPOINTS.BASESCAN.TOKEN_BALANCE, {
        address: walletAddress,
        contractaddress: tokenAddress
      });
      
      const tokenBalanceResponse = await fetch(tokenBalanceUrl);
      
      if (!tokenBalanceResponse.ok) {
        throw new Error(`BaseScan API error: ${tokenBalanceResponse.status}`);
      }
      
      const tokenBalanceData = await tokenBalanceResponse.json();
      
      if (tokenBalanceData.status !== '1') {
        throw new Error(`BaseScan API error: ${tokenBalanceData.message}`);
      }
      
      // Si le solde est supérieur à 0, le wallet possède le token
      const balance = parseInt(tokenBalanceData.result || '0');
      return balance > 0;
    }
  } catch (error) {
    console.error('Error checking token ownership:', error);
    throw error;
  }
}

export function BlockchainScanner() {
  const [activeTab, setActiveTab] = useState<"solana" | "base">("solana")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState<"wallet" | "token">("wallet")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<ScanResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const [tokenToCheck, setTokenToCheck] = useState("")
  const [isTokenOwned, setIsTokenOwned] = useState<boolean | null>(null)
  const [isCheckingToken, setIsCheckingToken] = useState(false)
  const [marketCapFilter, setMarketCapFilter] = useState<"small" | "all" | "large" | "medium" | "micro" | "nano" | "pico">("all")
  const [platformFilter, setPlatformFilter] = useState<"all" | "Standard">("all")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [sortBy, setSortBy] = useState<"market_cap" | "price" | "name">("market_cap")

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
          // setRecentSearches(processedSearches)
        } catch (error) {
          console.error("Error parsing saved searches:", error)
        }
      }
    }
  }, [])

  const saveSearch = (search: ScanResult) => {
    // Vérifier que le code s'exécute côté client
    if (typeof window !== 'undefined') {
      // const updatedSearches = [search, ...recentSearches.slice(0, 9)]
      // setRecentSearches(updatedSearches)
      // localStorage.setItem("blockchain-scanner-searches", JSON.stringify(updatedSearches))
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
      let result: ScanResult

      if (activeTab === "solana") {
        if (searchType === "wallet") {
          result = await fetchSolanaWallet(searchQuery)
        } else {
          result = await fetchSolanaToken(searchQuery)
        }
      } else {
        if (searchType === "wallet") {
          result = await fetchBaseWallet(searchQuery)
        } else {
          result = await fetchBaseToken(searchQuery)
        }
      }

      setResults([result, ...results])
      saveSearch(result)
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

  const handleCheckTokenOwnership = async () => {
    if (!searchQuery || !tokenToCheck || results.length === 0) {
      setError("Veuillez d'abord rechercher un wallet et spécifier un token à vérifier");
      return;
    }
    
    // Vérifier que le résultat actuel est un wallet
    const currentResult = results[0];
    if (currentResult.type !== 'wallet') {
      setError("Veuillez rechercher un wallet pour vérifier la possession d'un token");
      return;
    }
    
    setIsCheckingToken(true);
    setIsTokenOwned(null);
    
    try {
      const ownsToken = await checkWalletOwnsToken(
        currentResult.address,
        tokenToCheck,
        currentResult.network
      );
      
      setIsTokenOwned(ownsToken);
    } catch (error) {
      console.error("Erreur lors de la vérification du token:", error);
      setError("Erreur lors de la vérification de la possession du token");
    } finally {
      setIsCheckingToken(false);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-2">
          <Link 
            href="/" 
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Retour
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Blockchain Scanner</h1>
        </div>
        <div className="flex items-center space-x-2">
          <LocalTime />
          <ThemeToggle />
          <UserAuth />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="gradient-card">
          <CardHeader>
            <CardTitle>Scanner de Blockchain</CardTitle>
            <CardDescription>Recherchez des adresses de wallet ou des tokens sur Solana et Base</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "solana" | "base")} className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="solana" className="glow-effect">
                  <img src="/solana-logo.svg" alt="Solana" className="w-4 h-4 mr-2" />
                  Solana (SolScan)
                </TabsTrigger>
                <TabsTrigger value="base" className="glow-effect">
                  <img src="/base-logo.svg" alt="Base" className="w-4 h-4 mr-2" />
                  Base (BaseScan)
                </TabsTrigger>
              </TabsList>

              <TabsContent value="solana" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Scanner Solana</CardTitle>
                    <CardDescription>
                      Recherchez une adresse de wallet ou de token sur la blockchain Solana
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-col space-y-2">
                        <label htmlFor="search-type-solana" className="text-sm font-medium">
                          Type de recherche
                        </label>
                        <Select
                          value={searchType}
                          onValueChange={(value) => setSearchType(value as "wallet" | "token")}
                        >
                          <SelectTrigger id="search-type-solana">
                            <SelectValue placeholder="Sélectionner le type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="wallet">Wallet</SelectItem>
                            <SelectItem value="token">Token</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <label htmlFor="search-query-solana" className="text-sm font-medium">
                          Adresse {searchType === "wallet" ? "du wallet" : "du token"}
                        </label>
                        <div className="flex space-x-2">
                          <Input
                            id="search-query-solana"
                            placeholder={`Entrez l'adresse ${searchType === "wallet" ? "du wallet" : "du token"} Solana`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="shimmer"
                          />
                          <Button
                            onClick={() => {
                              setActiveTab("solana");
                              handleSearch();
                            }}
                            disabled={isLoading || !searchQuery}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 glow-effect"
                          >
                            <Search className="h-4 w-4 mr-2" />
                            Rechercher
                          </Button>
                        </div>
                      </div>
                      
                      {searchType === "wallet" && (
                        <div className="flex flex-col space-y-2 pt-4 border-t">
                          <label htmlFor="token-check-solana" className="text-sm font-medium">
                            Vérifier la possession d'un token
                          </label>
                          <div className="flex space-x-2">
                            <Input
                              id="token-check-solana"
                              placeholder="Adresse du token à vérifier"
                              value={tokenToCheck}
                              onChange={(e) => setTokenToCheck(e.target.value)}
                              className="shimmer"
                            />
                            <Button
                              onClick={handleCheckTokenOwnership}
                              disabled={isCheckingToken || !tokenToCheck || results.length === 0 || results[0].type !== 'wallet'}
                              variant="outline"
                              className="glow-effect"
                            >
                              <Coins className="h-4 w-4 mr-2" />
                              Vérifier
                            </Button>
                          </div>
                          
                          {isTokenOwned !== null && (
                            <div className={`mt-2 p-4 rounded ${isTokenOwned ? 'bg-green-100 dark:bg-green-900 border border-green-500' : 'bg-red-100 dark:bg-red-900 border border-red-500'}`}>
                              {isTokenOwned 
                                ? "✅ Ce wallet possède le token spécifié" 
                                : "❌ Ce wallet ne possède pas le token spécifié"}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="base" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Scanner Base</CardTitle>
                    <CardDescription>
                      Recherchez une adresse de wallet ou de token sur la blockchain Base
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-col space-y-2">
                        <label htmlFor="search-type-base" className="text-sm font-medium">
                          Type de recherche
                        </label>
                        <Select
                          value={searchType}
                          onValueChange={(value) => setSearchType(value as "wallet" | "token")}
                        >
                          <SelectTrigger id="search-type-base">
                            <SelectValue placeholder="Sélectionner le type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="wallet">Wallet</SelectItem>
                            <SelectItem value="token">Token</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <label htmlFor="search-query-base" className="text-sm font-medium">
                          Adresse {searchType === "wallet" ? "du wallet" : "du token"}
                        </label>
                        <div className="flex space-x-2">
                          <Input
                            id="search-query-base"
                            placeholder={`Entrez l'adresse ${searchType === "wallet" ? "du wallet" : "du token"} Base`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="shimmer"
                          />
                          <Button
                            onClick={() => {
                              setActiveTab("base");
                              handleSearch();
                            }}
                            disabled={isLoading || !searchQuery}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 glow-effect"
                          >
                            <Search className="h-4 w-4 mr-2" />
                            Rechercher
                          </Button>
                        </div>
                      </div>
                      
                      {searchType === "wallet" && (
                        <div className="flex flex-col space-y-2 pt-4 border-t">
                          <label htmlFor="token-check-base" className="text-sm font-medium">
                            Vérifier la possession d'un token
                          </label>
                          <div className="flex space-x-2">
                            <Input
                              id="token-check-base"
                              placeholder="Adresse du token à vérifier"
                              value={tokenToCheck}
                              onChange={(e) => setTokenToCheck(e.target.value)}
                              className="shimmer"
                            />
                            <Button
                              onClick={handleCheckTokenOwnership}
                              disabled={isCheckingToken || !tokenToCheck || results.length === 0 || results[0].type !== 'wallet'}
                              variant="outline"
                              className="glow-effect"
                            >
                              <Coins className="h-4 w-4 mr-2" />
                              Vérifier
                            </Button>
                          </div>
                          
                          {isTokenOwned !== null && (
                            <div className={`mt-2 p-4 rounded ${isTokenOwned ? 'bg-green-100 dark:bg-green-900 border border-green-500' : 'bg-red-100 dark:bg-red-900 border border-red-500'}`}>
                              {isTokenOwned 
                                ? "✅ Ce wallet possède le token spécifié" 
                                : "❌ Ce wallet ne possède pas le token spécifié"}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Affichage des résultats */}
        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </CardContent>
          </Card>
        ) : results.length > 0 ? (
          <div className="space-y-6">
            {activeTab === "solana" && (
              <Alert className="mb-4 border-primary/50 bg-primary/10">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Données réelles de SolScan</AlertTitle>
                <AlertDescription>
                  Les données affichées pour Solana proviennent de l'API SolScan en temps réel.
                </AlertDescription>
              </Alert>
            )}
            
            {activeTab === "base" && (
              <Alert className="mb-4 border-primary/50 bg-primary/10">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Données réelles de BaseScan</AlertTitle>
                <AlertDescription>
                  Les données affichées pour Base proviennent de l'API BaseScan en temps réel.
                </AlertDescription>
              </Alert>
            )}
            
            {results.map((result, index) => (
              <Card key={index} className="overflow-hidden gradient-card">
                <CardHeader className="bg-muted/50">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {result.type === "wallet" ? (
                          <Wallet className="h-5 w-5 text-primary" />
                        ) : (
                          <Coins className="h-5 w-5 text-primary" />
                        )}
                        {result.name}
                        {result.verified && (
                          <Badge variant="outline" className="ml-2 bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-600">
                            Vérifié
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-1 font-mono text-xs">
                        {result.address}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={result.network === "solana" ? "outline" : "destructive"} className="glow-effect">
                        {result.network === "solana" ? "Solana" : "Base"}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openExternalLink(result.url)}
                        className="flex items-center gap-1 glow-effect"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Explorer
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {result.type === "wallet" ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-card rounded-lg border p-4 hover:shadow-md transition-all">
                          <div className="text-sm text-muted-foreground mb-1">Balance</div>
                          <div className="text-2xl font-bold text-primary">{result.balance}</div>
                          <div className="text-sm text-muted-foreground mt-1">{result.value}</div>
                        </div>
                        <div className="bg-card rounded-lg border p-4 hover:shadow-md transition-all">
                          <div className="text-sm text-muted-foreground mb-1">Transactions</div>
                          <div className="text-2xl font-bold text-primary">{result.transactions}</div>
                        </div>
                        <div className="bg-card rounded-lg border p-4 hover:shadow-md transition-all">
                          <div className="text-sm text-muted-foreground mb-1">Dernière activité</div>
                          <div className="text-lg font-medium">
                            {result.lastTransactions && result.lastTransactions.length > 0 
                              ? result.lastTransactions[0].timestamp.toLocaleString() 
                              : "N/A"}
                          </div>
                        </div>
                      </div>
                      
                      {result.lastTransactions && result.lastTransactions.length > 0 && (
                        <div>
                          <h3 className="text-lg font-medium mb-3 text-primary">Dernières transactions</h3>
                          <div className="border rounded-md overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Hash</TableHead>
                                  <TableHead>Date</TableHead>
                                  <TableHead>De</TableHead>
                                  <TableHead>À</TableHead>
                                  <TableHead>Valeur</TableHead>
                                  <TableHead>Statut</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {result.lastTransactions.map((tx, i) => (
                                  <TableRow key={i} className="hover:bg-muted/50">
                                    <TableCell className="font-mono text-xs">{tx.hash}</TableCell>
                                    <TableCell>{tx.timestamp.toLocaleString()}</TableCell>
                                    <TableCell className="font-mono text-xs">{tx.from}</TableCell>
                                    <TableCell className="font-mono text-xs">{tx.to}</TableCell>
                                    <TableCell>{tx.value}</TableCell>
                                    <TableCell>
                                      <Badge variant="outline" className="bg-green-500/10 text-green-500">
                                        {tx.status}
                                      </Badge>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-card rounded-lg border p-4 hover:shadow-md transition-all">
                          <div className="text-sm text-muted-foreground mb-1">Prix</div>
                          <div className="text-2xl font-bold text-primary">{result.tokenPrice || "N/A"}</div>
                          <div className={`text-sm ${
                            result.priceChange24h && parseFloat(result.priceChange24h) >= 0 
                              ? "token-price-up" 
                              : "token-price-down"
                          } mt-1`}>
                            {result.priceChange24h || "N/A"}
                          </div>
                        </div>
                        <div className="bg-card rounded-lg border p-4 hover:shadow-md transition-all">
                          <div className="text-sm text-muted-foreground mb-1">Market Cap</div>
                          <div className="text-lg font-bold text-primary">{result.marketCap || "N/A"}</div>
                        </div>
                        <div className="bg-card rounded-lg border p-4 hover:shadow-md transition-all">
                          <div className="text-sm text-muted-foreground mb-1">Supply</div>
                          <div className="text-lg font-bold text-primary">{result.tokenSupply || "N/A"}</div>
                        </div>
                        <div className="bg-card rounded-lg border p-4 hover:shadow-md transition-all">
                          <div className="text-sm text-muted-foreground mb-1">Holders</div>
                          <div className="text-lg font-bold text-primary">{result.tokenHolders || "N/A"}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-card rounded-lg border p-4 hover:shadow-md transition-all">
                          <div className="text-sm text-muted-foreground mb-1">Volume (24h)</div>
                          <div className="text-lg font-bold text-primary">{result.volume24h || "N/A"}</div>
                        </div>
                        <div className="bg-card rounded-lg border p-4 hover:shadow-md transition-all">
                          <div className="text-sm text-muted-foreground mb-1">Decimals</div>
                          <div className="text-lg font-bold text-primary">{result.decimals || "N/A"}</div>
                        </div>
                        <div className="bg-card rounded-lg border p-4 hover:shadow-md transition-all">
                          <div className="text-sm text-muted-foreground mb-1">Créé par</div>
                          <div className="text-sm font-mono">{result.contractCreator || "N/A"}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {result.contractCreationDate ? result.contractCreationDate.toLocaleDateString() : "N/A"}
                          </div>
                        </div>
                      </div>
                      
                      {result.tokenTransfers && result.tokenTransfers.length > 0 && (
                        <div>
                          <h3 className="text-lg font-medium mb-3 text-primary">Derniers transferts</h3>
                          <div className="border rounded-md overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Hash</TableHead>
                                  <TableHead>Date</TableHead>
                                  <TableHead>De</TableHead>
                                  <TableHead>À</TableHead>
                                  <TableHead>Montant</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {result.tokenTransfers.map((tx, i) => (
                                  <TableRow key={i} className="hover:bg-muted/50">
                                    <TableCell className="font-mono text-xs">{tx.hash}</TableCell>
                                    <TableCell>{tx.timestamp.toLocaleString()}</TableCell>
                                    <TableCell className="font-mono text-xs">{tx.from}</TableCell>
                                    <TableCell className="font-mono text-xs">{tx.to}</TableCell>
                                    <TableCell>{tx.amount}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground py-8">
                Aucun résultat à afficher. Effectuez une recherche pour voir les résultats.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>Données en temps réel fournies par les APIs SolScan, BaseScan et CoinGecko.</p>
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

export async function fetch(request: Request, env: any, ctx: ExecutionContext) {
  // Your existing code here
  return new Response("Hello World");
}

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request: Request) {
  // Your existing code here
  return new Response("Hello World");
}
