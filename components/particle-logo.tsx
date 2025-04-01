"use client"

import { useEffect, useState } from "react"

export function ParticleLogo() {
  return (
    <div className="relative h-16 w-16 md:h-20 md:w-20 flex items-center justify-center">
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="h-10 w-10 md:h-12 md:w-12 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg relative overflow-hidden animate-pulse transition-all duration-500 hover:scale-110 shadow-lg hover:shadow-xl">
          <span className="relative z-10 animate-colorShift font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 text-xl md:text-2xl">
            S
          </span>
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 via-pink-600 to-blue-600 opacity-70 animate-spin-slow"></div>
          <div className="absolute -inset-1 bg-gradient-to-bl from-blue-400 via-purple-500 to-pink-500 opacity-30 blur-sm animate-pulse-slow"></div>
        </div>
      </div>
    </div>
  )
}

// Add these animation classes to your tailwind.config.ts under "extend"
// animation: {
//   'spin-slow': 'spin 8s linear infinite',
//   'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
//   'colorShift': 'colorShift 8s infinite alternate',
// },
// keyframes: {
//   colorShift: {
//     '0%': { filter: 'hue-rotate(0deg)' },
//     '100%': { filter: 'hue-rotate(360deg)' },
//   },
// },

