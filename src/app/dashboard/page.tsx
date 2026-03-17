import { prisma } from "@/shared/lib/prisma"
import { auth } from "@/shared/lib/auth"
import { Card, CardContent } from "@/shared/ui/card"
import { Building2, CalendarDays, Clock, Star } from "lucide-react"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

const getStats = async (ownerId: string) => {
  try {
    const [totalVenues, totalBookings, pendingBookings, totalReviews] =
      await Promise.all([
        prisma.venue.count({ where: { ownerId } }),
        prisma.booking.count({
          where: { venue: { ownerId } },
        }),
        prisma.booking.count({
          where: {
            venue: { ownerId },
            status: "PENDING",
          },
        }),
        prisma.review.count({
          where: { venue: { ownerId } },
        }),
      ])
    return { totalVenues, totalBookings, pendingBookings, totalReviews }
  } catch {
    return {
      totalVenues: 0,
      totalBookings: 0,
      pendingBookings: 0,
      totalReviews: 0,
    }
  }
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  if (session.user.role !== "OWNER" && session.user.role !== "ADMIN") {
    redirect("/")
  }

  const stats = await getStats(session.user.id)

  const STAT_CARDS = [
    {
      label: "Мои залы",
      value: stats.totalVenues,
      icon: Building2,
    },
    {
      label: "Всего заявок",
      value: stats.totalBookings,
      icon: CalendarDays,
    },
    {
      label: "Ожидают ответа",
      value: stats.pendingBookings,
      icon: Clock,
    },
    {
      label: "Отзывов",
      value: stats.totalReviews,
      icon: Star,
    },
  ]

  return (
    <>
      <div className="mb-8">
          <h1 className="font-display text-2xl font-bold md:text-3xl">
            Обзор
          </h1>
          <p className="mt-1 text-muted-foreground">
            Добро пожаловать в панель управления
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STAT_CARDS.map(({ label, value, icon: Icon }) => (
            <Card key={label} className="border-surface-200">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-lg bg-brand-50 p-3">
                  <Icon className="size-6 text-brand-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="text-2xl font-bold">{value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
    </>
  )
}
