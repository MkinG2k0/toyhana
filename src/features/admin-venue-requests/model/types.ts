export type VenuePlacementRequestStatus = "PENDING" | "APPROVED" | "REJECTED"

export interface VenuePlacementRequestWithUser {
  id: string
  description: string
  status: VenuePlacementRequestStatus
  adminComment: string | null
  createdAt: string
  user: {
    id: string
    name: string
    phone: string | null
  }
}
