import type { VenueFilters } from "./types"

export const venueKeys = {
  all: ["venues"] as const,
  lists: () => [...venueKeys.all, "list"] as const,
  list: (filters: VenueFilters) => [...venueKeys.lists(), filters] as const,
  details: () => [...venueKeys.all, "detail"] as const,
  detail: (slug: string) => [...venueKeys.details(), slug] as const,
}
