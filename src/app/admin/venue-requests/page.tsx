import { prisma } from "@/shared/lib/prisma"
import { VenueRequestsTable } from "@/features/admin-venue-requests"

export const dynamic = "force-dynamic"

const getRequests = async () => {
  try {
    return await prisma.venuePlacementRequest.findMany({
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      take: 200,
      select: {
        id: true,
        description: true,
        status: true,
        adminComment: true,
        createdAt: true,
        user: {
          select: { id: true, name: true, phone: true },
        },
      },
    })
  } catch {
    return []
  }
}

export default async function AdminVenueRequestsPage() {
  const requests = await getRequests()

  const pendingCount = requests.filter((r) => r.status === "PENDING").length

  return (
    <>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold md:text-3xl">
          Заявки на размещение зала
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {pendingCount > 0
            ? `${pendingCount} заявок ожидают рассмотрения`
            : "Нет новых заявок"}
        </p>
      </div>

      <VenueRequestsTable
        requests={requests.map((r) => ({
          ...r,
          createdAt: r.createdAt.toISOString(),
        }))}
      />
    </>
  )
}
