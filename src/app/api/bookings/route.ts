import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { bookingListSchema, createBookingSchema } from "@/validators/booking"
import { success, created, error, notFound, serverError } from "@/lib/api-response"
import { requireAuth } from "@/lib/auth-guard"

export async function POST(req: NextRequest) {
  try {
    const result = await requireAuth(["CLIENT", "OWNER", "ADMIN"])
    if (result.error) return result.error

    const body = await req.json()
    const parsed = createBookingSchema.safeParse(body)
    if (!parsed.success) {
      return error(parsed.error.issues[0].message)
    }

    const { venueId, eventDate, eventType, guestCount, contactName, contactPhone, message } = parsed.data

    const venue = await prisma.venue.findUnique({
      where: { id: venueId, isActive: true },
      select: {
        id: true,
        capacityMin: true,
        capacityMax: true,
      },
    })
    if (!venue) return notFound("Зал")

    if (guestCount < venue.capacityMin || guestCount > venue.capacityMax) {
      return error(
        `Этот зал вмещает от ${venue.capacityMin} до ${venue.capacityMax} гостей`,
      )
    }

    const date = new Date(eventDate)
    const blocked = await prisma.blockedDate.findUnique({
      where: {
        venueId_date: { venueId, date },
      },
    })
    if (blocked) return error("Эта дата уже занята")

    const booking = await prisma.booking.create({
      data: {
        venueId,
        clientId: result.user.id,
        eventDate: date,
        eventType,
        guestCount,
        contactName,
        contactPhone,
        message: message ?? null,
      },
    })

    return created(booking)
  } catch (err) {
    return serverError(err)
  }
}

export async function GET(req: NextRequest) {
  try {
    const result = await requireAuth(["OWNER", "ADMIN"])
    if (result.error) return result.error

    const searchParams = Object.fromEntries(req.nextUrl.searchParams)
    const parsed = bookingListSchema.safeParse(searchParams)
    if (!parsed.success) {
      return error(parsed.error.issues[0].message)
    }

    const { status, venueId, page, limit } = parsed.data
    const skip = (page - 1) * limit

    const where =
      result.user.role === "ADMIN"
        ? {}
        : { venue: { ownerId: result.user.id } }

    if (status) {
      Object.assign(where, { status })
    }
    if (venueId) {
      Object.assign(where, { venueId })
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          eventDate: true,
          eventType: true,
          guestCount: true,
          contactName: true,
          contactPhone: true,
          message: true,
          status: true,
          createdAt: true,
          venue: { select: { id: true, name: true, slug: true } },
          client: { select: { id: true, name: true, phone: true } },
        },
      }),
      prisma.booking.count({ where }),
    ])

    return success({
      bookings: bookings.map((b) => ({
        ...b,
        eventDate: b.eventDate.toISOString(),
        createdAt: b.createdAt.toISOString(),
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (err) {
    return serverError(err)
  }
}
