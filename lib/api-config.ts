// Configuration des API pour les services blockchain
// Note: Dans un environnement de production, ces clés devraient être stockées dans des variables d'environnement

export const API_KEYS = {
  // Clé API pour SolScan
  SOLSCAN_API_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOjE3MzIxMDQwNjAxNjksImVtYWlsIjoicmFwaG91ZzhAZ21haWwuY29tIiwiYWN0aW9uIjoidG9rZW4tYXBpIiwiYXBpVmVyc2lvbiI6InYyIiwiaWF0IjoxNzMyMTA0MDYwfQ.EQntgCA-S66rAvshqUKmK95n3z6i9uxcpIhsEMo_ESw",
  
  // Autres clés API peuvent être ajoutées ici
  BASESCAN_API_KEY: "", // À remplir si vous avez une clé API pour BaseScan
}

// Configuration des endpoints API
export const API_ENDPOINTS = {
  // SolScan API
  SOLSCAN: {
    BASE_URL: "https://public-api.solscan.io",
    ACCOUNT: "/account", // Endpoint pour les informations de compte
    TOKEN: "/token", // Endpoint pour les informations de token
    TRANSACTIONS: "/account/transactions", // Endpoint pour les transactions d'un compte
  },
  
  // Solana RPC API
  SOLANA_RPC: {
    MAINNET: "https://api.mainnet-beta.solana.com",
  },
  
  // BaseScan API (si disponible)
  BASESCAN: {
    BASE_URL: "https://api.basescan.org/api",
  },
  
  // CoinGecko API pour les prix
  COINGECKO: {
    BASE_URL: "https://api.coingecko.com/api/v3",
    SIMPLE_PRICE: "/simple/price",
  }
}

// Headers pour les requêtes API
export const getHeaders = (apiKey?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`
  }
  
  return headers
}
