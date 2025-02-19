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
      name: "Personal",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Work",
      logo: AudioWaveform,
      plan: "Startup",
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
          url: "#",
        },
        {
          title: "GPT-o3-mini",
          url: "#",
        },
        {
          title: "Claude-3.5-Sonnet",
          url: "#",
        },
        {
          title: "Grok-3",
          url: "#",
        },
        {
          title: "Gemini-2.0-pro",
          url: "#",
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
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
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
