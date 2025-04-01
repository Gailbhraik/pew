"use client"

import { useEffect, useState } from "react"

export function ParticleLogo() {
  return (
    <div className="relative h-16 w-16 md:h-20 md:w-20 flex items-center justify-center">
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="h-10 w-10 md:h-12 md:w-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
          S
        </div>
      </div>
    </div>
  )
}

