import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { updateVenueSchema } from "@/validators/venue"
import { success, error, notFound, serverError } from "@/lib/api-response"
import { requireAuth } from "@/lib/auth-guard"

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(_req: NextRequest, ctx: RouteContext) {
  try {
    const { id } = await ctx.params

    const venue = await prisma.venue.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
        isActive: true,
      },
      include: {
        photos: { orderBy: { order: "asc" } },
        owner: { select: { id: true, name: true, phone: true } },
        blockedDates: { select: { date: true } },
      },
    })

    if (!venue) return notFound("Зал")

    await prisma.venue.update({
      where: { id: venue.id },
      data: { viewCount: { increment: 1 } },
    })

    return success(venue)
  } catch (err) {
    return serverError(err)
  }
}

export async function PUT(req: NextRequest, ctx: RouteContext) {
  try {
    const { id } = await ctx.params
    const result = await requireAuth(["OWNER", "ADMIN"])
    if (result.error) return result.error

    const venue = await prisma.venue.findUnique({
      where: { id },
      select: { ownerId: true },
    })

    if (!venue) return notFound("Зал")
    if (venue.ownerId !== result.user.id && result.user.role !== "ADMIN") {
      return error("Вы не можете редактировать этот зал", 403)
    }

    const body = await req.json()
    const parsed = updateVenueSchema.safeParse(body)

    if (!parsed.success) {
      return error(parsed.error.issues[0].message)
    }

    const updated = await prisma.venue.update({
      where: { id },
      data: parsed.data,
    })

    return success(updated)
  } catch (err) {
    return serverError(err)
  }
}

export async function DELETE(_req: NextRequest, ctx: RouteContext) {
  try {
    const { id } = await ctx.params
    const result = await requireAuth(["OWNER", "ADMIN"])
    if (result.error) return result.error

    const venue = await prisma.venue.findUnique({
      where: { id },
      select: { ownerId: true },
    })

    if (!venue) return notFound("Зал")
    if (venue.ownerId !== result.user.id && result.user.role !== "ADMIN") {
      return error("Вы не можете удалить этот зал", 403)
    }

    await prisma.venue.update({
      where: { id },
      data: { isActive: false },
    })

    return success({ deleted: true })
  } catch (err) {
    return serverError(err)
  }
}
