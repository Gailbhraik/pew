import type { Metadata } from "next"
import { LowcapExplorer } from "@/components/lowcap-explorer"

export const metadata: Metadata = {
  title: "Lowcap Explorer | Saperlipocrypto",
  description: "Discover and track low market cap cryptocurrencies on Solana and Base blockchains",
}

export default function LowcapPage() {
  return (
    <main className="min-h-screen bg-background">
      <LowcapExplorer />
    </main>
  )
}

