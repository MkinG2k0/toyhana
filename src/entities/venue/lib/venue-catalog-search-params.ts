import { venueListSchema } from "@/shared/api/validators"
import type { VenueListParams } from "@/shared/api/validators"
import type { VenueFilters } from "../model/types"

const DEFAULT_CITY = "Махачкала"
const DEFAULT_SORT = "popular"
const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 12

const BOOLEAN_FILTER_KEYS = [
  "hasHalalKitchen",
  "allowOwnCook",
  "hasPrayerRoom",
  "hasSeparateHalls",
] as const satisfies readonly (keyof VenueFilters)[]

function setOptionalNumberParam(
  params: URLSearchParams,
  key: string,
  value: number | null | undefined,
): void {
  if (value != null) {
    params.set(key, String(value))
  }
}

export function parseRawSearchParamsToVenueListParams(
  raw: Record<string, string | string[] | undefined>,
): VenueListParams {
  const flat: Record<string, string> = {}
  for (const [key, value] of Object.entries(raw)) {
    if (value === undefined || value === "") continue
    flat[key] = Array.isArray(value) ? (value[0] ?? "") : value
  }
  const parsed = venueListSchema.safeParse(flat)
  if (!parsed.success) {
    return venueListSchema.parse({})
  }
  return parsed.data
}

export function venueListParamsToFilters(params: VenueListParams): VenueFilters {
  return {
    city: params.city,
    district: params.district,
    capacityMin: params.capacityMin,
    capacityMax: params.capacityMax,
    priceMin: params.priceMin,
    priceMax: params.priceMax,
    hasHalalKitchen: params.hasHalalKitchen,
    allowOwnCook: params.allowOwnCook,
    hasPrayerRoom: params.hasPrayerRoom,
    hasSeparateHalls: params.hasSeparateHalls,
    cuisineType: params.cuisineType,
    date: params.date,
    sort: params.sort,
    page: params.page,
    limit: params.limit,
  }
}

export function venueListParamsSignature(params: VenueListParams): string {
  return JSON.stringify(params)
}

export function buildVenueCatalogSearchParams(filters: VenueFilters): URLSearchParams {
  const params = new URLSearchParams()

  if (filters.city && filters.city !== DEFAULT_CITY) {
    params.set("city", filters.city)
  }
  if (filters.district) {
    params.set("district", filters.district)
  }

  setOptionalNumberParam(params, "capacityMin", filters.capacityMin)
  setOptionalNumberParam(params, "capacityMax", filters.capacityMax)
  setOptionalNumberParam(params, "priceMin", filters.priceMin)
  setOptionalNumberParam(params, "priceMax", filters.priceMax)

  for (const key of BOOLEAN_FILTER_KEYS) {
    if (filters[key]) {
      params.set(key, "true")
    }
  }

  if (filters.cuisineType) {
    params.set("cuisineType", filters.cuisineType)
  }
  if (filters.date) {
    params.set("date", filters.date)
  }
  if (filters.sort && filters.sort !== DEFAULT_SORT) {
    params.set("sort", filters.sort)
  }
  if (filters.page != null && filters.page > DEFAULT_PAGE) {
    params.set("page", String(filters.page))
  }
  if (filters.limit != null && filters.limit !== DEFAULT_LIMIT) {
    params.set("limit", String(filters.limit))
  }

  return params
}
