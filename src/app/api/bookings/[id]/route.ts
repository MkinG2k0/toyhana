import { NextRequest } from "next/server"
import { prisma } from "@/shared/lib/prisma"
import { updateBookingStatusSchema } from "@/shared/api/validators"
import { success, error, notFound, serverError } from "@/shared/api"
import { requireAuth } from "@/shared/lib/auth-guard"

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function PATCH(req: NextRequest, ctx: RouteContext) {
  try {
    const { id } = await ctx.params
    const result = await requireAuth(["OWNER", "ADMIN"])
    if (result.error) return result.error

    const booking = await prisma.booking.findUnique({
      where: { id },
      select: {
        id: true,
        venueId: true,
        status: true,
        eventDate: true,
        venue: { select: { ownerId: true } },
      },
    })

    if (!booking) return notFound("Заявка")
    if (
      booking.venue.ownerId !== result.user.id &&
      result.user.role !== "ADMIN"
    ) {
      return error("Недостаточно прав", 403)
    }

    const body = await req.json()
    const parsed = updateBookingStatusSchema.safeParse(body)
    if (!parsed.success) {
      return error(parsed.error.issues[0].message)
    }

    const { status } = parsed.data

    if (status === "CONFIRMED") {
      const blocked = await prisma.blockedDate.findUnique({
        where: {
          venueId_date: {
            venueId: booking.venueId,
            date: booking.eventDate,
          },
        },
      })
      if (blocked) {
        return error("Эта дата уже занята")
      }
      await prisma.$transaction([
        prisma.booking.update({
          where: { id },
          data: { status },
        }),
        prisma.blockedDate.create({
          data: {
            venueId: booking.venueId,
            date: booking.eventDate,
            reason: "Забронировано",
          },
        }),
      ])
    } else {
      await prisma.booking.update({
        where: { id },
        data: { status },
      })
    }

    const updated = await prisma.booking.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        eventDate: true,
        eventType: true,
        guestCount: true,
        contactName: true,
        contactPhone: true,
      },
    })

    return success(updated)
  } catch (err) {
    return serverError(err)
  }
}
