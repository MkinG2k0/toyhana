import { prisma } from "@/shared/lib/prisma"
import { PendingVenuesTable } from "@/features/admin-venues"

export const dynamic = "force-dynamic"

const getPendingVenues = async () => {
  try {
    return await prisma.venue.findMany({
      where: { isActive: true, isApproved: false },
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        name: true,
        slug: true,
        isApproved: true,
        createdAt: true,
        pricePerPerson: true,
        capacityMax: true,
        owner: { select: { name: true, phone: true } },
        photos: {
          where: { isMain: true },
          select: { url: true },
          take: 1,
        },
      },
    })
  } catch {
    return []
  }
}

export default async function AdminVenuesPage() {
  const venues = await getPendingVenues()

  return (
    <>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold md:text-3xl">
          Залы на проверке
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {venues.length > 0
            ? `${venues.length} залов ожидают одобрения`
            : "Нет залов на проверке"}
        </p>
      </div>

      <PendingVenuesTable
        venues={venues.map((v) => ({
          ...v,
          createdAt: v.createdAt.toISOString(),
        }))}
      />
    </>
  )
}
