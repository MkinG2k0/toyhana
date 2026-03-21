import type { VenueSortOption } from "@/entities/venue"

export const VENUE_CATALOG_SORT_OPTIONS: readonly {
  readonly value: VenueSortOption
  readonly label: string
}[] = [
  { value: "popular", label: "Популярные" },
  { value: "rating", label: "По рейтингу" },
  { value: "price_asc", label: "Сначала дешевле" },
  { value: "price_desc", label: "Сначала дороже" },
  { value: "newest", label: "Новые" },
]

export function isVenueSortOption(value: string): value is VenueSortOption {
  return VENUE_CATALOG_SORT_OPTIONS.some((item) => item.value === value)
}
