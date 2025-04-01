import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/hooks/use-auth"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Saperlipocrypto | Track Cryptocurrencies",
  description: "Track and analyze cryptocurrency markets with real-time data and charts",
  icons: {
    icon: "/favicon.ico",
    apple: "/smiling-ape-logo.png",
  },
  openGraph: {
    title: "Saperlipocrypto | Track Cryptocurrencies",
    description: "Track and analyze cryptocurrency markets with real-time data and charts",
    url: "https://saperlipocrypto.xyz",
    siteName: "Saperlipocrypto",
    images: [
      {
        url: "/smiling-ape-logo.png",
        width: 800,
        height: 600,
        alt: "Saperlipocrypto Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/smiling-ape-logo.png" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            {children}
            <Toaster />
            <Analytics />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'