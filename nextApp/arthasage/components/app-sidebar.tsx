"use client"

import * as React from "react"
import {
  IconChartBar,
  IconCurrencyRupee,
  IconDashboard,
  IconInnerShadowTop,
  IconLogout,
  IconMessageQuestion,
  IconUser,
} from "@tabler/icons-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SettingsIcon } from "lucide-react"

const navItems = [
  {
    title: "Dashboard",
    url: "/user/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Ask Question",
    url: "/user/assistant",
    icon: IconMessageQuestion,
  },
  {
    title: "Analyse",
    url: "/user/analyse",
    icon: IconChartBar,
  },
  {
    title: "View Transactions",
    url: "/user/transactions",
    icon: IconCurrencyRupee,
  },
  {
    title: "View Portfolio",
    url: "/user/transactions",
    icon: IconInnerShadowTop,
  },
  {
    title: "Settings",
    url: "/user/transactions",
    icon: SettingsIcon,
  }
]

export function AppSidebar({ userName, ...props }: React.ComponentProps<typeof Sidebar> & { userName?: string }) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      {/* Header / Logo */}
      <SidebarHeader className="px-4 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-auto data-[slot=sidebar-menu-button]:!p-0 hover:bg-transparent"
            >
              <Link href="/" className="flex items-center gap-2.5 px-1">
                <span className="text-2xl font-bold tracking-wider">ArthaSage</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <Separator className="mb-2" />

      {/* Navigation */}
      <SidebarContent className="px-3 py-2">
        <p className="px-2 mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Menu
        </p>
        <SidebarMenu className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.url || pathname.startsWith(item.url + "/")
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link
                    href={item.url}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon className="size-4 shrink-0" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="px-3 py-4">
        <Separator className="mb-4" />
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground shrink-0">
            <IconUser className="size-4" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{userName ?? "User"}</p>
            <p className="text-xs text-muted-foreground truncate">Personal Account</p>
          </div>
        </div>
        <Button
          asChild
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <Link href="/sign-out">
            <IconLogout className="mr-2 size-4" />
            Sign Out
          </Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
