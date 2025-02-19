import * as React from "react"
import { usePathname } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import type { ChatSession } from "@/types/chat"

export function useChatSessions() {
  const [sessions, setSessions] = React.useState<ChatSession[]>([])
  const pathname = usePathname()

  React.useEffect(() => {
    const savedSessions = JSON.parse(localStorage.getItem("chatSessions") || "[]")
    console.log("Loading chat sessions:", savedSessions) // Debug log
    
    setSessions(savedSessions.map((session: ChatSession) => ({
      ...session,
      createdAt: new Date(session.createdAt),
      updatedAt: new Date(session.updatedAt)
    })))
  }, [pathname])

  const chatItems = sessions.map(session => {
    const title = session.title || (session.type === "compare" ? "Untitled Comparison" : "Untitled Chat")
    const url = session.type === "compare" ? `/compare?session=${session.id}` : `/chat?session=${session.id}`
    
    return {
      title,
      url,
      subtitle: formatDistanceToNow(new Date(session.updatedAt), { addSuffix: true })
    }
  })

  console.log("Returning chat items:", chatItems) // Debug log
  return chatItems
}

export type ChatSession = {
  id: string
  title: string
  url: string
  subtitle: string
} 