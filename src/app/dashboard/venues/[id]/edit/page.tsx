import { prisma } from "@/shared/lib/prisma"
import { auth } from "@/shared/lib/auth"
import { redirect, notFound } from "next/navigation"
import { VenueEditForm } from "@/features/venue-edit"

export const dynamic = "force-dynamic"

interface EditPageProps {
  params: Promise<{ id: string }>
}

export default async function VenueEditPage({ params }: EditPageProps) {
  const { id } = await params
  const session = await auth()

  if (!session?.user) redirect("/login")
  if (session.user.role !== "OWNER" && session.user.role !== "ADMIN") {
    redirect("/")
  }

  const venue = await prisma.venue.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      address: true,
      city: true,
      district: true,
      capacityMin: true,
      capacityMax: true,
      pricePerPerson: true,
      rentalPrice: true,
      hasHalalKitchen: true,
      allowOwnCook: true,
      hasPrayerRoom: true,
      hasSeparateHalls: true,
      allowOwnFruits: true,
      hasStage: true,
      hasProjector: true,
      hasParking: true,
      hasSoundSystem: true,
      hasWelcomeZone: true,
      hasOutdoorArea: true,
      cuisineTypes: true,
      photos: {
        select: {
          id: true,
          url: true,
          key: true,
          order: true,
          isMain: true,
        },
        orderBy: { order: "asc" },
      },
      ownerId: true,
    },
  })

  if (!venue) notFound()
  if (venue.ownerId !== session.user.id && session.user.role !== "ADMIN") {
    redirect("/dashboard/venues")
  }

  return (
    <div>
      <VenueEditForm venue={venue} />
    </div>
  )
}
