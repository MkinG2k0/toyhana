"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

import type { BookingStatus } from "@/types/booking"
import { BOOKING_STATUS_LABELS } from "@/types/booking"

const STATUS_VARIANTS: Record<
  BookingStatus,
  { className: string }
> = {
  PENDING: { className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  CONFIRMED: { className: "bg-green-100 text-green-800 border-green-200" },
  CANCELLED: { className: "bg-red-100 text-red-800 border-red-200" },
  REJECTED: { className: "bg-red-100 text-red-800 border-red-200" },
  COMPLETED: { className: "bg-blue-100 text-blue-800 border-blue-200" },
  PREPAID: { className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
}

interface BookingStatusBadgeProps {
  status: BookingStatus
  className?: string
}

export const BookingStatusBadge = ({
  status,
  className,
}: BookingStatusBadgeProps) => {
  const variant = STATUS_VARIANTS[status] ?? STATUS_VARIANTS.PENDING

  return (
    <Badge
      variant="outline"
      className={cn("font-medium", variant.className, className)}
    >
      {BOOKING_STATUS_LABELS[status]}
    </Badge>
  )
}
