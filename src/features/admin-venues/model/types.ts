export interface PendingVenueDto {
  id: string
  name: string
  slug: string
  isApproved: boolean
  createdAt: string
  pricePerPerson: number
  capacityMax: number
  owner: {
    name: string
    phone: string | null
  }
  photos: { url: string }[]
}
