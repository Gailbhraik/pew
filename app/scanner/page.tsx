import { BlockchainScanner } from "@/components/blockchain-scanner"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Saperlipocrypto | Blockchain Scanner",
  description: "Scan and explore wallets and tokens on Solana and Base blockchains.",
}

export default function ScannerPage() {
  return (
    <main className="min-h-screen bg-background">
      <BlockchainScanner />
    </main>
  )
}
