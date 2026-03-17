export const reviewKeys = {
  all: ["reviews"] as const,
  lists: () => [...reviewKeys.all, "list"] as const,
  byVenue: (venueId: string) =>
    [...reviewKeys.lists(), "venue", venueId] as const,
  byUser: () => [...reviewKeys.lists(), "user"] as const,
}
