"use client"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"

declare global {
  interface Window {
    TradingView: any
  }
}

interface TradingViewEmbedProps {
  symbol: string
}

export default function TradingViewEmbed({ symbol }: TradingViewEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scriptLoadedRef = useRef<boolean>(false)
  const widgetRef = useRef<any>(null)
  const { theme } = useTheme()
  const [interval, setInterval] = useState<string>("D")
  const [scriptError, setScriptError] = useState<boolean>(false)

  // Load TradingView Widget script
  useEffect(() => {
    if (!scriptLoadedRef.current) {
      const script = document.createElement("script")
      script.src = "https://s3.tradingview.com/tv.js"
      script.async = true
      script.onload = () => {
        scriptLoadedRef.current = true
        setScriptError(false)
        initializeWidget()
      }
      script.onerror = () => {
        console.error("Failed to load TradingView script")
        setScriptError(true)
      }
      document.body.appendChild(script)

      return () => {
        if (script.parentNode) {
          document.body.removeChild(script)
        }
      }
    } else {
      initializeWidget()
    }
  }, [symbol, interval, theme])

  // Initialize or update the TradingView widget
  const initializeWidget = () => {
    if (!scriptLoadedRef.current || !containerRef.current || !window.TradingView) {
      console.log("Cannot initialize widget: script not loaded or container not ready")
      return
    }

    try {
      // If widget exists, remove it
      if (widgetRef.current) {
        containerRef.current.innerHTML = ""
      }

      // Create new widget
      widgetRef.current = new window.TradingView.widget({
        container_id: "tradingview-embed",
        autosize: true,
        symbol: symbol,
        interval: interval,
        timezone: "Etc/UTC",
        theme: theme === "dark" ? "dark" : "light",
        style: "1",
        locale: "fr",  // Changed to French
        toolbar_bg: theme === "dark" ? "#2B2B43" : "#f1f3f6",
        enable_publishing: false,
        withdateranges: true,
        hide_side_toolbar: false,
        allow_symbol_change: false,
        studies: ["RSI@tv-basicstudies", "MACDHisto@tv-basicstudies"],
        show_popup_button: true,
        popup_width: "1000",
        popup_height: "650",
      })
    } catch (error) {
      console.error("Failed to initialize TradingView widget:", error)
    }
  }

  // Interval options
  const intervalOptions = [
    { value: "1", label: "1m" },
    { value: "5", label: "5m" },
    { value: "15", label: "15m" },
    { value: "30", label: "30m" },
    { value: "60", label: "1h" },
    { value: "D", label: "1d" },
    { value: "W", label: "1w" },
    { value: "M", label: "1M" },
  ]

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <div className="inline-flex items-center rounded-md border border-input bg-transparent p-1">
          {intervalOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setInterval(option.value)}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 py-1 text-xs font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                interval === option.value
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted hover:text-muted-foreground"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      {scriptError ? (
        <div className="flex flex-col items-center justify-center h-[420px] border rounded-md bg-muted/10 p-4">
          <p className="text-center text-muted-foreground mb-2">
            Impossible de charger le graphique TradingView.
          </p>
          <button 
            onClick={() => {
              scriptLoadedRef.current = false;
              setScriptError(false);
              // Retry loading script
              const script = document.createElement("script");
              script.src = "https://s3.tradingview.com/tv.js";
              script.async = true;
              script.onload = () => {
                scriptLoadedRef.current = true;
                setScriptError(false);
                initializeWidget();
              };
              script.onerror = () => setScriptError(true);
              document.body.appendChild(script);
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
          >
            Réessayer
          </button>
        </div>
      ) : (
        <div 
          id="tradingview-embed" 
          ref={containerRef} 
          style={{ height: "420px", width: "100%" }}
          className="border rounded-md"
        />
      )}
    </div>
  )
} 