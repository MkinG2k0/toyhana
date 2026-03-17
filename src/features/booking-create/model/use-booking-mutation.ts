"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { bookingKeys } from "@/entities/booking"
import type { CreateBookingFormValues } from "./schema"

const postBooking = async (data: CreateBookingFormValues) => {
  const res = await fetch("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? "Не удалось создать заявку")
  return json.data
}

export const useBookingMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all })
    },
  })
}
