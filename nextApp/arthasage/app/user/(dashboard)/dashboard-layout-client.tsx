"use client"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ToggleTheme } from "@/components/theme-switch"

export function DashboardLayoutClient({
  children,
  userName,
}: {
  children: React.ReactNode
  userName: string
}) {
  return (
    <SidebarProvider>
      <AppSidebar userName={userName} />
      <SidebarInset className="flex flex-col">
        <header className="flex items-center justify-end px-6 py-3 border-b">
          <ToggleTheme />
        </header>
        <main className="flex-1 w-full">
          <div className="container mx-auto p-6 max-w-7xl">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
