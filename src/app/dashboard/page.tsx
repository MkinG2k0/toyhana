import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/shared/lib/auth";
import { Card, CardContent } from "@/shared/ui/card";
import { Building2, CalendarDays, Clock, Star } from "lucide-react";
import { redirect } from "next/navigation";
import { PlacementRequestBanner } from "@/features/venue-placement-request";
import { PostLoginIntentSync } from "@/shared/ui/PostLoginIntentSync";

export const dynamic = "force-dynamic";

const getPlacementRequest = async (userId: string) => {
  try {
    return await prisma.venuePlacementRequest.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        description: true,
        status: true,
        adminComment: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
      },
    });
  } catch {
    return null;
  }
};

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
      ]);
    return { totalVenues, totalBookings, pendingBookings, totalReviews };
  } catch {
    return {
      totalVenues: 0,
      totalBookings: 0,
      pendingBookings: 0,
      totalReviews: 0,
    };
  }
};

interface DashboardPageProps {
  searchParams: Promise<{ intent?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "OWNER" && session.user.role !== "ADMIN") {
    redirect("/");
  }

  const params = await searchParams;
  const [stats, placementRequest] = await Promise.all([
    getStats(session.user.id),
    getPlacementRequest(session.user.id),
  ]);

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
  ];

  const serializedRequest = placementRequest
    ? {
        ...placementRequest,
        createdAt: placementRequest.createdAt.toISOString(),
        updatedAt: placementRequest.updatedAt.toISOString(),
      }
    : null;

  return (
    <>
      <PostLoginIntentSync intent={params?.intent} />

      {session.user.role === "OWNER" && (
        <PlacementRequestBanner request={serializedRequest} />
      )}

      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold md:text-3xl">Обзор</h1>
        <p className="mt-1 text-muted-foreground">
          Добро пожаловать в панель управления
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="border-surface-200">
            <CardContent className="flex items-center gap-4 ">
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
  );
}
