"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  Database,
  Workflow,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Zap,
  BarChart3,
  Users,
  Palette,
  Shield,
  HelpCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { ColorThemeButton } from "@/components/ui/color-theme-selector"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, badge: null },
  { name: "Forms", href: "/forms", icon: FileText, badge: null },
  { name: "Submissions", href: "/submissions", icon: Database, badge: "247" },
  { name: "Workflows", href: "/workflows", icon: Workflow, badge: "8" },
  { name: "Analytics", href: "/analytics", icon: BarChart3, badge: "NEW" },
  { name: "Templates", href: "/templates", icon: Palette, badge: "PRO" },
  { name: "Team", href: "/team", icon: Users, badge: null },
  { name: "Integrations", href: "/integrations", icon: Zap, badge: "12" },
  { name: "Security", href: "/security", icon: Shield, badge: null },
  { name: "Settings", href: "/settings", icon: Settings, badge: null },
]

const bottomNavigation = [{ name: "Help & Support", href: "/help", icon: HelpCircle }]

interface SidebarProps {
  children: React.ReactNode
}

export function Sidebar({ children }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="fixed inset-y-0 left-0 flex w-72 flex-col">
            <SidebarContent collapsed={false} pathname={pathname} onMobileClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className={cn("hidden lg:flex lg:flex-col transition-all duration-300", collapsed ? "lg:w-20" : "lg:w-72")}>
        <SidebarContent collapsed={collapsed} pathname={pathname} />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between bg-card px-4 py-3 shadow-sm border-b border-border">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-xl p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">FP</span>
              </div>
              <span className="font-bold text-foreground">FormPilot Pro</span>
            </div>
            <div className="flex items-center space-x-2">
              <ColorThemeButton />
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Desktop collapse button */}
        <div className="hidden lg:block">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute top-6 z-10 rounded-full bg-card p-2 shadow-lg border border-border hover:bg-accent transition-all duration-200"
            style={{ left: collapsed ? "68px" : "260px", transition: "left 0.3s" }}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-background">{children}</main>
      </div>
    </div>
  )
}

function SidebarContent({
  collapsed,
  pathname,
  onMobileClose,
}: {
  collapsed: boolean
  pathname: string
  onMobileClose?: () => void
}) {
  return (
    <div className="flex flex-1 flex-col bg-card border-r border-border shadow-xl">
      {/* Logo */}
      <div className={cn("flex items-center px-6 py-6", collapsed ? "justify-center" : "justify-between")}>
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
            <span className="text-white font-bold">FP</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-foreground text-lg">FormPilot</span>
              <span className="text-xs text-primary font-semibold">PRO VERSION</span>
            </div>
          )}
        </div>

        {/* Desktop theme controls */}
        {!collapsed && !onMobileClose && (
          <div className="flex items-center space-x-2">
            <ColorThemeButton />
            <ThemeToggle />
          </div>
        )}

        {/* Mobile close button */}
        {onMobileClose && (
          <button onClick={onMobileClose} className="lg:hidden p-2 rounded-xl hover:bg-accent">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onMobileClose}
              className={cn(
                "group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                collapsed ? "justify-center" : "justify-start",
              )}
            >
              <item.icon
                className={cn("flex-shrink-0 h-5 w-5", {
                  "mr-3": !collapsed,
                })}
              />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <Badge
                      variant={item.badge === "PRO" ? "default" : item.badge === "NEW" ? "default" : "secondary"}
                      size="sm"
                      className="bg-primary/10 text-primary border-primary/20"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom navigation */}
      <div className="px-4 py-4 border-t border-border">
        {bottomNavigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={onMobileClose}
            className={cn(
              "group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              collapsed ? "justify-center" : "justify-start",
            )}
          >
            <item.icon
              className={cn("flex-shrink-0 h-5 w-5", {
                "mr-3": !collapsed,
              })}
            />
            {!collapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </div>

      {/* Footer */}
      {!collapsed && (
        <div className="px-6 py-4 border-t border-border bg-muted/50">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <span className="text-xs font-semibold text-muted-foreground">JD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">John Doe</p>
              <p className="text-xs text-muted-foreground truncate">john@company.com</p>
            </div>
          </div>
          <div className="mt-3 text-center">
            <Badge variant="default" size="sm" className="bg-primary text-primary-foreground">
              Pro Plan
            </Badge>
          </div>
        </div>
      )}
    </div>
  )
}
