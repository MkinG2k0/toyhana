import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SearchBar } from "@/components/shared/search-bar";
import { PostRegisterRoleSync } from "@/components/shared/post-register-role-sync";
import { VenueCard } from "@/components/venues/venue-card";
import { prisma } from "@/lib/prisma";
import {
  Building2,
  Star,
  Clock,
  Heart,
  Gem,
  PartyPopper,
  Cake,
  Briefcase,
} from "lucide-react";

import type { VenueCard as VenueCardType } from "@/types/venue";

export const dynamic = "force-dynamic";

const getTopVenues = async (): Promise<VenueCardType[]> => {
  try {
    const venues = await prisma.venue.findMany({
      where: { isActive: true },
      orderBy: [{ isPremium: "desc" }, { averageRating: "desc" }],
      take: 6,
      select: {
        id: true,
        slug: true,
        name: true,
        district: true,
        city: true,
        capacityMin: true,
        capacityMax: true,
        pricePerPerson: true,
        hasHalalKitchen: true,
        allowOwnCook: true,
        hasPrayerRoom: true,
        hasSeparateHalls: true,
        hasParking: true,
        averageRating: true,
        reviewCount: true,
        isPremium: true,
        photos: {
          where: { isMain: true },
          select: { url: true },
          take: 1,
        },
      },
    });
    return venues;
  } catch {
    return [];
  }
};

const BENEFITS = [
  {
    icon: Building2,
    title: "Все залы в одном месте",
    description: "Более 200 банкетных залов Махачкалы с актуальными ценами",
  },
  {
    icon: Star,
    title: "Реальные отзывы и рейтинги",
    description: "Честные отзывы от людей, которые уже проводили мероприятия",
  },
  {
    icon: Clock,
    title: "Бронирование за 2 минуты",
    description: "Оставьте заявку онлайн — владелец зала свяжется с вами",
  },
];

const EVENT_TYPES = [
  { label: "Свадьба", href: "/venues?eventType=WEDDING", icon: Heart },
  { label: "Помолвка", href: "/venues?eventType=ENGAGEMENT", icon: Gem },
  { label: "День рождения", href: "/venues?eventType=BIRTHDAY", icon: Cake },
  {
    label: "Корпоратив",
    href: "/venues?eventType=CORPORATE",
    icon: Briefcase,
  },
];

interface HomePageProps {
  searchParams: Promise<{ fromRegister?: string | string[] }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const topVenues = await getTopVenues();
  const params = await searchParams;

  return (
    <>
      <PostRegisterRoleSync fromRegister={params?.fromRegister} />
      <Header />
      <main>
        {/* Hero */}
        <section className="relative bg-brand-900 px-4 py-20 text-white md:py-32">
          <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-30" />
          <div className="relative mx-auto max-w-4xl text-center">
            <h1 className="font-display text-3xl font-bold leading-tight md:text-5xl">
              Найдите идеальный зал для вашего торжества
            </h1>
            <p className="mt-4 text-lg text-white/80 md:text-xl">
              200+ банкетных залов Махачкалы и Дагестана
            </p>
            <SearchBar className="mx-auto mt-8 max-w-md" />
          </div>
        </section>

        {/* Benefits */}
        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="grid gap-6 md:grid-cols-3">
            {BENEFITS.map((b) => (
              <Card key={b.title} className="border-surface-200">
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="mb-4 rounded-full bg-brand-50 p-3">
                    <b.icon className="size-6 text-brand-500" />
                  </div>
                  <h3 className="font-semibold">{b.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {b.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Top Venues */}
        {topVenues.length > 0 && (
          <section className="bg-surface-50 px-4 py-16">
            <div className="mx-auto max-w-7xl">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold md:text-3xl">
                  Популярные залы
                </h2>
                <Button variant="outline" render={<Link href="/venues" />}>
                  Все залы
                </Button>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {topVenues.map((venue) => (
                  <VenueCard key={venue.id} venue={venue} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Event Types */}
        <section className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="mb-8 text-center font-display text-2xl font-bold md:text-3xl">
            По типу мероприятия
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {EVENT_TYPES.map((et) => (
              <Link key={et.label} href={et.href}>
                <Badge
                  variant="secondary"
                  className="cursor-pointer px-4 py-2 text-sm transition-colors hover:bg-brand-50 hover:text-brand-600"
                >
                  <et.icon className="mr-1.5 size-4" />
                  {et.label}
                </Badge>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA for owners */}
        <section className="bg-brand-500 px-4 py-16 text-white">
          <div className="mx-auto max-w-2xl text-center">
            <PartyPopper className="mx-auto mb-4 size-10" />
            <h2 className="font-display text-2xl font-bold md:text-3xl">
              Вы владелец зала?
            </h2>
            <p className="mt-2 text-white/90">
              Разместите свой зал бесплатно и получайте заявки от клиентов
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="mt-6"
              render={<Link href="/register" />}
            >
              Разместить зал
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
