import { Badge } from "@/shared/ui/badge"
import { cn } from "@/shared/lib/utils"
import { BOOKING_STATUS_LABELS, BOOKING_STATUS_VARIANTS } from "../model/types"
import type { BookingStatus } from "../model/types"

interface BookingStatusBadgeProps {
  status: BookingStatus
  className?: string
}

export const BookingStatusBadge = ({
  status,
  className,
}: BookingStatusBadgeProps) => {
  const variant =
    BOOKING_STATUS_VARIANTS[status] ?? BOOKING_STATUS_VARIANTS.PENDING

  return (
    <Badge
      variant="outline"
      className={cn("font-medium", variant.className, className)}
    >
      {BOOKING_STATUS_LABELS[status]}
    </Badge>
  )
}
