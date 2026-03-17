"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { bookingKeys } from "@/entities/booking"
import type { BookingStatus } from "@/entities/booking"

const updateBookingStatus = async ({
  id,
  status,
}: {
  id: string
  status: BookingStatus
}) => {
  const res = await fetch(`/api/bookings/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? "Не удалось обновить статус")
  return json.data
}

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateBookingStatus,
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: bookingKeys.all })
      const previous = queryClient.getQueryData(bookingKeys.lists())

      queryClient.setQueriesData(
        { queryKey: bookingKeys.lists() },
        (old: unknown) => {
          if (
            !old ||
            typeof old !== "object" ||
            !("bookings" in old) ||
            !Array.isArray((old as { bookings: unknown[] }).bookings)
          )
            return old
          const typed = old as { bookings: { id: string; status: string }[] }
          return {
            ...typed,
            bookings: typed.bookings.map((b) =>
              b.id === id ? { ...b, status } : b
            ),
          }
        }
      )

      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueriesData(
          { queryKey: bookingKeys.lists() },
          context.previous
        )
      }
      toast.error("Не удалось обновить статус")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all })
    },
    onSuccess: () => {
      toast.success("Статус обновлён")
    },
  })
}
