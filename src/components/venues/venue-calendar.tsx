"use client"

import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { ru } from "date-fns/locale"

interface VenueCalendarProps {
  blockedDates: string[]
  selectedDate?: Date
  onSelectDate?: (date: Date | undefined) => void
  className?: string
}

export const VenueCalendar = ({
  blockedDates,
  selectedDate,
  onSelectDate,
  className,
}: VenueCalendarProps) => {
  const blockedSet = new Set(
    blockedDates.map((d) => new Date(d).toDateString())
  )

  const isBlocked = (date: Date) => blockedSet.has(date.toDateString())
  const isPast = (date: Date) => date < new Date(new Date().toDateString())

  return (
    <div className={cn("rounded-xl border border-surface-200 p-4", className)}>
      <h3 className="mb-3 font-semibold">Свободные даты</h3>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onSelectDate}
        locale={ru}
        disabled={(date) => isPast(date) || isBlocked(date)}
        modifiers={{
          blocked: (date) => isBlocked(date),
        }}
        modifiersClassNames={{
          blocked: "line-through text-muted-foreground opacity-50",
        }}
        className="w-full"
      />
      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="size-3 rounded-full bg-brand-500" />
          Выбранная дата
        </div>
        <div className="flex items-center gap-1">
          <div className="size-3 rounded-full bg-muted" />
          Занято
        </div>
      </div>
    </div>
  )
}
