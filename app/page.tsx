import CryptoTracker from "@/components/crypto-tracker"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Saperlipocrypto | Track and Analyze Cryptocurrencies",
  description:
    "Track cryptocurrency prices, charts, and market data in real-time. Analyze trends and manage your crypto portfolio with Saperlipocrypto.",
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <CryptoTracker />
    </main>
  )
}

