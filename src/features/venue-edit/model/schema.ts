import { z } from "zod/v4"

const venuePhotoInputSchema = z.object({
  url: z.string().url(),
  key: z.string().min(1),
})

export const createVenueSchema = z.object({
  name: z.string().min(2, "Минимум 2 символа").max(200),
  description: z.string().min(10, "Минимум 10 символов").max(5000),
  address: z.string().min(5, "Укажите адрес"),
  city: z.string().default("Махачкала"),
  district: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  capacityMin: z.number().int().min(10, "Минимум 10 гостей"),
  capacityMax: z.number().int().max(3000, "Максимум 3000 гостей"),
  pricePerPerson: z.number().int().min(100, "Минимум 100 ₽"),
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
  photos: z.array(venuePhotoInputSchema).max(20).optional(),
})

export const updateVenueSchema = createVenueSchema.partial()
