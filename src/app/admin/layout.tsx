import { redirect } from "next/navigation"
import { auth } from "@/shared/lib/auth"
import { prisma } from "@/shared/lib/prisma"
import { AdminSidebar } from "@/widgets/admin-layout"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) redirect("/login")
  if (session.user.role !== "ADMIN") redirect("/")

  const [pendingRequestsCount, pendingVenuesCount] = await Promise.all([
    prisma.venuePlacementRequest.count({ where: { status: "PENDING" } }),
    prisma.venue.count({ where: { isApproved: false, isActive: true } }),
  ])

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl">
      <aside className="hidden w-60 shrink-0 border-r border-surface-200 bg-surface-50 lg:block">
        <div className="sticky top-16 py-4">
          <div className="px-4 pb-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Администрирование
            </p>
          </div>
          <AdminSidebar
            pendingRequestsCount={pendingRequestsCount}
            pendingVenuesCount={pendingVenuesCount}
          />
        </div>
      </aside>
      <div className="flex-1 p-4 lg:p-6">{children}</div>
    </div>
  )
}
