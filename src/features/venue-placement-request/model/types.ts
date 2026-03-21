export type VenuePlacementRequestStatus = "PENDING" | "APPROVED" | "REJECTED"

export interface VenuePlacementRequestDto {
  id: string
  description: string
  status: VenuePlacementRequestStatus
  adminComment: string | null
  createdAt: string
  updatedAt: string
  userId: string
}
