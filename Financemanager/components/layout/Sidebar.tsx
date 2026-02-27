"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
    LayoutDashboard,
    ArrowLeftRight,
    PieChart,
    Bot,
    Settings,
    Sparkles,
    Crown,
} from "lucide-react"

const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/" },
    { label: "Transactions", icon: ArrowLeftRight, href: "/transactions" },
    { label: "Analytics", icon: PieChart, href: "/analytics" },
    { label: "AI Advisor", icon: Bot, href: "/advisor", badge: "New" },
    { label: "Settings", icon: Settings, href: "/settings" },
]

interface SidebarProps {
    budgetPercent?: number
}

export function Sidebar({ budgetPercent = 75 }: SidebarProps) {
    const pathname = usePathname()

    return (
        <aside className="sidebar">
            {/* Logo */}
            <div className="sidebar-logo">
                <div className="sidebar-logo-icon">
                    <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="sidebar-logo-text">FinAI<span className="sidebar-logo-dot">.io</span></span>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`sidebar-nav-item ${isActive ? "sidebar-nav-item-active" : ""}`}
                        >
                            <item.icon className="sidebar-nav-icon" />
                            <span>{item.label}</span>
                            {item.badge && (
                                <span className="sidebar-badge">{item.badge}</span>
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Budget Progress */}
            <div className="sidebar-budget">
                <div className="sidebar-budget-header">
                    <span className="sidebar-budget-label">Budget Used</span>
                    <span className="sidebar-budget-value">{budgetPercent}%</span>
                </div>
                <div className="sidebar-budget-track">
                    <div
                        className="sidebar-budget-fill"
                        style={{ width: `${budgetPercent}%` }}
                    />
                </div>
            </div>

            {/* User Profile */}
            <div className="sidebar-user">
                <div className="sidebar-user-avatar">
                    <span>JD</span>
                </div>
                <div className="sidebar-user-info">
                    <span className="sidebar-user-name">John Doe</span>
                    <span className="sidebar-user-plan">
                        <Crown className="h-3 w-3" />
                        Premium Plan
                    </span>
                </div>
            </div>
        </aside>
    )
}
