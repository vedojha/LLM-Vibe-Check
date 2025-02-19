// types/navigation.ts
import type { LucideIcon } from "lucide-react"
import Link from "next/link"

export interface SubItem {
  title: string
  url: string
  subtitle?: string
  component?: typeof Link
}

export interface HistoryItem {
  title: string
  url: string
  subtitle: string
}

export interface NavItem {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: (SubItem | HistoryItem)[]
} 