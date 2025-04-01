"use client"

import { useEffect, useState } from "react"

export function ParticleLogo() {
  return (
    <div className="relative h-16 w-16 md:h-20 md:w-20 flex items-center justify-center">
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="h-10 w-10 md:h-12 md:w-12 flex items-center justify-center relative">
          <span className="relative z-20 font-extrabold text-orange-500 fire-text text-2xl md:text-3xl animate-flicker">
            S
          </span>
          {/* Fire effect layers */}
          <div className="absolute inset-0 z-10 -mt-1 fire-base animate-fire-slow"></div>
          <div className="absolute inset-0 z-10 -mt-2 fire-base animate-fire-med"></div>
          <div className="absolute inset-0 z-10 -mt-3 fire-base animate-fire-fast"></div>
          <div className="absolute inset-0 z-10 fire-glow blur-md animate-pulse-fire"></div>
        </div>
      </div>
    </div>
  )
}

// Fire animations to add to tailwind.config.ts under "extend":
// keyframes: {
//   flicker: {
//     '0%, 100%': { opacity: '1' },
//     '25%': { opacity: '0.85' },
//     '50%': { opacity: '0.9' },
//     '75%': { opacity: '0.95' }
//   },
//   fire: {
//     '0%, 100%': { transform: 'translateY(0) scale(1)' },
//     '50%': { transform: 'translateY(-20%) scale(1.1)' }
//   }
// },
// animation: {
//   'flicker': 'flicker 3s infinite alternate',
//   'fire-slow': 'fire 4s ease-in-out infinite',
//   'fire-med': 'fire 3s ease-in-out infinite alternate',
//   'fire-fast': 'fire 2s ease-in-out infinite',
//   'pulse-fire': 'pulse 2s ease-in-out infinite'
// },

