"use client"

import { useQuery } from "@tanstack/react-query"
import { bookingKeys } from "./booking-keys"
import type { BookingListResponse, BookingFilters } from "./types"

const STALE_TIME = 1000 * 60 * 2

const fetchBookings = async (filters: BookingFilters): Promise<BookingListResponse> => {
  const params = new URLSearchParams()
  if (filters.status) params.set("status", filters.status)
  if (filters.venueId) params.set("venueId", filters.venueId)
  if (filters.page) params.set("page", String(filters.page))
  if (filters.limit) params.set("limit", String(filters.limit))

  const res = await fetch(`/api/bookings?${params}`)
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? "Не удалось загрузить заявки")
  return json.data
}

export const useBookings = (filters: BookingFilters) => {
  return useQuery({
    queryKey: bookingKeys.list(filters),
    queryFn: () => fetchBookings(filters),
    staleTime: STALE_TIME,
  })
}
