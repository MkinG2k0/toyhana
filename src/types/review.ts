export interface ReviewCard {
  id: string
  rating: number
  text: string
  foodRating: number | null
  serviceRating: number | null
  ambienceRating: number | null
  createdAt: string
  author: {
    id: string
    name: string
    avatar: string | null
  }
}

export interface ReviewFormData {
  venueId: string
  rating: number
  text: string
  foodRating?: number
  serviceRating?: number
  ambienceRating?: number
}

export interface ReviewListResponse {
  reviews: ReviewCard[]
  total: number
  averageRating: number
}
