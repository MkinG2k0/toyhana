import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { bookingKeys } from "./query-keys"

import type { CreateBookingInput } from "@/validators/booking"
import type { BookingFilters } from "@/types/booking"

async function createBooking(data: CreateBookingInput) {
  const res = await fetch("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const { error } = await res.json()
    throw new Error(error ?? "Не удалось создать заявку")
  }
  const { data: booking } = await res.json()
  return booking
}

export function useCreateBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all })
      toast.success("Заявка отправлена! Владелец зала свяжется с вами.")
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}

interface BookingListResponse {
  bookings: Array<{
    id: string
    eventDate: string
    eventType: string
    guestCount: number
    contactName: string
    contactPhone: string
    message: string | null
    status: string
    createdAt: string
    venue: { id: string; name: string; slug: string }
    client: { id: string; name: string; phone: string }
  }>
  total: number
  page: number
  totalPages: number
}

async function fetchBookings(filters: BookingFilters): Promise<BookingListResponse> {
  const params = new URLSearchParams()
  if (filters.status) params.set("status", filters.status)
  if (filters.venueId) params.set("venueId", filters.venueId)
  if (filters.page) params.set("page", String(filters.page))
  if (filters.limit) params.set("limit", String(filters.limit))

  const res = await fetch(`/api/bookings?${params}`)
  if (!res.ok) {
    const { error } = await res.json()
    throw new Error(error ?? "Не удалось загрузить заявки")
  }
  const { data } = await res.json()
  return data
}

export function useBookings(filters: BookingFilters) {
  return useQuery({
    queryKey: bookingKeys.list(filters),
    queryFn: () => fetchBookings(filters),
  })
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string
      status: "CONFIRMED" | "REJECTED" | "CANCELLED"
    }) => {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error ?? "Не удалось обновить статус")
      }
      const { data } = await res.json()
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all })
      toast.success("Статус обновлён")
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}
