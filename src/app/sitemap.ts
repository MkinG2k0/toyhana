import { prisma } from "@/shared/lib/prisma"
import type { MetadataRoute } from "next"

const BASE_URL = process.env.NEXTAUTH_URL ?? "https://toykhana.ru"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/venues`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/login`,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/register`,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ]

  try {
    const venues = await prisma.venue.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
      take: 5000,
    })

    const venueRoutes: MetadataRoute.Sitemap = venues.map((venue) => ({
      url: `${BASE_URL}/venues/${venue.slug}`,
      lastModified: venue.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))

    return [...staticRoutes, ...venueRoutes]
  } catch {
    return staticRoutes
  }
}
