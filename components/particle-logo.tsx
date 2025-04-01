"use client"

import { useCallback, useEffect, useState } from "react"
import Particles from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import type { Engine } from "@tsparticles/engine"

export function ParticleLogo() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine)
  }, [])

  if (!mounted) return null

  return (
    <div className="relative h-16 w-16 md:h-20 md:w-20 flex items-center justify-center">
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="h-10 w-10 md:h-12 md:w-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
          S
        </div>
      </div>
      <Particles
        id="crypto-logo-particles"
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          particles: {
            color: {
              value: ["#FFD700", "#32CD32", "#4169E1"],
            },
            links: {
              enable: true,
              distance: 150,
              color: "#ffffff",
              opacity: 0.5,
              width: 1,
            },
            move: {
              enable: true,
              speed: 2,
            },
            number: {
              value: 40,
            },
            opacity: {
              value: 0.8,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 5 },
            },
          },
        }}
        className="h-full w-full"
      />
    </div>
  )
}

