"use client"

import { signOut } from "next-auth/react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/shared/ui/avatar"
import { LogOut, LayoutDashboard, Settings } from "lucide-react"

interface UserMenuProps {
  user: {
    name?: string | null
    role?: string
  }
}

export const UserMenu = ({ user }: UserMenuProps) => {
  const initials = (user.name ?? "U").slice(0, 2).toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hidden focus:outline-none md:block">
        <Avatar className="size-8 cursor-pointer">
          <AvatarFallback className="bg-brand-100 text-xs text-brand-700">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5 text-sm font-medium">{user.name}</div>
        <DropdownMenuSeparator />
        {(user.role === "OWNER" || user.role === "ADMIN") && (
          <DropdownMenuItem render={<Link href="/dashboard" />}>
            <LayoutDashboard className="mr-2 size-4" />
            Мой кабинет
          </DropdownMenuItem>
        )}
        <DropdownMenuItem render={<Link href="/dashboard/settings" />}>
          <Settings className="mr-2 size-4" />
          Настройки
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
          <LogOut className="mr-2 size-4" />
          Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
