"use client"

import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconInnerShadowTop,
  IconLogout,
  IconMessageQuestion,
} from "@tabler/icons-react"
import Link from "next/link"
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

const navItems = [
  {
    title: "Dashboard",
    url: "/user/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Ask Question",
    url: "/user/ask",
    icon: IconMessageQuestion,
  },
  {
    title: "Analyse",
    url: "/user/analyse",
    icon: IconChartBar,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const userName = "User" // Replace with actual user data

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/user/dashboard">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">ArthaSage</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link href={item.url}>
                  <item.icon className="size-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-2 space-y-2">
          <Separator />
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-sm font-medium">{userName}</span>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              // Add sign out logic here
              console.log("Sign out")
            }}
          >
            <IconLogout className="mr-2 size-4" />
            Sign Out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
