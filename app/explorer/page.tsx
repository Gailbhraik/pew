import { LowcapExplorer } from "@/components/lowcap-explorer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Saperlipocrypto | Blockchain Explorer",
  description: "Explore cryptocurrencies on Solana and Base networks with Saperlipocrypto's Blockchain Explorer.",
}

export default function ExplorerPage() {
  return (
    <main className="min-h-screen bg-background">
      <LowcapExplorer />
    </main>
  )
}
