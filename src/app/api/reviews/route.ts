import { NextRequest } from "next/server"

import { prisma } from "@/shared/lib/prisma"
import { success, created, error, serverError } from "@/shared/api"
import { requireAuth } from "@/shared/lib/auth-guard"
import { createReviewSchema } from "@/features/review-submit/model/schema"

export async function GET(req: NextRequest) {
  try {
    const venueId = req.nextUrl.searchParams.get("venueId")
    if (!venueId) return error("Не указан зал")

    const reviews = await prisma.review.findMany({
      where: { venueId },
      include: { author: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: "desc" },
      take: 20,
    })

    const venue = await prisma.venue.findUnique({
      where: { id: venueId },
      select: { averageRating: true, reviewCount: true },
    })

    return success({
      reviews,
      total: venue?.reviewCount ?? 0,
      averageRating: venue?.averageRating ?? 0,
    })
  } catch (err) {
    return serverError(err)
  }
}

export async function POST(req: NextRequest) {
  try {
    const result = await requireAuth()
    if (result.error) return result.error

    const body = await req.json()
    const parsed = createReviewSchema.safeParse(body)
    if (!parsed.success) return error(parsed.error.issues[0].message)

    const {
      venueId,
      rating,
      text,
      foodRating,
      serviceRating,
      ambienceRating,
    } = parsed.data

    const venue = await prisma.venue.findUnique({
      where: { id: venueId, isActive: true },
    })
    if (!venue) return error("Зал не найден", 404)

    const existing = await prisma.review.findUnique({
      where: { venueId_authorId: { venueId, authorId: result.user.id } },
    })
    if (existing) return error("Вы уже оставили отзыв об этом зале")

    const review = await prisma.review.create({
      data: {
        venueId,
        authorId: result.user.id,
        rating,
        text,
        foodRating,
        serviceRating,
        ambienceRating,
      },
      include: { author: { select: { id: true, name: true, avatar: true } } },
    })

    const agg = await prisma.review.aggregate({
      where: { venueId },
      _avg: { rating: true },
      _count: { rating: true },
    })

    await prisma.venue.update({
      where: { id: venueId },
      data: {
        averageRating: Math.round((agg._avg.rating ?? 0) * 10) / 10,
        reviewCount: agg._count.rating,
      },
    })

    return created(review)
  } catch (err) {
    return serverError(err)
  }
}
