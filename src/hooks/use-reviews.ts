"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { reviewKeys, venueKeys } from "./query-keys"
import type { ReviewFormData, ReviewListResponse } from "@/types/review"

const fetchReviews = async (venueId: string): Promise<ReviewListResponse> => {
  const res = await fetch(`/api/reviews?venueId=${venueId}`)
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? "Ошибка загрузки отзывов")
  return json.data
}

const postReview = async (data: ReviewFormData): Promise<unknown> => {
  const res = await fetch("/api/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? "Ошибка создания отзыва")
  return json.data
}

export const useReviews = (venueId: string) => {
  return useQuery({
    queryKey: reviewKeys.byVenue(venueId),
    queryFn: () => fetchReviews(venueId),
    enabled: !!venueId,
  })
}

export const useCreateReview = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: postReview,
    onSuccess: (_data, variables) => {
      const { venueId } = variables as ReviewFormData
      queryClient.invalidateQueries({ queryKey: reviewKeys.byVenue(venueId) })
      queryClient.invalidateQueries({ queryKey: venueKeys.all })
    },
  })
}
