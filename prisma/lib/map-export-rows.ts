import type { Prisma } from "../../generated/prisma/client"

const toDate = (value: string): Date => new Date(value)

const toDateNull = (value: string | null | undefined): Date | null =>
  value == null ? null : new Date(value)

const emptyToNull = (value: string | null | undefined): string | null =>
  value === "" || value == null ? null : value

export const mapOtpCodes = (
  rows: Record<string, unknown>[],
): Prisma.OtpCodeCreateManyInput[] =>
  rows.map((r) => ({
    id: r.id as string,
    phone: r.phone as string,
    code: r.code as string,
    expiresAt: toDate(r.expiresAt as string),
    createdAt: toDate(r.createdAt as string),
  }))

export const mapUsers = (
  rows: Record<string, unknown>[],
): Prisma.UserCreateManyInput[] =>
  rows.map((r) => ({
    id: r.id as string,
    phone: (r.phone as string | null) ?? null,
    email: (r.email as string | null) ?? null,
    name: r.name as string,
    role: r.role as Prisma.UserCreateManyInput["role"],
    avatar: (r.avatar as string | null) ?? null,
    telegramChatId: (r.telegramChatId as string | null) ?? null,
    whatsappPhone: (r.whatsappPhone as string | null) ?? null,
    createdAt: toDate(r.createdAt as string),
    updatedAt: toDate(r.updatedAt as string),
  }))

export const mapVenues = (
  rows: Record<string, unknown>[],
): Prisma.VenueCreateManyInput[] =>
  rows.map((r) => ({
    id: r.id as string,
    slug: r.slug as string,
    name: r.name as string,
    description: r.description as string,
    address: r.address as string,
    city: r.city as string,
    district: emptyToNull(r.district as string | null | undefined),
    latitude: (r.latitude as number | null) ?? null,
    longitude: (r.longitude as number | null) ?? null,
    capacityMin: r.capacityMin as number,
    capacityMax: r.capacityMax as number,
    pricePerPerson: r.pricePerPerson as number,
    rentalPrice: (r.rentalPrice as number | null) ?? null,
    hasHalalKitchen: r.hasHalalKitchen as boolean,
    allowOwnCook: r.allowOwnCook as boolean,
    hasPrayerRoom: r.hasPrayerRoom as boolean,
    hasSeparateHalls: r.hasSeparateHalls as boolean,
    allowOwnFruits: r.allowOwnFruits as boolean,
    hasStage: r.hasStage as boolean,
    hasProjector: r.hasProjector as boolean,
    hasParking: r.hasParking as boolean,
    hasSoundSystem: r.hasSoundSystem as boolean,
    hasWelcomeZone: r.hasWelcomeZone as boolean,
    hasOutdoorArea: r.hasOutdoorArea as boolean,
    cuisineTypes: r.cuisineTypes as string[],
    isActive: r.isActive as boolean,
    isVerified: r.isVerified as boolean,
    isApproved: r.isApproved as boolean,
    isPremium: r.isPremium as boolean,
    premiumUntil: toDateNull(r.premiumUntil as string | null),
    ownerId: r.ownerId as string,
    averageRating: r.averageRating as number,
    reviewCount: r.reviewCount as number,
    viewCount: r.viewCount as number,
    createdAt: toDate(r.createdAt as string),
    updatedAt: toDate(r.updatedAt as string),
  }))

export const mapVenuePhotos = (
  rows: Record<string, unknown>[],
): Prisma.VenuePhotoCreateManyInput[] =>
  rows.map((r) => ({
    id: r.id as string,
    url: r.url as string,
    key: r.key as string,
    order: r.order as number,
    isMain: r.isMain as boolean,
    venueId: r.venueId as string,
  }))

export const mapBlockedDates = (
  rows: Record<string, unknown>[],
): Prisma.BlockedDateCreateManyInput[] =>
  rows.map((r) => ({
    id: r.id as string,
    date: toDate(r.date as string),
    reason: emptyToNull(r.reason as string | null | undefined),
    venueId: r.venueId as string,
  }))

export const mapBookings = (
  rows: Record<string, unknown>[],
): Prisma.BookingCreateManyInput[] =>
  rows.map((r) => ({
    id: r.id as string,
    eventDate: toDate(r.eventDate as string),
    eventType: r.eventType as Prisma.BookingCreateManyInput["eventType"],
    guestCount: r.guestCount as number,
    contactName: r.contactName as string,
    contactPhone: r.contactPhone as string,
    message: (r.message as string | null) ?? null,
    status: r.status as Prisma.BookingCreateManyInput["status"],
    totalPrice: (r.totalPrice as number | null) ?? null,
    prepaidAmount: (r.prepaidAmount as number | null) ?? null,
    paymentId: (r.paymentId as string | null) ?? null,
    paidAt: toDateNull(r.paidAt as string | null),
    venueId: r.venueId as string,
    clientId: r.clientId as string,
    createdAt: toDate(r.createdAt as string),
    updatedAt: toDate(r.updatedAt as string),
  }))

export const mapVenuePlacementRequests = (
  rows: Record<string, unknown>[],
): Prisma.VenuePlacementRequestCreateManyInput[] =>
  rows.map((r) => ({
    id: r.id as string,
    description: r.description as string,
    status: r.status as Prisma.VenuePlacementRequestCreateManyInput["status"],
    adminComment: (r.adminComment as string | null) ?? null,
    userId: r.userId as string,
    createdAt: toDate(r.createdAt as string),
    updatedAt: toDate(r.updatedAt as string),
  }))

export const mapReviews = (
  rows: Record<string, unknown>[],
): Prisma.ReviewCreateManyInput[] =>
  rows.map((r) => ({
    id: r.id as string,
    rating: r.rating as number,
    text: r.text as string,
    foodRating: (r.foodRating as number | null) ?? null,
    serviceRating: (r.serviceRating as number | null) ?? null,
    ambienceRating: (r.ambienceRating as number | null) ?? null,
    isModerated: r.isModerated as boolean,
    venueId: r.venueId as string,
    authorId: r.authorId as string,
    createdAt: toDate(r.createdAt as string),
  }))
