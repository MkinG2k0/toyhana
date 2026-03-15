import { z } from "zod/v4"

export const venueListSchema = z.object({
  city: z.string().default("Махачкала"),
  district: z.string().optional(),
  capacityMin: z.coerce.number().int().positive().optional(),
  capacityMax: z.coerce.number().int().positive().optional(),
  priceMin: z.coerce.number().int().nonnegative().optional(),
  priceMax: z.coerce.number().int().positive().optional(),
  hasHalalKitchen: z
    .string()
    .transform((v) => v === "true")
    .optional(),
  allowOwnCook: z
    .string()
    .transform((v) => v === "true")
    .optional(),
  hasPrayerRoom: z
    .string()
    .transform((v) => v === "true")
    .optional(),
  hasSeparateHalls: z
    .string()
    .transform((v) => v === "true")
    .optional(),
  cuisineType: z.string().optional(),
  date: z.string().optional(),
  sort: z
    .enum(["price_asc", "price_desc", "rating", "newest", "popular"])
    .default("popular"),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
})

export type VenueListParams = z.infer<typeof venueListSchema>

export const createVenueSchema = z.object({
  name: z.string().min(2, "Минимум 2 символа").max(200),
  description: z.string().min(10, "Минимум 10 символов").max(5000),
  address: z.string().min(5, "Укажите адрес"),
  city: z.string().default("Махачкала"),
  district: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  capacityMin: z
    .number()
    .int()
    .min(10, "Минимум 10 гостей"),
  capacityMax: z
    .number()
    .int()
    .max(3000, "Максимум 3000 гостей"),
  pricePerPerson: z
    .number()
    .int()
    .min(100, "Минимум 100 ₽"),
  rentalPrice: z.number().int().positive().optional(),
  hasHalalKitchen: z.boolean().default(true),
  allowOwnCook: z.boolean().default(false),
  hasPrayerRoom: z.boolean().default(false),
  hasSeparateHalls: z.boolean().default(false),
  allowOwnFruits: z.boolean().default(true),
  hasStage: z.boolean().default(false),
  hasProjector: z.boolean().default(false),
  hasParking: z.boolean().default(false),
  hasSoundSystem: z.boolean().default(false),
  hasWelcomeZone: z.boolean().default(false),
  hasOutdoorArea: z.boolean().default(false),
  cuisineTypes: z.array(z.string()).default([]),
})

export type CreateVenueInput = z.infer<typeof createVenueSchema>

export const updateVenueSchema = createVenueSchema.partial()

export type UpdateVenueInput = z.infer<typeof updateVenueSchema>
