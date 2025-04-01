"use client"

import { useState, useEffect } from "react"
import { ArrowRightLeft, RefreshCw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import type { Crypto } from "@/components/crypto-tracker"

interface CryptoConverterProps {
  cryptos: Crypto[]
}

export function CryptoConverter({ cryptos }: CryptoConverterProps) {
  const [amount, setAmount] = useState<string>("100")
  const [fromCurrency, setFromCurrency] = useState<string>("USD")
  const [toCrypto, setToCrypto] = useState<string>("")
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null)

  // Liste des devises fiat
  const fiatCurrencies = [
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥" },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$" },
    { code: "CHF", name: "Swiss Franc", symbol: "Fr" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
    { code: "INR", name: "Indian Rupee", symbol: "₹" },
    { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  ]

  // Trier les cryptos par capitalisation boursière
  const sortedCryptos = [...cryptos].sort((a, b) => b.market_cap - a.market_cap)

  // Sélectionner Bitcoin par défaut
  useEffect(() => {
    if (sortedCryptos.length > 0 && !toCrypto) {
      const bitcoin = sortedCryptos.find((crypto) => crypto.id === "bitcoin")
      if (bitcoin) {
        setToCrypto(bitcoin.id)
        setSelectedCrypto(bitcoin)
      } else {
        setToCrypto(sortedCryptos[0].id)
        setSelectedCrypto(sortedCryptos[0])
      }
    }
  }, [sortedCryptos, toCrypto])

  // Mettre à jour la crypto sélectionnée lorsque l'ID change
  useEffect(() => {
    if (toCrypto) {
      const crypto = cryptos.find((c) => c.id === toCrypto)
      if (crypto) {
        setSelectedCrypto(crypto)
      }
    }
  }, [toCrypto, cryptos])

  // Effectuer la conversion
  const convertCurrency = () => {
    setLoading(true)

    // Simuler un délai de chargement
    setTimeout(() => {
      if (selectedCrypto && amount) {
        // Taux de conversion fictifs pour les devises autres que USD
        const exchangeRates: Record<string, number> = {
          USD: 1,
          EUR: 0.92,
          GBP: 0.78,
          JPY: 150.5,
          CAD: 1.35,
          AUD: 1.48,
          CHF: 0.89,
          CNY: 7.2,
          INR: 83.5,
          BRL: 5.1,
        }

        const rate = exchangeRates[fromCurrency] || 1
        const amountInUSD = Number.parseFloat(amount) / rate
        const result = amountInUSD / selectedCrypto.current_price

        setConvertedAmount(result)
      }
      setLoading(false)
    }, 500)
  }

  // Inverser la conversion
  const swapCurrencies = () => {
    if (selectedCrypto && convertedAmount) {
      // Convertir de crypto à fiat
      setAmount(convertedAmount.toString())
      // Réinitialiser pour une nouvelle conversion
      setConvertedAmount(null)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5" />
          Currency Converter
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">From</label>
              <div className="flex gap-2">
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {fiatCurrencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        <div className="flex items-center gap-2">
                          <span>{currency.symbol}</span>
                          <span>{currency.code}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">To</label>
              <div className="flex gap-2">
                <Select value={toCrypto} onValueChange={setToCrypto}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select cryptocurrency" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortedCryptos.map((crypto) => (
                      <SelectItem key={crypto.id} value={crypto.id}>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full overflow-hidden">
                            <img
                              src={
                                crypto.image ||
                                `/placeholder.svg?height=16&width=16&text=${crypto.symbol.toUpperCase()}`
                              }
                              alt={crypto.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = `/placeholder.svg?height=16&width=16&text=${crypto.symbol.toUpperCase()}`
                              }}
                            />
                          </div>
                          <span>
                            {crypto.name} ({crypto.symbol.toUpperCase()})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button onClick={convertCurrency} disabled={loading || !amount || !toCrypto}>
              {loading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
              Convert
            </Button>
            <Button variant="outline" onClick={swapCurrencies} disabled={!convertedAmount}>
              <ArrowRightLeft className="h-4 w-4 mr-2" />
              Swap
            </Button>
          </div>

          {loading ? (
            <div className="mt-4">
              <Skeleton className="h-8 w-full" />
            </div>
          ) : convertedAmount ? (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">
                  {amount} {fromCurrency} =
                </div>
                <div className="text-2xl font-bold">
                  {convertedAmount.toLocaleString(undefined, { maximumFractionDigits: 8 })}{" "}
                  {selectedCrypto?.symbol.toUpperCase()}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  1 {selectedCrypto?.symbol.toUpperCase()} ={" "}
                  {selectedCrypto?.current_price.toLocaleString(undefined, { maximumFractionDigits: 2 })} {fromCurrency}
                </div>
              </div>
            </div>
          ) : null}

          {selectedCrypto && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-muted-foreground">Market Cap</div>
                <div className="font-medium">${selectedCrypto.market_cap.toLocaleString()}</div>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-muted-foreground">24h Change</div>
                <div
                  className={`font-medium ${selectedCrypto.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {selectedCrypto.price_change_percentage_24h >= 0 ? "+" : ""}
                  {selectedCrypto.price_change_percentage_24h.toFixed(2)}%
                </div>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-muted-foreground">24h Volume</div>
                <div className="font-medium">${selectedCrypto.total_volume.toLocaleString()}</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

