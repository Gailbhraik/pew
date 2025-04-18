"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, X, Send, Minimize, Maximize } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { onSnapshot } from 'firebase/firestore'
import { messagesQuery, addDoc, serverTimestamp } from '@/lib/firebase'

type Message = {
  id: string
  content: string
  sender: string
  timestamp: Date
  avatar?: string
}

export function GlobalChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()

  // Charger les messages depuis le localStorage au démarrage
  useEffect(() => {
    // Vérifier que le code s'exécute côté client
    if (typeof window !== 'undefined') {
      const storedMessages = localStorage.getItem("saperlipocrypto-chat-messages")
      if (storedMessages) {
        try {
          const parsedMessages = JSON.parse(storedMessages)
          // Convertir les timestamps en objets Date
          const processedMessages = parsedMessages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
          setMessages(processedMessages)
        } catch (error) {
          console.error("Error parsing stored messages:", error)
        }
      } else {
        // Simuler des messages existants seulement si aucun message n'est stocké
        const demoMessages: Message[] = [
          {
            id: "1",
            content: "Bienvenue dans le chat de Saperlipocrypto!",
            sender: "System",
            timestamp: new Date(Date.now() - 3600000),
            avatar: "/smiling-ape-logo.png"
          },
          {
            id: "2",
            content: "Comment puis-je acheter du Bitcoin?",
            sender: "User123",
            timestamp: new Date(Date.now() - 1800000)
          },
          {
            id: "3",
            content: "Tu peux utiliser des plateformes comme Binance ou Coinbase pour acheter du BTC",
            sender: "CryptoExpert",
            timestamp: new Date(Date.now() - 1700000)
          },
          {
            id: "4",
            content: "Qu'est-ce que vous pensez de Solana en ce moment?",
            sender: "SolFan",
            timestamp: new Date(Date.now() - 900000)
          }
        ]
        setMessages(demoMessages)
        // Sauvegarder les messages de démo dans le localStorage
        localStorage.setItem("saperlipocrypto-chat-messages", JSON.stringify(demoMessages))
      }
    }
  }, [])

  // Sauvegarder les messages dans le localStorage à chaque mise à jour
  useEffect(() => {
    // Vérifier que le code s'exécute côté client
    if (typeof window !== 'undefined' && messages.length > 0) {
      localStorage.setItem("saperlipocrypto-chat-messages", JSON.stringify(messages))
    }
  }, [messages])

  // Faire défiler automatiquement vers le bas lorsque de nouveaux messages arrivent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const firebaseMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      }))
      setMessages(firebaseMessages as Message[])
    })

    return () => unsubscribe()
  }, [])

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return

    await addDoc(messagesQuery, {
      content: newMessage,
      sender: user?.name || "Anonymous",
      timestamp: serverTimestamp()
    })

    setNewMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 p-0 shadow-lg z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card className={`fixed bottom-4 right-4 w-80 shadow-lg z-50 ${isMinimized ? "h-12" : "h-96"}`}>
      <CardHeader className="p-3 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">Chat Communautaire</CardTitle>
        <div className="flex gap-1">
          {isMinimized ? (
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setIsMinimized(false)}>
              <Maximize className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setIsMinimized(true)}>
              <Minimize className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      {!isMinimized && (
        <>
          <CardContent className="p-3 overflow-y-auto h-[calc(100%-88px)]">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className="flex gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={msg.avatar} />
                    <AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{msg.sender}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          <CardFooter className="p-3 pt-0">
            <div className="flex w-full gap-2">
              <Input
                placeholder="Écrivez un message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button size="sm" onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  )
}
