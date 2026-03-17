"use client"

import { Card, CardContent, CardHeader } from "@/shared/ui/card"
import { formatDate, formatPhone } from "@/shared/lib/utils"
import { Calendar, Users, Phone, User } from "lucide-react"
import { BookingStatusBadge } from "@/entities/booking"
import { EVENT_TYPE_LABELS } from "@/entities/booking"
import type { BookingCard as BookingCardType } from "@/entities/booking"

interface BookingCardProps {
  booking: BookingCardType
  className?: string
}

export const BookingCard = ({ booking, className }: BookingCardProps) => {
  const eventTypeLabel =
    EVENT_TYPE_LABELS[booking.eventType] ?? booking.eventType

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
        <div>
          <h3 className="font-display text-lg font-semibold">
            {booking.venue.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {formatDate(booking.eventDate)}
          </p>
        </div>
        <BookingStatusBadge status={booking.status} />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="flex items-center gap-1.5">
            <Calendar className="size-4 text-muted-foreground" />
            {eventTypeLabel}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="size-4 text-muted-foreground" />
            {booking.guestCount} гостей
          </span>
        </div>
        <div className="space-y-1 text-sm">
          <p className="flex items-center gap-2">
            <User className="size-4 text-muted-foreground" />
            <span>{booking.contactName}</span>
          </p>
          <p className="flex items-center gap-2">
            <Phone className="size-4 text-muted-foreground" />
            <span>{formatPhone(booking.contactPhone)}</span>
          </p>
        </div>
        {booking.message && (
          <p className="border-l-2 border-surface-300 pl-3 text-sm text-muted-foreground">
            {booking.message}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
