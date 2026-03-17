"use client"

import { Button } from "@/shared/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet"
import { SlidersHorizontal } from "lucide-react"
import { useIsMobile } from "@/shared/lib/use-media-query"
import type { VenueFilters as VenueFiltersType } from "@/entities/venue"
import { VenueFiltersContent } from "./VenueFiltersContent"

interface VenueFiltersProps {
  filters: VenueFiltersType
  onFiltersChange: (filters: VenueFiltersType) => void
}

export const VenueFilters = (props: VenueFiltersProps) => {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger render={<Button variant="outline" size="sm" />}>
          <SlidersHorizontal className="mr-2 size-4" />
          Фильтры
        </SheetTrigger>
        <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Фильтры</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <VenueFiltersContent {...props} />
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <aside className="sticky top-20 w-64 shrink-0 space-y-1">
      <h3 className="mb-4 text-sm font-semibold">Фильтры</h3>
      <VenueFiltersContent {...props} />
    </aside>
  )
}
