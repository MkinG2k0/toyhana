import { NextRequest } from "next/server"
import { prisma } from "@/shared/lib/prisma"
import { venueListSchema } from "@/shared/api/validators"
import { createVenueSchema } from "@/features/venue-edit/model/schema"
import { success, created, error, serverError } from "@/shared/api"
import { requireAuth } from "@/shared/lib/auth-guard"
import { slugify } from "@/shared/lib/utils"

import type { Prisma } from "../../../../generated/prisma/client"

export async function GET(req: NextRequest) {
  try {
    const searchParams = Object.fromEntries(req.nextUrl.searchParams)
    const parsed = venueListSchema.safeParse(searchParams)

    if (!parsed.success) {
      return error(parsed.error.issues[0].message)
    }

    const {
      city,
      district,
      capacityMin,
      capacityMax,
      priceMin,
      priceMax,
      hasHalalKitchen,
      allowOwnCook,
      hasPrayerRoom,
      hasSeparateHalls,
      cuisineType,
      date,
      sort,
      page,
      limit,
    } = parsed.data

    const where: Prisma.VenueWhereInput = {
      isActive: true,
      city,
      ...(district && { district }),
      ...(capacityMin && { capacityMax: { gte: capacityMin } }),
      ...(capacityMax && { capacityMin: { lte: capacityMax } }),
      ...(priceMin && { pricePerPerson: { gte: priceMin } }),
      ...(priceMax && { pricePerPerson: { lte: priceMax } }),
      ...(hasHalalKitchen && { hasHalalKitchen: true }),
      ...(allowOwnCook && { allowOwnCook: true }),
      ...(hasPrayerRoom && { hasPrayerRoom: true }),
      ...(hasSeparateHalls && { hasSeparateHalls: true }),
      ...(cuisineType && { cuisineTypes: { has: cuisineType } }),
      ...(date && {
        blockedDates: { none: { date: new Date(date) } },
      }),
    }

    const orderBy: Prisma.VenueOrderByWithRelationInput =
      sort === "price_asc"
        ? { pricePerPerson: "asc" }
        : sort === "price_desc"
          ? { pricePerPerson: "desc" }
          : sort === "rating"
            ? { averageRating: "desc" }
            : sort === "newest"
              ? { createdAt: "desc" }
              : { viewCount: "desc" }

    const skip = (page - 1) * limit

    const [venues, total] = await Promise.all([
      prisma.venue.findMany({
        where,
        orderBy: [{ isPremium: "desc" }, orderBy],
        skip,
        take: limit,
        select: {
          id: true,
          slug: true,
          name: true,
          district: true,
          city: true,
          capacityMin: true,
          capacityMax: true,
          pricePerPerson: true,
          hasHalalKitchen: true,
          allowOwnCook: true,
          hasPrayerRoom: true,
          hasSeparateHalls: true,
          hasParking: true,
          averageRating: true,
          reviewCount: true,
          isPremium: true,
          photos: {
            where: { isMain: true },
            select: { url: true },
            take: 1,
          },
        },
      }),
      prisma.venue.count({ where }),
    ])

    return success({
      venues,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (err) {
    return serverError(err)
  }
}

export async function POST(req: NextRequest) {
  try {
    const result = await requireAuth(["OWNER", "ADMIN"])
    if (result.error) return result.error

    const body = await req.json()
    const parsed = createVenueSchema.safeParse(body)

    if (!parsed.success) {
      return error(parsed.error.issues[0].message)
    }

    const { photos, ...data } = parsed.data
    const slug = slugify(data.name)

    const existing = await prisma.venue.findUnique({ where: { slug } })
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug

    const venue = await prisma.venue.create({
      data: {
        ...data,
        slug: finalSlug,
        ownerId: result.user.id,
        photos:
          photos && photos.length > 0
            ? {
                create: photos.map((photo, index) => ({
                  url: photo.url,
                  key: photo.key,
                  order: index,
                  isMain: index === 0,
                })),
              }
            : undefined,
      },
      include: {
        photos: true,
      },
    })

    return created(venue)
  } catch (err) {
    return serverError(err)
  }
}
