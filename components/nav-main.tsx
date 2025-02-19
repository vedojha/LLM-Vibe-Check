"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
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

interface SubItem {
  title: string
  url: string
  subtitle?: string
  component?: typeof Link
}

// Add this type
type HistoryItem = {
  title: string
  url: string
  subtitle: string
}

interface NavItem {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: (SubItem | HistoryItem)[]
}

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
                    >
                      <SidebarMenuSubButton asChild>
                        {'component' in subItem && subItem.component ? (
                          <subItem.component 
                            href={subItem.url}
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation()
                            }}
                          >
                            <span>{subItem.title}</span>
                            {subItem.subtitle && (
                              <span className="ml-auto text-xs text-muted-foreground">
                                {subItem.subtitle}
                              </span>
                            )}
                          </subItem.component>
                        ) : (
                          <a 
                            href={subItem.url}
                            onClick={(e) => {
                              e.stopPropagation()
                            }}
                          >
                            <span>{subItem.title}</span>
                            {subItem.subtitle && (
                              <span className="ml-auto text-xs text-muted-foreground">
                                {subItem.subtitle}
                              </span>
                            )}
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
