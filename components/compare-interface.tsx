// components/compare-interface.tsx
"use client"

import * as React from "react"
import { Send, Wand2, Bot, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { useRouter, useSearchParams } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import type { ChatSession, CompareMessage } from "@/types/chat"
import { SynthesisModal } from "@/components/synthesis-modal"
import { ChatControlsSidebar } from "@/components/chat-controls-sidebar"
import { cn } from "@/lib/utils"

interface Message {
  role: "user" | "assistant"
  content: string
}

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

export function CompareInterface() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session")

  const [modelMessages, setModelMessages] = React.useState<Record<string, Message[]>>(
    Object.fromEntries(MODELS.map(model => [model.id, []]))
  )
  const [input, setInput] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const [isSynthesisModalOpen, setIsSynthesisModalOpen] = React.useState(false)
  const [synthesisContent, setSynthesisContent] = React.useState("")
  const [isSynthesizing, setIsSynthesizing] = React.useState(false)
  const [selectedModels, setSelectedModels] = React.useState<string[]>([MODELS[0].id])
  const [systemPrompt, setSystemPrompt] = React.useState("You are a helpful assistant.")
  const [temperature, setTemperature] = React.useState(0.7)
  const [maxTokens, setMaxTokens] = React.useState(2048)
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)

  // Load session if exists
  React.useEffect(() => {
    if (sessionId) {
      const sessions = JSON.parse(localStorage.getItem("chatSessions") || "[]")
      const session = sessions.find((s: ChatSession) => s.id === sessionId)
      if (session && session.type === "compare" && session.compareMessages) {
        // Convert compareMessages back to modelMessages format
        const newModelMessages: Record<string, Message[]> = {}
        MODELS.forEach(model => {
          newModelMessages[model.id] = session.compareMessages!.map((msg: CompareMessage) => ({
            role: msg.role,
            content: msg.content[model.id] || ""
          }))
        })
        setModelMessages(newModelMessages)
      }
    }
  }, [sessionId])

  const saveSession = React.useCallback((newModelMessages: Record<string, Message[]>) => {
    const sessions: ChatSession[] = JSON.parse(localStorage.getItem("chatSessions") || "[]")
    
    if (sessionId) {
      const sessionIndex = sessions.findIndex(s => s.id === sessionId)
      if (sessionIndex !== -1) {
        // Convert modelMessages to compareMessages format
        const compareMessages: CompareMessage[] = []
        const messageCount = Object.values(newModelMessages)[0].length
        
        for (let i = 0; i < messageCount; i++) {
          const content: Record<string, string> = {}
          MODELS.forEach(model => {
            content[model.id] = newModelMessages[model.id][i].content
          })
          compareMessages.push({
            role: Object.values(newModelMessages)[0][i].role,
            content
          })
        }

        sessions[sessionIndex] = {
          ...sessions[sessionIndex],
          compareMessages,
          updatedAt: new Date(),
          // Update title if this is the first message
          ...(sessions[sessionIndex].title === "New Comparison" && compareMessages[0] && {
            title: Object.values(compareMessages[0].content)[0].slice(0, 50) || "New Comparison"
          })
        }
        localStorage.setItem("chatSessions", JSON.stringify(sessions))
      }
    }
  }, [sessionId])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [modelMessages])

  // Clear messages when there's no session ID
  React.useEffect(() => {
    if (!sessionId) {
      setModelMessages(Object.fromEntries(MODELS.map(model => [model.id, []])))
    }
  }, [sessionId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    setIsLoading(true)
    const userMessage: Message = { role: "user", content: input }
    
    // Add user message only to selected model chats
    const newModelMessages = { ...modelMessages }
    selectedModels.forEach(modelId => {
      newModelMessages[modelId] = [...newModelMessages[modelId], userMessage]
    })
    setModelMessages(newModelMessages)

    // Create new session only on first message if no sessionId exists
    if (!sessionId) {
      const newSession: ChatSession = {
        id: uuidv4(),
        title: input.slice(0, 50),
        messages: [],
        model: "compare",
        type: "compare",
        compareMessages: [{
          role: "user",
          content: Object.fromEntries(selectedModels.map(modelId => [modelId, input]))
        }],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const sessions = JSON.parse(localStorage.getItem("chatSessions") || "[]")
      sessions.unshift(newSession)
      localStorage.setItem("chatSessions", JSON.stringify(sessions))
      await router.replace(`/compare?session=${newSession.id}`)
    }
    
    setInput("")

    // Send request only to selected models simultaneously
    try {
      const finalModelMessages = { ...newModelMessages }
      const requests = selectedModels.map(async modelId => {
        const model = MODELS.find(m => m.id === modelId)
        if (!model) return

        const endpoint = `/api/${model.provider}`
        const messages = [...newModelMessages[modelId], userMessage]

        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages,
            model: model.id,
            systemPrompt,
            temperature,
            maxTokens,
          }),
        })

        if (!response.ok) {
          throw new Error(`API error: ${await response.text()}`)
        }

        if (response.body) {
          const reader = response.body.getReader()
          const decoder = new TextDecoder()
          let assistantMessage = { role: "assistant" as const, content: "" }
          
          finalModelMessages[model.id] = [...finalModelMessages[model.id], assistantMessage]
          setModelMessages(prev => ({
            ...prev,
            [model.id]: [...prev[model.id], assistantMessage]
          }))

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
                  finalModelMessages[model.id][finalModelMessages[model.id].length - 1] = { ...assistantMessage }
                  setModelMessages(prev => ({
                    ...prev,
                    [model.id]: [
                      ...prev[model.id].slice(0, -1),
                      { ...assistantMessage }
                    ]
                  }))
                } catch (e) {
                  console.error("Error parsing SSE data:", e)
                }
              }
            }
          }
        }
      })

      await Promise.all(requests)
      // Save session after all responses are complete
      saveSession(finalModelMessages)
    } catch (error) {
      console.error("Error:", error)
      setModelMessages(prev => {
        const updated = { ...prev }
        selectedModels.forEach(modelId => {
          updated[modelId] = [
            ...updated[modelId],
            { role: "assistant", content: "Sorry, there was an error processing your request." }
          ]
        })
        return updated
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSynthesis = async () => {
    setIsSynthesisModalOpen(true)
    setIsSynthesizing(true)

    try {
      // Get the last message from each model
      const lastMessages = Object.entries(modelMessages).map(([modelId, messages]) => {
        const lastMessage = messages[messages.length - 1]
        return `${modelId}: ${lastMessage?.content || ''}`
      }).join("\n\n")

      const prompt = `Analyze the following AI model responses and provide a structured analysis with these sections:

                        1. Comprehensive Synthesis
                        Combine the unique insights from each model into a coherent analysis. Focus on the main themes and how different perspectives complement each other.

                        2. Notable Differences in Their Approaches
                        Highlight the distinct characteristics of each model's response, including differences in:
                        - Style and tone
                        - Depth of analysis
                        - Unique perspectives or insights
                        - Special features or approaches

                        3. Summary of Key Points
                        List the main points that multiple models agreed upon, emphasizing the consensus views and shared insights.

                        Format each section with clear headers and use paragraphs for readability.

                        Responses:
                        ${lastMessages}`

      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          model: 'o3-mini'
        })
      })

      if (!response.ok) throw new Error('Synthesis failed')

      if (response.body) {
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let synthesis = ""

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split("\n")

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(5))
                synthesis += data.content
                setSynthesisContent(synthesis)
              } catch (e) {
                console.error("Error parsing SSE data:", e)
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Synthesis error:", error)
      setSynthesisContent("Sorry, there was an error synthesizing the responses.")
    } finally {
      setIsSynthesizing(false)
    }
  }

  const handleSelectModel = (modelId: string) => {
    if (selectedModels.length < 4) {
      setSelectedModels(prev => [...prev, modelId])
    }
  }

  const handleRemoveModel = (modelId: string) => {
    setSelectedModels(prev => prev.filter(id => id !== modelId))
  }

  return (
    <div className="w-full flex justify-center">
      <Card className={cn(
        "w-[1400px] flex flex-col h-[calc(100vh-4rem)] border-none rounded-none",
        isSidebarOpen && "pointer-events-none"
      )}>
        <div className="w-full flex flex-col h-full">
          {/* Model Selection Pills */}
          <div className="border-b p-4 flex-shrink-0">
            <div className="flex flex-wrap gap-2 justify-center">
              {MODELS.map(model => {
                const isSelected = selectedModels.includes(model.id)
                return (
                  <Button
                    key={model.id}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className={`
                      gap-2 transition-all duration-200
                      ${isSelected ? 'ring-2 ring-primary' : 'hover:bg-muted'}
                    `}
                    onClick={() => isSelected ? handleRemoveModel(model.id) : handleSelectModel(model.id)}
                  >
                    <Bot className="h-4 w-4" />
                    {model.name}
                    {isSelected && (
                      <X className="h-3 w-3 text-muted-foreground" />
                    )}
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 min-h-0">
            <div className={`grid gap-4 w-full h-full p-4
              ${selectedModels.length === 1 ? 'grid-cols-1' : 
                selectedModels.length === 2 ? 'grid-cols-2' : 
                selectedModels.length === 3 ? 'grid-cols-3' : 
                'grid-cols-4'}
            `}>
              {selectedModels.map((modelId) => (
                <Card key={modelId} className="h-full flex flex-col">
                  <div className="border-b p-4 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <Bot className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">{MODELS.find(m => m.id === modelId)?.name}</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleRemoveModel(modelId)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <ScrollArea className="flex-1 h-full">
                    <div className="flex flex-col p-4 space-y-4">
                      {modelMessages[modelId].map((message, index) => (
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
                </Card>
              ))}
            </div>
          </div>

          {/* Input Area */}
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
              {modelMessages[Object.keys(modelMessages)[0]].length > 0 && (
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  onClick={handleSynthesis}
                  disabled={isLoading || isSynthesizing}
                  className="h-[44px] w-[44px] rounded-full shrink-0"
                  title="Synthesize AI responses"
                >
                  <Wand2 className="h-5 w-5" />
                </Button>
              )}
            </form>
          </div>
        </div>
      </Card>

      <SynthesisModal
        isOpen={isSynthesisModalOpen}
        onClose={() => setIsSynthesisModalOpen(false)}
        content={synthesisContent}
        isLoading={isSynthesizing}
      />

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