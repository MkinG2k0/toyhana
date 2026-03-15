export interface VenuePhoto {
  id: string
  url: string
  key: string
  order: number
  isMain: boolean
}

export interface VenueCard {
  id: string
  slug: string
  name: string
  district: string | null
  city: string
  capacityMin: number
  capacityMax: number
  pricePerPerson: number
  hasHalalKitchen: boolean
  allowOwnCook: boolean
  hasPrayerRoom: boolean
  hasSeparateHalls: boolean
  hasParking: boolean
  averageRating: number
  reviewCount: number
  isPremium: boolean
  photos: Pick<VenuePhoto, "url">[]
}

export interface VenueDetail {
  id: string
  slug: string
  name: string
  description: string
  address: string
  city: string
  district: string | null
  latitude: number | null
  longitude: number | null
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
  photos: VenuePhoto[]
  averageRating: number
  reviewCount: number
  viewCount: number
  isPremium: boolean
  isVerified: boolean
  owner: {
    id: string
    name: string
    phone: string
  }
  blockedDates: { date: string }[]
}

export interface VenueFilters {
  city?: string
  district?: string
  capacityMin?: number
  capacityMax?: number
  priceMin?: number
  priceMax?: number
  hasHalalKitchen?: boolean
  allowOwnCook?: boolean
  hasPrayerRoom?: boolean
  hasSeparateHalls?: boolean
  cuisineType?: string
  date?: string
  sort?: VenueSortOption
  page?: number
  limit?: number
}

export type VenueSortOption =
  | "price_asc"
  | "price_desc"
  | "rating"
  | "newest"
  | "popular"

export interface VenueListResponse {
  venues: VenueCard[]
  total: number
  page: number
  totalPages: number
}

export interface VenueFormData {
  name: string
  description: string
  address: string
  city: string
  district?: string
  latitude?: number
  longitude?: number
  capacityMin: number
  capacityMax: number
  pricePerPerson: number
  rentalPrice?: number
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
}
