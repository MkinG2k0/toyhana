"use client"

import { useEffect, useState } from "react"
import { Calendar } from "@/shared/ui/calendar"
import { cn } from "@/shared/lib/utils"
import { ru } from "date-fns/locale"
import { format, parseISO, startOfDay, isBefore } from "date-fns"

interface VenueCalendarProps {
  blockedDates: string[]
  className?: string
}

const BOOKING_EVENT_DATE_KEY = "booking_eventDate"

export const VenueCalendar = ({
  blockedDates,
  className,
}: VenueCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  const blockedSet = new Set(
    blockedDates.map((d) => new Date(d).toDateString()),
  )

  const isBlocked = (date: Date) => blockedSet.has(date.toDateString())
  const isPast = (date: Date) =>
    isBefore(startOfDay(date), startOfDay(new Date()))

  useEffect(() => {
    if (typeof window === "undefined") return
    const saved = window.localStorage.getItem(BOOKING_EVENT_DATE_KEY)
    if (!saved) return
    try {
      const parsed = parseISO(saved)
      if (
        !Number.isNaN(parsed.getTime()) &&
        !isPast(parsed) &&
        !isBlocked(parsed)
      ) {
        setSelectedDate(parsed)
      }
    } catch {
      // ignore invalid stored date
    }
  }, [])

  const handleSelect = (date: Date | undefined) => {
    if (typeof window === "undefined") return
    setSelectedDate(date)
    if (!date) {
      window.localStorage.removeItem(BOOKING_EVENT_DATE_KEY)
      return
    }
    const value = format(date, "yyyy-MM-dd")
    window.localStorage.setItem(BOOKING_EVENT_DATE_KEY, value)
  }

  return (
    <div
      className={cn("rounded-2xl border border-surface-200 p-4", className)}
    >
      <h3 className="mb-3 font-semibold">Свободные даты</h3>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleSelect}
        locale={ru}
        disabled={(date) => isPast(date) || isBlocked(date)}
        modifiers={{ blocked: (date) => isBlocked(date) }}
        modifiersClassNames={{
          blocked: "line-through text-muted-foreground opacity-50",
        }}
        className="mx-auto w-full max-w-96"
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
