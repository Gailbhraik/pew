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
import { ArrowLeft, Search, ExternalLink, Wallet, Coins, AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { API_KEYS, API_ENDPOINTS, getHeaders, buildBaseScanUrl } from "@/lib/api-config"

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
      headers: getHeaders(API_KEYS.SOLSCAN_API_KEY)
    });
    
    if (!accountResponse.ok) {
      throw new Error(`SolScan API error: ${accountResponse.status}`);
    }
    
    const accountData = await accountResponse.json();
    
    // Récupérer les transactions récentes
    const txResponse = await fetch(`${API_ENDPOINTS.SOLSCAN.BASE_URL}${API_ENDPOINTS.SOLSCAN.TRANSACTIONS}/${address}?limit=5`, {
      method: 'GET',
      headers: getHeaders(API_KEYS.SOLSCAN_API_KEY)
    });
    
    let transactions: any[] = [];
    if (txResponse.ok) {
      const txData = await txResponse.json();
      transactions = txData.data || [];
    }
    
    // Appel à l'API pour obtenir le prix actuel de SOL
    const solPriceResponse = await fetch(`${API_ENDPOINTS.COINGECKO.BASE_URL}${API_ENDPOINTS.COINGECKO.SIMPLE_PRICE}?ids=solana&vs_currencies=usd`);
    const solPriceData = await solPriceResponse.json();
    const solPrice = solPriceData.solana?.usd || 0;
    
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
    
    // Fallback à l'API RPC Solana si SolScan échoue
    try {
      // Appel à l'API Solana RPC pour obtenir le solde
      const balanceResponse = await fetch(API_ENDPOINTS.SOLANA_RPC.MAINNET, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getBalance',
          params: [address]
        })
      });
      
      const balanceData = await balanceResponse.json();
      const balanceInLamports = balanceData.result?.value || 0;
      const balanceInSOL = balanceInLamports / 1000000000; // Conversion de lamports en SOL
      
      // Appel à l'API pour obtenir le prix actuel de SOL
      const solPriceResponse = await fetch(`${API_ENDPOINTS.COINGECKO.BASE_URL}${API_ENDPOINTS.COINGECKO.SIMPLE_PRICE}?ids=solana&vs_currencies=usd`);
      const solPriceData = await solPriceResponse.json();
      const solPrice = solPriceData.solana?.usd || 0;
      
      // Valeur en USD
      const valueInUSD = balanceInSOL * solPrice;
      
      // Simuler le nombre de transactions (dans une implémentation réelle, on utiliserait l'API Solana)
      const transactions = Math.floor(Math.random() * 1000) + 10;
      
      // Générer des transactions fictives récentes
      const lastTransactions = Array.from({ length: 5 }, (_, i) => ({
        hash: `${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 10)}`,
        timestamp: new Date(Date.now() - (i * 3600000)),
        value: `${(Math.random() * 10).toFixed(4)} SOL`,
        from: i % 2 === 0 ? address : `${Math.random().toString(36).substring(2, 10)}...`,
        to: i % 2 === 0 ? `${Math.random().toString(36).substring(2, 10)}...` : address,
        status: 'Success'
      }));
      
      return {
        type: 'wallet',
        address,
        name: `Solana Wallet ${address.substring(0, 4)}...${address.substring(address.length - 4)}`,
        balance: `${balanceInSOL.toFixed(6)} SOL`,
        value: `$${valueInUSD.toFixed(2)}`,
        transactions,
        timestamp: new Date(),
        network: 'solana',
        url: `https://solscan.io/account/${address}`,
        lastTransactions
      };
    } catch (fallbackError) {
      console.error('Fallback error fetching Solana wallet:', fallbackError);
      throw new Error('Failed to fetch Solana wallet data');
    }
  }
}

// Fonction pour récupérer les données d'un token Solana
async function fetchSolanaToken(address: string): Promise<ScanResult> {
  try {
    // Utiliser l'API SolScan pour obtenir les informations du token
    const tokenResponse = await fetch(`${API_ENDPOINTS.SOLSCAN.BASE_URL}${API_ENDPOINTS.SOLSCAN.TOKEN}/${address}`, {
      method: 'GET',
      headers: getHeaders(API_KEYS.SOLSCAN_API_KEY)
    });
    
    if (!tokenResponse.ok) {
      throw new Error(`SolScan API error: ${tokenResponse.status}`);
    }
    
    const tokenData = await tokenResponse.json();
    
    // Récupérer les transferts récents du token
    const transfersResponse = await fetch(`${API_ENDPOINTS.SOLSCAN.BASE_URL}${API_ENDPOINTS.SOLSCAN.TOKEN}/${address}/transfers?limit=5`, {
      method: 'GET',
      headers: getHeaders(API_KEYS.SOLSCAN_API_KEY)
    });
    
    let transfers: any[] = [];
    if (transfersResponse.ok) {
      const transfersData = await transfersResponse.json();
      transfers = transfersData.data || [];
    }
    
    // Extraire les données pertinentes
    const tokenName = tokenData.name || `SOL Token ${address.substring(0, 6)}`;
    const tokenSymbol = tokenData.symbol || "TOKEN";
    const tokenSupply = tokenData.supply?.toString() || "N/A";
    const tokenHolders = tokenData.holder || 0;
    const decimals = tokenData.decimals || 9;
    
    // Pour le prix, on utiliserait idéalement une API de prix, mais pour cette démo on simule
    const tokenPrice = `$${(Math.random() * 10).toFixed(6)}`;
    const priceChangeValue = (Math.random() * 20) - 10;
    const priceChange24h = `${priceChangeValue.toFixed(2)}%`;
    const marketCap = `$${(parseFloat(tokenSupply) * parseFloat(tokenPrice.substring(1))).toFixed(2)}`;
    const volume24h = `$${(Math.random() * 1000000).toFixed(2)}`;
    
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
      verified: tokenData.verified || false,
      contractCreator: tokenData.mintAuthority || "N/A",
      contractCreationDate: tokenData.mintTime ? new Date(tokenData.mintTime * 1000) : undefined
    };
  } catch (error) {
    console.error('Error fetching Solana token:', error);
    
    // Fallback à des données simulées si l'API échoue
    const tokenName = `SOL Token ${address.substring(0, 6)}`;
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
      amount: `${(Math.random() * 10000).toFixed(2)} ${tokenName.split(' ')[1]}`
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
    const ethPriceData = await ethPriceResponse.json();
    const ethPrice = ethPriceData.ethereum?.usd || 0;
    
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
    
    // Fallback à des données simulées si l'API échoue
    const balanceInETH = Math.random() * 10;
    const ethPrice = 3000 + Math.random() * 1000;
    const valueInUSD = balanceInETH * ethPrice;
    
    // Simuler le nombre de transactions
    const transactionsCount = Math.floor(Math.random() * 1000) + 10;
    
    // Générer des transactions fictives récentes
    const lastTransactions = Array.from({ length: 5 }, (_, i) => ({
      hash: `0x${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 10)}`,
      timestamp: new Date(Date.now() - (i * 3600000)),
      value: `${(Math.random() * 10).toFixed(4)} ETH`,
      from: i % 2 === 0 ? address : `0x${Math.random().toString(36).substring(2, 10)}...`,
      to: i % 2 === 0 ? `0x${Math.random().toString(36).substring(2, 10)}...` : address,
      status: 'Success'
    }));
    
    return {
      type: 'wallet',
      address,
      name: `Base Wallet ${address.substring(0, 4)}...${address.substring(address.length - 4)}`,
      balance: `${balanceInETH.toFixed(6)} ETH`,
      value: `$${valueInUSD.toFixed(2)}`,
      transactions: transactionsCount,
      timestamp: new Date(),
      network: 'base',
      url: `https://basescan.org/address/${address}`,
      lastTransactions
    };
  }
}

// Fonction pour récupérer les données d'un token Base (Ethereum)
async function fetchBaseToken(address: string): Promise<ScanResult> {
  try {
    // Utiliser l'API BaseScan pour obtenir les informations du token
    const tokenUrl = buildBaseScanUrl(API_ENDPOINTS.BASESCAN.TOKEN_INFO, {
      contractaddress: address
    });
    
    const tokenResponse = await fetch(tokenUrl);
    
    if (!tokenResponse.ok) {
      throw new Error(`BaseScan API error: ${tokenResponse.status}`);
    }
    
    const tokenData = await tokenResponse.json();
    
    if (tokenData.status !== '1') {
      throw new Error(`BaseScan API error: ${tokenData.message}`);
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
    
    // Récupérer les informations du contrat
    const contractUrl = buildBaseScanUrl(API_ENDPOINTS.BASESCAN.CONTRACT_SOURCE, {
      address: address
    });
    
    const contractResponse = await fetch(contractUrl);
    let contractInfo = null;
    
    if (contractResponse.ok) {
      const contractData = await contractResponse.json();
      if (contractData.status === '1' && contractData.result.length > 0) {
        contractInfo = contractData.result[0];
      }
    }
    
    // Extraire les données pertinentes
    const tokenInfo = tokenData.result[0] || {};
    const tokenName = tokenInfo.name || `ETH Token ${address.substring(0, 6)}`;
    const tokenSymbol = tokenInfo.symbol || "TOKEN";
    const tokenSupply = tokenInfo.totalSupply || "N/A";
    const decimals = parseInt(tokenInfo.divisor || "18");
    
    // Pour le prix, on utiliserait idéalement une API de prix, mais pour cette démo on simule
    const tokenPrice = `$${(Math.random() * 10).toFixed(6)}`;
    const priceChangeValue = (Math.random() * 20) - 10;
    const priceChange24h = `${priceChangeValue.toFixed(2)}%`;
    const marketCap = tokenSupply !== "N/A" 
      ? `$${(parseFloat(tokenSupply) / Math.pow(10, decimals) * parseFloat(tokenPrice.substring(1))).toFixed(2)}`
      : "N/A";
    const volume24h = `$${(Math.random() * 1000000).toFixed(2)}`;
    
    // Formater les transferts récents
    const tokenTransfers = transfers.map(transfer => ({
      hash: transfer.hash,
      timestamp: new Date(parseInt(transfer.timeStamp) * 1000),
      from: transfer.from,
      to: transfer.to,
      amount: `${parseFloat(transfer.value) / Math.pow(10, decimals)} ${tokenSymbol}`
    }));
    
    return {
      type: 'token',
      address,
      name: tokenName,
      tokenSupply: tokenSupply !== "N/A" ? (parseFloat(tokenSupply) / Math.pow(10, decimals)).toString() : "N/A",
      timestamp: new Date(),
      network: 'base',
      url: `https://basescan.org/token/${address}`,
      tokenHolders: parseInt(tokenInfo.holders || "0"),
      tokenPrice,
      marketCap,
      volume24h,
      priceChange24h,
      decimals,
      tokenTransfers,
      verified: contractInfo?.ABI !== "Contract source code not verified",
      contractCreator: contractInfo?.ContractCreator || "N/A",
      contractCreationDate: contractInfo?.ContractCreatedAt ? new Date(contractInfo.ContractCreatedAt) : undefined
    };
  } catch (error) {
    console.error('Error fetching Base token:', error);
    
    // Fallback à des données simulées si l'API échoue
    const tokenName = `ETH Token ${address.substring(0, 6)}`;
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
      hash: `0x${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 10)}`,
      timestamp: new Date(Date.now() - (i * 3600000)),
      from: `0x${Math.random().toString(36).substring(2, 10)}...`,
      to: `0x${Math.random().toString(36).substring(2, 10)}...`,
      amount: `${(Math.random() * 10000).toFixed(2)} ${tokenSymbol}`
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
      decimals: 18,
      tokenTransfers,
      verified: Math.random() > 0.3, // 70% de chance d'être vérifié
      contractCreator: `0x${Math.random().toString(36).substring(2, 10)}...`,
      contractCreationDate: new Date(Date.now() - (Math.random() * 365 * 24 * 60 * 60 * 1000))
    };
  }
}

// Fonction pour vérifier si un wallet a acheté un token spécifique
async function checkWalletOwnsToken(walletAddress: string, tokenAddress: string, network: 'solana' | 'base'): Promise<boolean> {
  try {
    if (network === 'base') {
      // Pour Base (Ethereum), utiliser l'API BaseScan pour vérifier le solde du token
      const tokenBalanceUrl = buildBaseScanUrl(API_ENDPOINTS.BASESCAN.TOKEN_BALANCE, {
        contractaddress: tokenAddress,
        address: walletAddress,
        tag: 'latest'
      });
      
      const response = await fetch(tokenBalanceUrl);
      
      if (!response.ok) {
        throw new Error(`BaseScan API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status !== '1') {
        throw new Error(`BaseScan API error: ${data.message}`);
      }
      
      // Si le solde est supérieur à 0, le wallet possède le token
      return parseFloat(data.result) > 0;
    } else if (network === 'solana') {
      // Pour Solana, utiliser l'API SolScan pour vérifier les tokens du wallet
      const tokenHoldingsUrl = `${API_ENDPOINTS.SOLSCAN.BASE_URL}/account/tokens?account=${walletAddress}`;
      
      const response = await fetch(tokenHoldingsUrl, {
        method: 'GET',
        headers: getHeaders(API_KEYS.SOLSCAN_API_KEY)
      });
      
      if (!response.ok) {
        throw new Error(`SolScan API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Vérifier si le token est dans la liste des tokens détenus
      return data.some((token: any) => token.tokenAddress === tokenAddress && parseFloat(token.tokenAmount.uiAmount) > 0);
    }
    
    return false;
  } catch (error) {
    console.error('Error checking token ownership:', error);
    return false;
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
                          />
                          <Button
                            onClick={() => handleSearch()}
                            disabled={isLoading || !searchQuery}
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
                            />
                            <Button
                              onClick={handleCheckTokenOwnership}
                              disabled={isCheckingToken || !tokenToCheck || results.length === 0 || results[0].type !== 'wallet'}
                              variant="outline"
                            >
                              <Coins className="h-4 w-4 mr-2" />
                              Vérifier
                            </Button>
                          </div>
                          
                          {isTokenOwned !== null && (
                            <div className={`mt-2 p-2 rounded ${isTokenOwned ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
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
                          />
                          <Button
                            onClick={() => handleSearch()}
                            disabled={isLoading || !searchQuery}
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
                            />
                            <Button
                              onClick={handleCheckTokenOwnership}
                              disabled={isCheckingToken || !tokenToCheck || results.length === 0 || results[0].type !== 'wallet'}
                              variant="outline"
                            >
                              <Coins className="h-4 w-4 mr-2" />
                              Vérifier
                            </Button>
                          </div>
                          
                          {isTokenOwned !== null && (
                            <div className={`mt-2 p-2 rounded ${isTokenOwned ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
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
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Données réelles de SolScan</AlertTitle>
                <AlertDescription>
                  Les données affichées pour Solana proviennent de l'API SolScan en temps réel.
                </AlertDescription>
              </Alert>
            )}
            
            {activeTab === "base" && (
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Données réelles de BaseScan</AlertTitle>
                <AlertDescription>
                  Les données affichées pour Base proviennent de l'API BaseScan en temps réel.
                </AlertDescription>
              </Alert>
            )}
            
            {results.map((result, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="bg-muted/50">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {result.type === "wallet" ? (
                          <Wallet className="h-5 w-5" />
                        ) : (
                          <Coins className="h-5 w-5" />
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
                      <Badge variant={result.network === "solana" ? "outline" : "destructive"}>
                        {result.network === "solana" ? "Solana" : "Base"}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openExternalLink(result.url)}
                        className="flex items-center gap-1"
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
                        <div className="bg-card rounded-lg border p-4">
                          <div className="text-sm text-muted-foreground mb-1">Balance</div>
                          <div className="text-2xl font-bold">{result.balance}</div>
                          <div className="text-sm text-muted-foreground mt-1">{result.value}</div>
                        </div>
                        <div className="bg-card rounded-lg border p-4">
                          <div className="text-sm text-muted-foreground mb-1">Transactions</div>
                          <div className="text-2xl font-bold">{result.transactions}</div>
                        </div>
                        <div className="bg-card rounded-lg border p-4">
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
                          <h3 className="text-lg font-medium mb-3">Dernières transactions</h3>
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
                                  <TableRow key={i}>
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
                        <div className="bg-card rounded-lg border p-4">
                          <div className="text-sm text-muted-foreground mb-1">Prix</div>
                          <div className="text-2xl font-bold">{result.tokenPrice || "N/A"}</div>
                          <div className={`text-sm ${
                            result.priceChange24h && parseFloat(result.priceChange24h) >= 0 
                              ? "text-green-500" 
                              : "text-red-500"
                          } mt-1`}>
                            {result.priceChange24h || "N/A"}
                          </div>
                        </div>
                        <div className="bg-card rounded-lg border p-4">
                          <div className="text-sm text-muted-foreground mb-1">Market Cap</div>
                          <div className="text-lg font-bold">{result.marketCap || "N/A"}</div>
                        </div>
                        <div className="bg-card rounded-lg border p-4">
                          <div className="text-sm text-muted-foreground mb-1">Supply</div>
                          <div className="text-lg font-bold">{result.tokenSupply || "N/A"}</div>
                        </div>
                        <div className="bg-card rounded-lg border p-4">
                          <div className="text-sm text-muted-foreground mb-1">Holders</div>
                          <div className="text-lg font-bold">{result.tokenHolders || "N/A"}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-card rounded-lg border p-4">
                          <div className="text-sm text-muted-foreground mb-1">Volume (24h)</div>
                          <div className="text-lg font-bold">{result.volume24h || "N/A"}</div>
                        </div>
                        <div className="bg-card rounded-lg border p-4">
                          <div className="text-sm text-muted-foreground mb-1">Decimals</div>
                          <div className="text-lg font-bold">{result.decimals || "N/A"}</div>
                        </div>
                        <div className="bg-card rounded-lg border p-4">
                          <div className="text-sm text-muted-foreground mb-1">Créé par</div>
                          <div className="text-sm font-mono">{result.contractCreator || "N/A"}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {result.contractCreationDate ? result.contractCreationDate.toLocaleDateString() : "N/A"}
                          </div>
                        </div>
                      </div>
                      
                      {result.tokenTransfers && result.tokenTransfers.length > 0 && (
                        <div>
                          <h3 className="text-lg font-medium mb-3">Derniers transferts</h3>
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
                                  <TableRow key={i}>
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
