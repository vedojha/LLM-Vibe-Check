export interface Message {
  role: "user" | "assistant"
  content: string
}

export interface CompareMessage {
  role: "user" | "assistant"
  content: Record<string, string> // modelId -> content
}

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  model: string
  createdAt: Date
  updatedAt: Date
  type: "chat" | "compare"
  compareMessages?: CompareMessage[] // Only for compare sessions
} 