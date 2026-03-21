"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ClipboardList, Building2 } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { Badge } from "@/shared/ui/badge"

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
  badge?: number
}

interface AdminSidebarProps {
  className?: string
  onNavigate?: () => void
  pendingRequestsCount: number
  pendingVenuesCount: number
}

export const AdminSidebar = ({
  className,
  onNavigate,
  pendingRequestsCount,
  pendingVenuesCount,
}: AdminSidebarProps) => {
  const pathname = usePathname()

  const NAV_ITEMS: NavItem[] = [
    {
      href: "/admin/venue-requests",
      label: "Заявки на размещение",
      icon: ClipboardList,
      badge: pendingRequestsCount,
    },
    {
      href: "/admin/venues",
      label: "Залы на проверке",
      icon: Building2,
      badge: pendingVenuesCount,
    },
  ]

  return (
    <nav className={cn("flex flex-col gap-1 p-2", className)}>
      {NAV_ITEMS.map(({ href, label, icon: Icon, badge }) => {
        const isActive = pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-brand-50 text-brand-700"
                : "text-muted-foreground hover:bg-surface-200 hover:text-foreground"
            )}
          >
            <span className="flex items-center gap-3">
              <Icon
                className={cn("size-4 shrink-0", isActive && "text-brand-600")}
              />
              {label}
            </span>
            {badge != null && badge > 0 && (
              <Badge className="size-5 justify-center rounded-full bg-brand-500 p-0 text-xs">
                {badge > 99 ? "99+" : badge}
              </Badge>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
