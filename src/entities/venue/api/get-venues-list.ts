import { prisma } from "@/shared/lib/prisma";
import type { VenueListParams } from "@/shared/api/validators";
import type { VenueListResponse } from "../model/types";
import type { Prisma } from "../../../../generated/prisma/client";

const DEFAULT_PARAMS: VenueListParams = {
  city: "Махачкала",
  sort: "popular",
  page: 1,
  limit: 12,
};

export async function getVenuesList(
  params: Partial<VenueListParams> = {},
): Promise<VenueListResponse> {
  const {
    city = DEFAULT_PARAMS.city,
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
    sort = DEFAULT_PARAMS.sort,
    page = DEFAULT_PARAMS.page,
    limit = DEFAULT_PARAMS.limit,
  } = { ...DEFAULT_PARAMS, ...params };

  const where: Prisma.VenueWhereInput = {
    isActive: true,
    city,
    ...(district && { district }),
    ...(capacityMin != null && { capacityMax: { gte: capacityMin } }),
    ...(capacityMax != null && { capacityMin: { lte: capacityMax } }),
    ...(priceMin != null && { pricePerPerson: { gte: priceMin } }),
    ...(priceMax != null && { pricePerPerson: { lte: priceMax } }),
    ...(hasHalalKitchen && { hasHalalKitchen: true }),
    ...(allowOwnCook && { allowOwnCook: true }),
    ...(hasPrayerRoom && { hasPrayerRoom: true }),
    ...(hasSeparateHalls && { hasSeparateHalls: true }),
    ...(cuisineType && { cuisineTypes: { has: cuisineType } }),
    ...(date && {
      blockedDates: { none: { date: new Date(date) } },
    }),
  };

  const orderBy: Prisma.VenueOrderByWithRelationInput =
    sort === "price_asc"
      ? { pricePerPerson: "asc" }
      : sort === "price_desc"
        ? { pricePerPerson: "desc" }
        : sort === "rating"
          ? { averageRating: "desc" }
          : sort === "newest"
            ? { createdAt: "desc" }
            : { viewCount: "desc" };

  const skip = (page - 1) * limit;

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
  ]);

  return {
    venues,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}
