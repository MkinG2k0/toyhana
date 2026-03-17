import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { EmptyState } from "@/shared/ui/EmptyState";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { formatDate, formatPrice } from "@/shared/lib/utils";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Ожидает подтверждения",
  CONFIRMED: "Подтверждена",
  PREPAID: "Предоплата внесена",
  COMPLETED: "Завершена",
  CANCELLED: "Отменена",
  REJECTED: "Отклонена",
};

const STATUS_VARIANTS: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-800 border-amber-200",
  CONFIRMED: "bg-emerald-50 text-emerald-800 border-emerald-200",
  PREPAID: "bg-sky-50 text-sky-800 border-sky-200",
  COMPLETED: "bg-slate-50 text-slate-800 border-slate-200",
  CANCELLED: "bg-rose-50 text-rose-800 border-rose-200",
  REJECTED: "bg-rose-50 text-rose-800 border-rose-200",
};

export default async function ClientBookingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "CLIENT") {
    redirect("/");
  }

  const bookings = await prisma.booking.findMany({
    where: { clientId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      eventDate: true,
      eventType: true,
      guestCount: true,
      contactName: true,
      contactPhone: true,
      message: true,
      status: true,
      createdAt: true,
      venue: {
        select: {
          id: true,
          name: true,
          slug: true,
          district: true,
          address: true,
          capacityMin: true,
          capacityMax: true,
          pricePerPerson: true,
        },
      },
    },
  });

  if (!bookings.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-display text-2xl font-bold md:text-3xl">
          Мои бронирования
        </h1>
        <p className="mt-1 text-muted-foreground">
          Здесь будут отображаться ваши заявки на бронирование залов.
        </p>
        <div className="mt-8">
          <EmptyState
            icon={<CalendarDays className="h-12 w-12" />}
            title="У вас пока нет заявок"
            description="Найдите подходящий зал и отправьте первую заявку на бронирование."
            action={
              <Link
                href="/venues"
                className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600"
              >
                Перейти к залам
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold md:text-3xl">
          Мои бронирования
        </h1>
        <p className="mt-1 text-muted-foreground">
          Все ваши заявки на бронирование залов.
        </p>
      </div>

      <div className="space-y-4">
        {bookings.map((booking) => {
          const statusLabel =
            STATUS_LABELS[booking.status] ?? booking.status.toLowerCase();
          const statusClasses =
            STATUS_VARIANTS[booking.status] ??
            "bg-surface-100 text-foreground border-surface-300";

          return (
            <Card
              key={booking.id}
              className="border-surface-200 hover:border-brand-200 transition-colors"
            >
              <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                <div>
                  <CardTitle className="text-base md:text-lg">
                    <Link
                      href={`/venues/${booking.venue.slug}`}
                      className="hover:underline"
                    >
                      {booking.venue.name}
                    </Link>
                  </CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground md:text-sm">
                    Заявка от{" "}
                    {formatDate(new Date(booking.createdAt.toISOString()))}
                  </p>
                </div>
                <Badge
                  className={`border text-xs md:text-sm ${statusClasses}`}
                >
                  {statusLabel}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3 text-sm md:text-base">
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    <span>
                      Дата: {formatDate(new Date(booking.eventDate.toISOString()))}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Гостей: {booking.guestCount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {booking.venue.district
                        ? `${booking.venue.district}, ${booking.venue.address}`
                        : booking.venue.address}
                    </span>
                  </div>
                </div>
                {booking.message && (
                  <div className="rounded-lg bg-surface-100 p-3 text-xs text-muted-foreground md:text-sm">
                    <p className="mb-1 font-medium text-foreground">
                      Пожелания к бронированию
                    </p>
                    <p className="whitespace-pre-line">{booking.message}</p>
                  </div>
                )}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-muted-foreground md:text-sm">
                    Контакт: {booking.contactName}, {booking.contactPhone}
                  </div>
                  <div className="text-sm font-semibold text-brand-700">
                    Ориентировочно от{" "}
                    {formatPrice(
                      booking.guestCount * booking.venue.pricePerPerson,
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

