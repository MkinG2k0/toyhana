export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPAID"
  | "COMPLETED"
  | "CANCELLED"
  | "REJECTED"

export type EventType =
  | "WEDDING"
  | "ENGAGEMENT"
  | "BIRTHDAY"
  | "CORPORATE"
  | "FUNERAL"
  | "OTHER"

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  WEDDING: "Свадьба (Той)",
  ENGAGEMENT: "Помолвка (Сговор)",
  BIRTHDAY: "День рождения",
  CORPORATE: "Корпоратив",
  FUNERAL: "Тазият (поминки)",
  OTHER: "Другое",
}

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: "Ожидает",
  CONFIRMED: "Подтверждена",
  PREPAID: "Предоплата",
  COMPLETED: "Завершена",
  CANCELLED: "Отменена",
  REJECTED: "Отклонена",
}

export interface BookingCard {
  id: string
  eventDate: string
  eventType: EventType
  guestCount: number
  contactName: string
  contactPhone: string
  message: string | null
  status: BookingStatus
  totalPrice: number | null
  createdAt: string
  venue: {
    id: string
    name: string
    slug: string
  }
  client: {
    id: string
    name: string
    phone: string
  }
}

export interface BookingFormData {
  venueId: string
  eventDate: string
  eventType: EventType
  guestCount: number
  contactName: string
  contactPhone: string
  message?: string
}

export interface BookingFilters {
  status?: BookingStatus
  venueId?: string
  page?: number
  limit?: number
}

export interface BookingListResponse {
  bookings: BookingCard[]
  total: number
  page: number
  totalPages: number
}
