import { AppSidebar } from "@/components/app-sidebar"

import {
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
    </SidebarProvider>
  )
}
