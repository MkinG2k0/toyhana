"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Building2,
  CalendarDays,
  Settings,
} from "lucide-react"
import { cn } from "@/shared/lib/utils"

const NAV_ITEMS = [
  { href: "/dashboard", label: "Обзор", icon: LayoutDashboard },
  { href: "/dashboard/venues", label: "Мои залы", icon: Building2 },
  { href: "/dashboard/bookings", label: "Заявки", icon: CalendarDays },
  { href: "/dashboard/settings", label: "Настройки", icon: Settings },
] as const

interface SidebarProps {
  className?: string
  onNavigate?: () => void
}

export const Sidebar = ({ className, onNavigate }: SidebarProps) => {
  const pathname = usePathname()

  return (
    <nav className={cn("flex flex-col gap-1 p-2", className)}>
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive =
          href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-brand-50 text-brand-700"
                : "text-muted-foreground hover:bg-surface-200 hover:text-foreground"
            )}
          >
            <Icon
              className={cn("size-4 shrink-0", isActive && "text-brand-600")}
            />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
