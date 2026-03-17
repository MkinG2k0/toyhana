"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { reviewKeys } from "@/entities/review"
import { venueKeys } from "@/entities/venue"
import type { CreateReviewFormValues } from "./schema"

const postReview = async (data: CreateReviewFormValues) => {
  const res = await fetch("/api/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? "Ошибка создания отзыва")
  return json.data
}

export const useReviewMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postReview,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: reviewKeys.byVenue(variables.venueId),
      })
      queryClient.invalidateQueries({ queryKey: venueKeys.all })
    },
  })
}
