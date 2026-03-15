import { z } from "zod/v4"

const RATING_MIN = 1
const RATING_MAX = 5

export const createReviewSchema = z.object({
  venueId: z.string().min(1, "Не указан зал"),
  rating: z
    .number()
    .int()
    .min(RATING_MIN, "Минимальная оценка — 1")
    .max(RATING_MAX, "Максимальная оценка — 5"),
  text: z
    .string()
    .min(10, "Минимум 10 символов")
    .max(2000, "Максимум 2000 символов"),
  foodRating: z.number().int().min(RATING_MIN).max(RATING_MAX).optional(),
  serviceRating: z.number().int().min(RATING_MIN).max(RATING_MAX).optional(),
  ambienceRating: z.number().int().min(RATING_MIN).max(RATING_MAX).optional(),
})

export type CreateReviewInput = z.infer<typeof createReviewSchema>
