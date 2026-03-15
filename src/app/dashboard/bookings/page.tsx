"use client"

import { useState, useCallback } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/shared/empty-state"
import { Skeleton } from "@/components/ui/skeleton"
import { useBookings, useUpdateBookingStatus } from "@/hooks/use-bookings"
import { formatDate, formatDateShort } from "@/lib/utils"
import { CalendarDays, Check, X } from "lucide-react"
import {
  BOOKING_STATUS_LABELS,
  EVENT_TYPE_LABELS,
  type BookingStatus,
} from "@/types/booking"

const STATUS_OPTIONS: { value: "all" | BookingStatus; label: string }[] = [
  { value: "all", label: "Все статусы" },
  { value: "PENDING", label: "Ожидает" },
  { value: "CONFIRMED", label: "Подтверждена" },
  { value: "REJECTED", label: "Отклонена" },
  { value: "COMPLETED", label: "Завершена" },
]

export default function DashboardBookingsPage() {
  const [statusFilter, setStatusFilter] = useState<"all" | BookingStatus>("all")
  const filters: { status?: BookingStatus; page: number; limit: number } = {
    status: statusFilter === "all" ? undefined : statusFilter,
    page: 1,
    limit: 20,
  }

  const { data, isLoading } = useBookings(filters)
  const updateStatus = useUpdateBookingStatus()

  const handleStatusChange = useCallback((value: string | null) => {
    setStatusFilter((value ?? "all") as "all" | BookingStatus)
  }, [])

  const handleConfirm = useCallback(
    (id: string) => {
      updateStatus.mutate({ id, status: "CONFIRMED" })
    },
    [updateStatus]
  )

  const handleReject = useCallback(
    (id: string) => {
      updateStatus.mutate({ id, status: "REJECTED" })
    },
    [updateStatus]
  )

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold md:text-3xl">
            Входящие заявки
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {data?.total ?? 0} заявок
          </p>
        </div>
        <Select
          value={statusFilter || "all"}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Фильтр по статусу" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((o) => (
              <SelectItem
                key={o.value || "all"}
                value={o.value || "all"}
              >
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!data?.bookings.length ? (
        <EmptyState
          icon={<CalendarDays className="size-12" />}
          title="Нет заявок"
          description="Заявки на бронирование появятся здесь"
        />
      ) : (
        <div className="space-y-4">
          {data.bookings.map((booking) => (
            <Card key={booking.id} className="border-surface-200">
              <CardContent className="p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">
                        {booking.venue.name}
                      </h3>
                      <Badge variant="secondary">
                        {BOOKING_STATUS_LABELS[booking.status as keyof typeof BOOKING_STATUS_LABELS] ?? booking.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatDateShort(booking.eventDate)} ·{" "}
                        {EVENT_TYPE_LABELS[booking.eventType as keyof typeof EVENT_TYPE_LABELS] ?? booking.eventType}
                      </span>
                    </div>
                    <p className="mt-1 text-sm">
                      {booking.contactName} · {booking.contactPhone}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {booking.guestCount} гостей
                    </p>
                    {booking.message && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {booking.message}
                      </p>
                    )}
                  </div>
                  {booking.status === "PENDING" && (
                    <div className="flex shrink-0 gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleConfirm(booking.id)}
                        disabled={updateStatus.isPending}
                      >
                        <Check className="size-4" />
                        Подтвердить
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(booking.id)}
                        disabled={updateStatus.isPending}
                      >
                        <X className="size-4" />
                        Отклонить
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
