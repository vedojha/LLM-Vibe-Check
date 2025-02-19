// components/nav-main.tsx
"use client"

import { ChevronRight, type LucideIcon, Trash2 } from "lucide-react"
import React from "react"
import Link from "next/link"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { useChatSessions } from "@/components/chat-sessions"
import type { ChatSession } from "@/types/chat"
import type { NavItem, SubItem, HistoryItem } from "@/types/navigation"

export function NavMain({ items }: { items: NavItem[] }) {
  const chatSessions = useChatSessions()
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({})
  
  // Initialize History as open if it has items
  React.useEffect(() => {
    if (chatSessions.length > 0) {
      setOpenSections(prev => ({ ...prev, History: true }))
    }
  }, [chatSessions.length])

  const handleTriggerClick = (title: string) => {
    setOpenSections(prev => ({ ...prev, [title]: !prev[title] }))
  }

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const sessions = JSON.parse(localStorage.getItem("chatSessions") || "[]")
    const updatedSessions = sessions.filter((session: ChatSession) => 
      session.id !== sessionId
    )
    localStorage.setItem("chatSessions", JSON.stringify(updatedSessions))
    
    // Force a re-render of the sidebar
    window.location.reload()
  }

  // Update history items dynamically
  const updatedItems = items.map(item => {
    if (item.title === "History") {
      return {
        ...item,
        items: chatSessions
      }
    }
    return item
  })

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {updatedItems.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            open={openSections[item.title]}
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild onClick={() => handleTriggerClick(item.title)}>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem 
                      key={`${subItem.title}-${subItem.url.split('=')[1] || ''}`}
                      className="group relative"
                    >
                      <SidebarMenuSubButton asChild>
                        {'component' in subItem && subItem.component ? (
                          <subItem.component 
                            href={subItem.url}
                            className="flex w-full items-center"
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation()
                            }}
                          >
                            <span className="truncate">{subItem.title}</span>
                            {item.title === "History" && (
                              <button
                                onClick={(e) => handleDeleteSession(subItem.url.split('=')[1], e)}
                                className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-muted-foreground hover:text-destructive"
                                aria-label="Delete chat session"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </subItem.component>
                        ) : (
                          <a 
                            href={subItem.url}
                            className="flex w-full items-center"
                            onClick={(e) => {
                              e.stopPropagation()
                            }}
                          >
                            <span>{subItem.title}</span>
                          </a>
                        )}
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
