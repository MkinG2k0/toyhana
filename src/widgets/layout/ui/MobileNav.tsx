"use client"

import { useState } from "react"
import Link from "next/link"
import { signOut } from "next-auth/react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet"
import { SITE_NAME } from "@/shared/lib/site"
import { Button } from "@/shared/ui/button"
import { Separator } from "@/shared/ui/separator"
import { Menu } from "lucide-react"

interface MobileNavProps {
  isLoggedIn: boolean
  userRole?: string
}

export const MobileNav = ({ isLoggedIn, userRole }: MobileNavProps) => {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" className="md:hidden" />}
      >
        <Menu className="size-5" />
        <span className="sr-only">Меню</span>
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetHeader>
          <SheetTitle className="font-display text-brand-600">
            {SITE_NAME}
          </SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col gap-2">
          <Link
            href="/venues"
            onClick={close}
            className="rounded-md px-3 py-2 text-sm font-medium hover:bg-surface-100"
          >
            Каталог залов
          </Link>
          {isLoggedIn && (userRole === "OWNER" || userRole === "ADMIN") && (
            <Link
              href="/dashboard"
              onClick={close}
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-surface-100"
            >
              Мой кабинет
            </Link>
          )}
          {isLoggedIn && userRole === "ADMIN" && (
            <Link
              href="/admin"
              onClick={close}
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-surface-100"
            >
              Администрирование
            </Link>
          )}
          <Separator className="my-2" />
          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard/settings"
                onClick={close}
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-surface-100"
              >
                Настройки
              </Link>
              <button
                onClick={() => {
                  close()
                  signOut({ callbackUrl: "/" })
                }}
                className="rounded-md px-3 py-2 text-left text-sm font-medium text-destructive hover:bg-destructive/10"
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={close}
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-surface-100"
              >
                Войти
              </Link>
              <Button
                className="mt-2 bg-brand-500 hover:bg-brand-600"
                render={
                  <Link href="/register?intent=place-venue" onClick={close} />
                }
              >
                Разместить зал
              </Button>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
