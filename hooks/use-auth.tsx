"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type User = {
  id: string
  name: string
  email: string
  favorites: string[]
}

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => boolean
  register: (name: string, email: string, password: string) => boolean
  logout: () => void
  updateFavorites: (favorites: string[]) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Charger l'utilisateur depuis le localStorage au démarrage
  useEffect(() => {
    const storedUser = localStorage.getItem("crypto-tracker-user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("crypto-tracker-user")
      }
    }
  }, [])

  // Simuler une base de données d'utilisateurs avec localStorage
  const getUsers = (): Record<string, User> => {
    const users = localStorage.getItem("crypto-tracker-users")
    return users ? JSON.parse(users) : {}
  }

  const saveUsers = (users: Record<string, User>) => {
    localStorage.setItem("crypto-tracker-users", JSON.stringify(users))
  }

  const login = (email: string, password: string): boolean => {
    const users = getUsers()
    const userKey = Object.keys(users).find((key) => users[key].email === email)

    if (userKey) {
      // Dans un vrai système, on vérifierait le mot de passe haché
      // Ici, on simule simplement pour la démo
      setUser(users[userKey])
      setIsAuthenticated(true)
      localStorage.setItem("crypto-tracker-user", JSON.stringify(users[userKey]))
      return true
    }

    return false
  }

  const register = (name: string, email: string, password: string): boolean => {
    const users = getUsers()

    // Vérifier si l'email existe déjà
    const emailExists = Object.values(users).some((user) => user.email === email)
    if (emailExists) {
      return false
    }

    // Créer un nouvel utilisateur
    const userId = `user_${Date.now()}`
    const newUser: User = {
      id: userId,
      name,
      email,
      favorites: [],
    }

    // Ajouter l'utilisateur à la "base de données"
    users[userId] = newUser
    saveUsers(users)

    return true
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("crypto-tracker-user")
  }

  const updateFavorites = (favorites: string[]) => {
    if (user) {
      const updatedUser = { ...user, favorites }
      setUser(updatedUser)

      // Mettre à jour dans le localStorage
      localStorage.setItem("crypto-tracker-user", JSON.stringify(updatedUser))

      // Mettre à jour dans la "base de données"
      const users = getUsers()
      users[user.id] = updatedUser
      saveUsers(users)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, updateFavorites }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

