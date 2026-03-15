import type { VenueFilters } from "@/types/venue"
import type { BookingFilters } from "@/types/booking"

export const venueKeys = {
  all: ["venues"] as const,
  lists: () => [...venueKeys.all, "list"] as const,
  list: (filters: VenueFilters) => [...venueKeys.lists(), filters] as const,
  details: () => [...venueKeys.all, "detail"] as const,
  detail: (slug: string) => [...venueKeys.details(), slug] as const,
}

export const bookingKeys = {
  all: ["bookings"] as const,
  lists: () => [...bookingKeys.all, "list"] as const,
  list: (filters: BookingFilters) =>
    [...bookingKeys.lists(), filters] as const,
}

export const reviewKeys = {
  all: ["reviews"] as const,
  byVenue: (venueId: string) => [...reviewKeys.all, "venue", venueId] as const,
}
