// components/chat-interface.tsx
"use client"

import * as React from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { useRouter, useSearchParams } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import type { ChatSession, Message } from "@/types/chat"
import { ChatControlsSidebar } from "@/components/chat-controls-sidebar"
import { cn } from "@/lib/utils"

const MODELS = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
  },
  {
    id: "o3-mini",
    name: "GPT-o3-mini",        
    provider: "openai",
  },
  {
    id: "claude-3-5-sonnet-20241022",
    name: "Claude 3.5 Sonnet",
    provider: "claude",
  },
  {
    id: "grok-2-latest",
    name: "Grok 2",
    provider: "grok",
  }
]

export function ChatInterface() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session")
  
  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [selectedModel, setSelectedModel] = React.useState(MODELS[0].id)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const [systemPrompt, setSystemPrompt] = React.useState("You are a helpful assistant.")
  const [temperature, setTemperature] = React.useState(0.7)
  const [maxTokens, setMaxTokens] = React.useState(2048)
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)

  // Load chat session on mount or when sessionId changes
  React.useEffect(() => {
    if (sessionId) {
      const sessions = JSON.parse(localStorage.getItem("chatSessions") || "[]")
      const session = sessions.find((s: ChatSession) => s.id === sessionId)
      if (session) {
        setMessages(session.messages)
        setSelectedModel(session.model)
      }
    }
  }, [sessionId])

  // Update saveSession to handle empty chats
  const saveSession = React.useCallback((newMessages: Message[], shouldCreateNew = false) => {
    const sessions: ChatSession[] = JSON.parse(localStorage.getItem("chatSessions") || "[]")
    
    if (sessionId) {
      // Update existing session
      const sessionIndex = sessions.findIndex(s => s.id === sessionId)
      if (sessionIndex !== -1) {
        sessions[sessionIndex] = {
          ...sessions[sessionIndex],
          messages: newMessages,
          model: selectedModel,
          updatedAt: new Date(),
          // Update title if this is the first message
          ...(sessions[sessionIndex].title === "New Chat" && newMessages[0] && {
            title: newMessages[0].content.slice(0, 50) || "New Chat"
          })
        }
      }
    } else if (shouldCreateNew) {
      // Create new session
      const newSession: ChatSession = {
        id: uuidv4(),
        title: newMessages[0]?.content.slice(0, 50) || "New Chat",
        messages: newMessages,
        model: selectedModel,
        type: "chat",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      sessions.unshift(newSession)
      localStorage.setItem("chatSessions", JSON.stringify(sessions))
      return newSession.id
    }

    localStorage.setItem("chatSessions", JSON.stringify(sessions))
    return null
  }, [sessionId, selectedModel])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const model = MODELS.find(m => m.id === selectedModel)
    if (!model) return

    setIsLoading(true)
    const userMessage: Message = { role: "user", content: input }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    
    // Create new session only on first message
    if (!sessionId) {
      const sessions: ChatSession[] = JSON.parse(localStorage.getItem("chatSessions") || "[]")
      const newSession: ChatSession = {
        id: uuidv4(),
        title: input.slice(0, 50),
        messages: newMessages,
        model: selectedModel,
        type: "chat",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      sessions.unshift(newSession)
      localStorage.setItem("chatSessions", JSON.stringify(sessions))
      router.push(`/chat?session=${newSession.id}`)
    } else {
      saveSession(newMessages)
    }
    
    setInput("")

    try {
      let endpoint = ""
      switch (model.provider) {
        case "openai":
          endpoint = "/api/openai"
          break
        case "claude":
          endpoint = "/api/claude"
          break
        case "grok":
          endpoint = "/api/grok"
          break
        default:
          throw new Error(`Unsupported provider: ${model.provider}`)
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          model: model.id,
          systemPrompt,
          temperature,
          maxTokens,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API error: ${errorText}`)
      }

      if (response.body) {
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let assistantMessage = { role: "assistant" as const, content: "" }
        setMessages(prev => [...prev, assistantMessage])

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split("\n")

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(5))
                assistantMessage.content += data.content
                setMessages(prev => {
                  const updatedMessages = [...prev.slice(0, -1), {
                    ...assistantMessage
                  }]
                  saveSession(updatedMessages)
                  return updatedMessages
                })
              } catch (e) {
                console.error("Error parsing SSE data:", e)
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error:", error)
      setMessages(prev => [
        ...prev,
        { 
          role: "assistant", 
          content: "Sorry, there was an error processing your request. Please check your API keys and try again." 
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full flex justify-center">
      <Card className={cn(
        "w-[1200px] flex flex-col h-[calc(100vh-4rem)] border-none rounded-none",
        isSidebarOpen && "pointer-events-none"
      )}>
        <div className="w-full flex flex-col h-full">
          <div className="border-b p-4 flex-shrink-0">
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {MODELS.map(model => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <ScrollArea className="flex-1 h-0 min-h-0">
            <div className="flex flex-col px-4 py-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className="flex w-full"
                >
                  <div
                    className={`max-w-[400px] ${
                      message.role === "user"
                        ? "ml-auto"
                        : "mr-auto"
                    }`}
                  >
                    <div
                      className={`inline-block px-4 py-3 rounded-2xl ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-none"
                          : "bg-secondary rounded-tl-none"
                      } shadow-sm`}
                    >
                      <p className="whitespace-pre-wrap text-sm leading-relaxed break-words">
                        {message.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 flex-shrink-0">
            <form onSubmit={handleSubmit} className="flex gap-2 items-center">
              <Textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 h-[44px] max-h-[120px] resize-none focus-visible:ring-1 py-2"
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
              />
              <Button 
                type="submit" 
                size="icon"
                disabled={isLoading}
                className="h-[44px] w-[44px] rounded-full shrink-0"
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </Card>
      
      <ChatControlsSidebar
        systemPrompt={systemPrompt}
        temperature={temperature}
        maxTokens={maxTokens}
        onSystemPromptChange={setSystemPrompt}
        onTemperatureChange={setTemperature}
        onMaxTokensChange={setMaxTokens}
        onOpenChange={setIsSidebarOpen}
      />
    </div>
  )
} 