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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SettingsIcon } from "lucide-react"
import { ToggleTheme } from "@/components/theme-switch"

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
    url: "/user/portfolio",
    icon: IconInnerShadowTop,
  },
  {
    title: "Settings",
    url: "/user/usersettings",
    icon: SettingsIcon,
  }
]

function getInitials(name?: string): string {
  if (!name) return "U"
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function AppSidebar({ userName, ...props }: React.ComponentProps<typeof Sidebar> & { userName?: string }) {
  const pathname = usePathname()
  const name = userName
  const image = null // Add user image URL if available

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      {/* Header / Logo */}
      <SidebarHeader className="px-4 py-4">
        <div className="flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2.5">
        <span className="text-2xl font-bold tracking-wider text-primary">ArthaSage</span>
          </Link>
          <ToggleTheme />
        </div>
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
          <Avatar className="size-9">
            <AvatarImage src={image ?? undefined} />
            <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
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
