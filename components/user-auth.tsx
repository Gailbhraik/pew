"use client"

import type React from "react"

import { useState } from "react"
import { User, LogIn, LogOut, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"

export function UserAuth() {
  const { toast } = useToast()
  const { user, login, register, logout, isAuthenticated } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [registerData, setRegisterData] = useState({ name: "", email: "", password: "" })
  const [activeTab, setActiveTab] = useState("login")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (login(loginData.email, loginData.password)) {
      toast({
        title: "Logged in successfully",
        description: `Welcome back, ${loginData.email}!`,
      })
      setIsOpen(false)
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      })
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (register(registerData.name, registerData.email, registerData.password)) {
      toast({
        title: "Account created",
        description: "Your account has been created successfully",
      })
      setActiveTab("login")
      setLoginData({ email: registerData.email, password: registerData.password })
    } else {
      toast({
        title: "Registration failed",
        description: "Email already in use",
        variant: "destructive",
      })
    }
  }

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    })
  }

  return (
    <div>
      {isAuthenticated ? (
        <div className="flex items-center gap-2">
          <span className="text-sm hidden md:inline-block">{user?.name || user?.email}</span>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline-block">Logout</span>
          </Button>
        </div>
      ) : (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden md:inline-block">Sign In</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form onSubmit={handleLogin}>
                  <DialogHeader>
                    <DialogTitle>Login to your account</DialogTitle>
                    <DialogDescription>
                      Enter your credentials to access your account and saved favorites.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full gap-2">
                      <LogIn className="h-4 w-4" />
                      Login
                    </Button>
                  </DialogFooter>
                </form>
              </TabsContent>
              <TabsContent value="register">
                <form onSubmit={handleRegister}>
                  <DialogHeader>
                    <DialogTitle>Create an account</DialogTitle>
                    <DialogDescription>
                      Register to save your favorite cryptocurrencies across devices.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="Your Name"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="your@email.com"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input
                        id="register-password"
                        type="password"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full gap-2">
                      <UserPlus className="h-4 w-4" />
                      Create Account
                    </Button>
                  </DialogFooter>
                </form>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

