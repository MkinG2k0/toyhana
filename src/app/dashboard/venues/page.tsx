import { prisma } from "@/shared/lib/prisma"
import { auth } from "@/shared/lib/auth"
import { redirect } from "next/navigation"
import { VenuesList } from "@/features/venue-manage"

export const dynamic = "force-dynamic"

const getOwnerVenues = async (ownerId: string) => {
  try {
    const venues = await prisma.venue.findMany({
      where: { ownerId },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        slug: true,
        name: true,
        isActive: true,
        isApproved: true,
        reviewCount: true,
        pricePerPerson: true,
        capacityMax: true,
        _count: {
          select: { bookings: true },
        },
        photos: {
          where: { isMain: true },
          select: { url: true },
          take: 1,
        },
      },
    })
    return venues
  } catch {
    return []
  }
}

export default async function DashboardVenuesPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  if (session.user.role !== "OWNER" && session.user.role !== "ADMIN") {
    redirect("/")
  }

  const venues = await getOwnerVenues(session.user.id)

  return <VenuesList venues={venues} />
}
