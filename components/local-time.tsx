"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"

export function LocalTime() {
  const [time, setTime] = useState<Date>(new Date())
  const [timeZone, setTimeZone] = useState<string>("")

  useEffect(() => {
    // Mettre à jour l'heure chaque seconde
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    // Obtenir le fuseau horaire de l'utilisateur
    try {
      setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone)
    } catch (error) {
      console.error("Error getting timezone:", error)
    }

    return () => {
      clearInterval(timer)
    }
  }, [])

  const formattedTime = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(time)

  return (
    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <Clock className="h-4 w-4" />
      <span>{formattedTime}</span>
      {timeZone && <span className="hidden md:inline-block">({timeZone})</span>}
    </div>
  )
}

