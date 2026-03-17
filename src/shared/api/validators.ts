import { z } from "zod/v4"

export const bookingListSchema = z.object({
  status: z
    .enum(["PENDING", "CONFIRMED", "PREPAID", "COMPLETED", "CANCELLED", "REJECTED"])
    .optional(),
  venueId: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
})

export type BookingListParams = z.infer<typeof bookingListSchema>

export const updateBookingStatusSchema = z.object({
  status: z.enum(["CONFIRMED", "REJECTED", "CANCELLED"]),
  message: z.string().max(500).optional(),
})

export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>

export const venueListSchema = z.object({
  city: z.string().default("Махачкала"),
  district: z.string().optional(),
  capacityMin: z.coerce.number().int().positive().optional(),
  capacityMax: z.coerce.number().int().positive().optional(),
  priceMin: z.coerce.number().int().nonnegative().optional(),
  priceMax: z.coerce.number().int().positive().optional(),
  hasHalalKitchen: z.string().transform((v) => v === "true").optional(),
  allowOwnCook: z.string().transform((v) => v === "true").optional(),
  hasPrayerRoom: z.string().transform((v) => v === "true").optional(),
  hasSeparateHalls: z.string().transform((v) => v === "true").optional(),
  cuisineType: z.string().optional(),
  date: z.string().optional(),
  sort: z
    .enum(["price_asc", "price_desc", "rating", "newest", "popular"])
    .default("popular"),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
})

export type VenueListParams = z.infer<typeof venueListSchema>
