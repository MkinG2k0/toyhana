"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/shared/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet"
import { Sidebar } from "./Sidebar"

interface DashboardMobileNavProps {
  onNavigate?: () => void
}

export const DashboardMobileNav = ({ onNavigate }: DashboardMobileNavProps) => {
  const [open, setOpen] = useState(false)

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) onNavigate?.()
  }

  return (
    <div className="mb-4 lg:hidden">
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetTrigger
          render={
            <Button variant="outline" size="sm">
              <Menu className="size-4" />
              <span className="sr-only">Меню</span>
            </Button>
          }
        />
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Навигация</SheetTitle>
          </SheetHeader>
          <Sidebar className="pt-4" onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  )
}
