"use client"

import { Star, StarOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Crypto } from "@/components/crypto-tracker"

interface CryptoCardProps {
  crypto: Crypto
  isFavorite: boolean
  onSelect: () => void
  onToggleFavorite: () => void
}

export default function CryptoCard({ crypto, isFavorite, onSelect, onToggleFavorite }: CryptoCardProps) {
  const priceChangeIsPositive = crypto.price_change_percentage_24h > 0

  return (
    <div
      className="flex items-center justify-between p-4 border-b hover:bg-accent/50 cursor-pointer transition-colors"
      onClick={onSelect}
    >
      <div className="flex items-center gap-3">
        <img
          src={crypto.image || `/placeholder.svg?height=32&width=32&text=${crypto.symbol.toUpperCase()}`}
          alt={crypto.name}
          className="w-8 h-8 rounded-full"
          onError={(e) => {
            e.currentTarget.src = `/placeholder.svg?height=32&width=32&text=${crypto.symbol.toUpperCase()}`
          }}
        />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{crypto.name}</span>
            {crypto.blockchain === "solana" && (
              <Badge
                variant="outline"
                className="text-[10px] h-4 px-1 bg-purple-100 dark:bg-purple-900 border-purple-200 dark:border-purple-800"
              >
                SOL
              </Badge>
            )}
            {crypto.is_memecoin && (
              <Badge
                variant="outline"
                className="text-[10px] h-4 px-1 bg-yellow-100 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-800"
              >
                MEME
              </Badge>
            )}
          </div>
          <div className="text-xs text-muted-foreground uppercase">{crypto.symbol}</div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="font-medium">
            ${crypto.current_price.toLocaleString(undefined, { maximumFractionDigits: 6 })}
          </div>
          <div className={`text-xs ${priceChangeIsPositive ? "text-green-500" : "text-red-500"}`}>
            {priceChangeIsPositive ? "+" : ""}
            {crypto.price_change_percentage_24h.toFixed(2)}%
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite()
          }}
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          {isFavorite ? <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" /> : <StarOff className="h-5 w-5" />}
        </button>
      </div>
    </div>
  )
}

