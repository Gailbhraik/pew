// Configuration des clés API et des endpoints pour les différentes API utilisées

// Clés API
export const API_KEYS = {
  SOLSCAN_API_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOjE2ODA2MjcyMzI3MzMsImVtYWlsIjoiYWxleGlzLmJlcnRyYW5kLjIwMDBAZ21haWwuY29tIiwiYWN0aW9uIjoidG9rZW4tYXBpLWtleSJ9.QyAuTz9Jx4JjQMCqfBMm7-R0SR7cd_8_bLJ_xb7mN-o",
  BASESCAN_API_KEY: "8D6Z56YIUIF466YQX7UMN17JURZRVFKDFU"
};

// Endpoints API
export const API_ENDPOINTS = {
  // Endpoints SolScan
  SOLSCAN: {
    BASE_URL: "https://api.solscan.io",
    ACCOUNT: "/account",
    TRANSACTIONS: "/account/transaction",
    TOKEN: "/token",
    TOKEN_HOLDERS: "/token/holders",
    TOKEN_META: "/token/meta"
  },
  
  // Endpoints BaseScan (Ethereum Base)
  BASESCAN: {
    BASE_URL: "https://api.basescan.org/api",
    ACCOUNT_BALANCE: "?module=account&action=balance",
    TOKEN_BALANCE: "?module=account&action=tokenbalance",
    TRANSACTIONS: "?module=account&action=txlist",
    TOKEN_TRANSFERS: "?module=account&action=tokentx",
    TOKEN_INFO: "?module=token&action=tokeninfo",
    CONTRACT_SOURCE: "?module=contract&action=getsourcecode"
  },
  
  // Endpoints Solana RPC
  SOLANA_RPC: {
    MAINNET: "https://api.mainnet-beta.solana.com"
  },
  
  // Endpoints CoinGecko
  COINGECKO: {
    BASE_URL: "https://api.coingecko.com/api/v3",
    SIMPLE_PRICE: "/simple/price",
    COINS_LIST: "/coins/list",
    COIN_DATA: "/coins"
  }
};

// Fonction pour générer les headers avec la clé API
export function getHeaders(apiKey?: string) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  
  if (apiKey) {
    headers['token'] = apiKey;
  }
  
  return headers;
}

// Fonction pour construire une URL BaseScan avec la clé API
export function buildBaseScanUrl(endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(`${API_ENDPOINTS.BASESCAN.BASE_URL}${endpoint}`);
  
  // Ajouter la clé API
  url.searchParams.append('apikey', API_KEYS.BASESCAN_API_KEY);
  
  // Ajouter les autres paramètres
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  
  return url.toString();
}
