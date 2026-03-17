export interface ReviewItem {
  id: string
  rating: number
  comment: string
  createdAt: string
  user: {
    id: string
    name: string
    image: string | null
  }
  venue?: {
    id: string
    name: string
    slug: string
  }
}

export interface CreateReviewPayload {
  venueId: string
  rating: number
  comment: string
}

export interface ReviewListResponse {
  reviews: ReviewItem[]
  total: number
}
