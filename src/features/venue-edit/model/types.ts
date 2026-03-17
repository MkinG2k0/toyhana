import type { z } from "zod/v4"
import type { createVenueSchema } from "./schema"

export type VenueFormValues = z.output<typeof createVenueSchema>

export interface VenueEditData {
  id: string
  name: string
  description: string
  address: string
  city: string
  district: string | null
  capacityMin: number
  capacityMax: number
  pricePerPerson: number
  rentalPrice: number | null
  hasHalalKitchen: boolean
  allowOwnCook: boolean
  hasPrayerRoom: boolean
  hasSeparateHalls: boolean
  allowOwnFruits: boolean
  hasStage: boolean
  hasProjector: boolean
  hasParking: boolean
  hasSoundSystem: boolean
  hasWelcomeZone: boolean
  hasOutdoorArea: boolean
  cuisineTypes: string[]
  photos: {
    id: string
    url: string
    key: string
    order: number
    isMain: boolean
  }[]
}
