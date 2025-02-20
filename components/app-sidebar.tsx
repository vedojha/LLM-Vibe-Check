// components/app-sidebar.tsx
"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "devjoah",
    email: "devjoah@gmail.com",
    avatar: "/avatars/logo.png",
  },
  teams: [
    {
      name: "Vibe Check",
      logo: GalleryVerticalEnd,
      plan: "LLM Comparison",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Chat",
          url: "/chat",
          component: Link,
        },
        {
          title: "Compare",
          url: "/compare",
          component: Link,
        },
      ],
    },
    {
      title: "History",
      url: "#",
      icon: GalleryVerticalEnd,
      items: [],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "GPT-4o",
          url: "/chat?model=gpt-4o",
          component: Link,
        },
        {
          title: "GPT-o3-mini",
          url: "/chat?model=o3-mini",
          component: Link,
        },
        {
          title: "Claude-3.5-Sonnet",
          url: "/chat?model=claude-3-5-sonnet-20241022",
          component: Link,
        },
        {
          title: "Grok-2",
          url: "/chat?model=grok-2-latest",
          component: Link,
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "/docs/introduction",
          component: Link,
        },
        {
          title: "Get Started",
          url: "/docs/getting-started",
          component: Link,
        },
        {
          title: "About",
          url: "/about",
          component: Link,
        }
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/settings",
        },
        {
          title: "API Keys",
          url: "/settings/api-keys",
        },
      ],
    },
  ],
  projects: [
    {
      name: "LLM Comparison",
      url: "#",
      icon: Frame,
    },
    {
      name: "Evaluation",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Testing",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
