"use client"

import * as React from "react"
import { Send, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { useRouter, useSearchParams } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import type { ChatSession, CompareMessage } from "@/types/chat"
import { SynthesisModal } from "@/components/synthesis-modal"

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
    
    // Add user message to all model chats
    const newModelMessages = { ...modelMessages }
    Object.keys(newModelMessages).forEach(modelId => {
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
          content: Object.fromEntries(MODELS.map(model => [model.id, input]))
        }],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const sessions = JSON.parse(localStorage.getItem("chatSessions") || "[]")
      sessions.unshift(newSession)
      localStorage.setItem("chatSessions", JSON.stringify(sessions))
      await router.replace(`/compare?session=${newSession.id}`)  // await the navigation
    }
    
    setInput("")

    // Send request to all models simultaneously
    try {
      const finalModelMessages = { ...newModelMessages }
      const requests = MODELS.map(async model => {
        const endpoint = `/api/${model.provider}`
        const messages = [...newModelMessages[model.id], userMessage]

        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages,
            model: model.id,
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
        Object.keys(updated).forEach(modelId => {
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

  return (
    <div className="w-full h-[calc(100vh-4rem)] flex flex-col p-4 gap-4">
      <div className="grid grid-cols-4 gap-4 h-[calc(100vh-13rem)]">
        {MODELS.map(model => (
          <Card 
            key={model.id} 
            className="flex flex-col border-none rounded-none min-w-[300px] w-full overflow-hidden"
          >
            <div className="border-b p-4 flex-shrink-0 flex justify-center items-center">
              <h3 className="font-medium text-center">{model.name}</h3>
            </div>
            <ScrollArea className="flex-1">
              <div className="flex flex-col px-4 py-4 space-y-4">
                {modelMessages[model.id].map((message, index) => (
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

      <div className="w-full max-w-[1200px] mx-auto px-4">
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

      <SynthesisModal
        isOpen={isSynthesisModalOpen}
        onClose={() => setIsSynthesisModalOpen(false)}
        content={synthesisContent}
        isLoading={isSynthesizing}
      />
    </div>
  )
} 