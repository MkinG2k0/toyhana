import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/shared/lib/prisma";
import { Footer } from "@/widgets/layout";
import { BookingForm } from "@/features/booking-create";
import { Button } from "@/shared/ui/button";
import { formatPrice } from "@/shared/lib/utils";
import { ArrowLeft, Users, MapPin } from "lucide-react";

import type { Metadata } from "next";

export const revalidate = 3600;
export const dynamicParams = true;

interface PageProps {
  params: Promise<{ venueId: string }>;
}

export async function generateStaticParams() {
  const venues = await prisma.venue.findMany({
    where: { isActive: true },
    select: { id: true },
  });
  return venues.map((v) => ({ venueId: v.id }));
}

const getVenue = async (venueId: string) => {
  return prisma.venue.findFirst({
    where: {
      OR: [{ id: venueId }, { slug: venueId }],
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      address: true,
      district: true,
      capacityMin: true,
      capacityMax: true,
      pricePerPerson: true,
      photos: {
        where: { isMain: true },
        select: { url: true },
        take: 1,
      },
    },
  });
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { venueId } = await params;
  const venue = await getVenue(venueId);

  if (!venue) {
    return { title: "Зал не найден" };
  }

  return {
    title: `Бронирование — ${venue.name} | Тойхана`,
    description: `Оставить заявку на бронирование зала «${venue.name}» в Махачкале.`,
  };
}

export default async function BookingPage({ params }: PageProps) {
  const { venueId } = await params;
  const venue = await getVenue(venueId);

  if (!venue) notFound();

  const mainPhoto = venue.photos[0]?.url;
  return (
    <>
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            render={<Link href={`/venues/${venue.slug}`} />}
            className="gap-2 text-muted-foreground"
          >
            <ArrowLeft className="size-4" />
            Назад к залу
          </Button>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          <div className="flex-1">
            <h1 className="font-display text-2xl font-bold md:text-3xl">
              Оставить заявку
            </h1>
            <p className="mt-2 text-muted-foreground">
              Заполните форму, и владелец зала свяжется с вами для уточнения
              деталей.
            </p>

            <div className="mt-6">
              <BookingForm
                venueId={venue.id}
                venueName={venue.name}
                capacityMin={venue.capacityMin}
                capacityMax={venue.capacityMax}
              />
            </div>
          </div>

          <aside className="lg:w-80 lg:shrink-0">
            <div className="sticky top-20 rounded-2xl border border-surface-200 overflow-hidden bg-surface-50">
              {mainPhoto && (
                <div className="relative aspect-4/3 bg-surface-200">
                  <Image
                    src={mainPhoto}
                    alt={venue.name}
                    fill
                    sizes="320px"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="font-display text-xl font-semibold">
                  {venue.name}
                </h2>
                <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {venue.district && (
                    <p className="flex items-center gap-2">
                      <MapPin className="size-4 shrink-0" />
                      {venue.district}, {venue.address}
                    </p>
                  )}
                  <p className="flex items-center gap-2">
                    <Users className="size-4 shrink-0" />
                    {venue.capacityMin}–{venue.capacityMax} гостей
                  </p>
                </div>
                <div className="mt-4 border-t border-surface-200 pt-4">
                  <span className="text-xl font-bold text-brand-600">
                    от {formatPrice(venue.pricePerPerson)}
                  </span>
                  <span className="text-sm text-muted-foreground"> / чел.</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
