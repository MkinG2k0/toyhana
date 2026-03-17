import type { VenueFilters } from "@/entities/venue"

export const DISTRICTS = [
  "Советский",
  "Кировский",
  "Ленинский",
  "Ленинкент",
  "Редукторный",
] as const

export const FEATURE_FILTERS: { key: keyof VenueFilters; label: string }[] = [
  { key: "hasHalalKitchen", label: "Халяль кухня" },
  { key: "allowOwnCook", label: "Можно своего повара" },
  { key: "hasPrayerRoom", label: "Молельная комната" },
  { key: "hasSeparateHalls", label: "Раздельные залы" },
]

export const ALL_DISTRICTS_VALUE = "Все районы"

export const CAPACITY_MIN = 50
export const CAPACITY_MAX = 1000
export const PRICE_MIN = 500
export const PRICE_MAX = 5000
