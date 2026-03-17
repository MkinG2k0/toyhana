import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/shared/lib/prisma"
import { Footer } from "@/widgets/layout"
import { VenueGallery, VenueCalendar, VenueMap } from "@/widgets/venue-detail"
import { VenueFeatureBadges } from "@/entities/venue"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { Separator } from "@/shared/ui/separator"
import { Star, Users, MapPin, Phone, Shield, Crown } from "lucide-react"
import { formatPrice, formatPhone } from "@/shared/lib/utils"
import type { Metadata } from "next"
import type { VenuePhoto } from "@/entities/venue"

interface PageProps {
  params: Promise<{ slug: string }>
}

const getVenue = async (slug: string) => {
  const venue = await prisma.venue.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
      isActive: true,
    },
    include: {
      photos: { orderBy: { order: "asc" } },
      owner: { select: { id: true, name: true, phone: true, email: true } },
      blockedDates: { select: { date: true } },
      reviews: {
        include: {
          author: { select: { id: true, name: true, avatar: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  })

  if (venue) {
    await prisma.venue.update({
      where: { id: venue.id },
      data: { viewCount: { increment: 1 } },
    })
  }

  return venue
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const venue = await getVenue(slug)

  if (!venue) return { title: "Зал не найден" }

  return {
    title: `${venue.name} — от ${formatPrice(venue.pricePerPerson)}/чел, до ${venue.capacityMax} гостей`,
    description: venue.description.slice(0, 160),
    openGraph: {
      title: `${venue.name} | Тойхана`,
      description: venue.description.slice(0, 160),
      images: venue.photos[0]?.url ? [venue.photos[0].url] : [],
    },
  }
}

export default async function VenueDetailPage({ params }: PageProps) {
  const { slug } = await params
  const venue = await getVenue(slug)

  if (!venue) notFound()

  const blockedDatesStr = venue.blockedDates.map((d) =>
    new Date(d.date).toISOString(),
  )

  const photos: VenuePhoto[] = venue.photos.map((p) => ({
    id: p.id,
    url: p.url,
    key: p.key,
    order: p.order,
    isMain: p.isMain,
  }))

  return (
    <>
      <main className="mx-auto max-w-7xl px-4 py-6">
        <VenueGallery photos={photos} venueName={venue.name} />

        <div className="mt-6 flex flex-col gap-8 lg:flex-row">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h1 className="font-display text-2xl font-bold md:text-3xl">
                  {venue.name}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  {venue.reviewCount > 0 && (
                    <span className="flex items-center gap-1">
                      <Star className="size-4 fill-brand-400 text-brand-400" />
                      <span className="font-medium text-foreground">
                        {venue.averageRating.toFixed(1)}
                      </span>
                      &middot; {venue.reviewCount} отзывов
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <MapPin className="size-4" />
                    {venue.district && `${venue.district}, `}
                    {venue.address}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {venue.isVerified && (
                  <Badge
                    variant="secondary"
                    className="bg-green-50 text-green-700"
                  >
                    <Shield className="mr-1 size-3" />
                    Проверен
                  </Badge>
                )}
                {venue.isPremium && (
                  <Badge className="bg-brand-500 text-white">
                    <Crown className="mr-1 size-3" />
                    Премиум
                  </Badge>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="text-sm">
                <Users className="mr-1 size-3.5" />
                {venue.capacityMin}–{venue.capacityMax} гостей
              </Badge>
              <Badge variant="outline" className="text-sm">
                от {formatPrice(venue.pricePerPerson)} / чел.
              </Badge>
              {venue.rentalPrice && (
                <Badge variant="outline" className="text-sm">
                  Аренда: {formatPrice(venue.rentalPrice)}
                </Badge>
              )}
            </div>

            <VenueFeatureBadges venue={venue} className="mt-4" />

            <Separator className="my-6" />

            <Tabs defaultValue="description">
              <TabsList>
                <TabsTrigger value="description">Описание</TabsTrigger>
                <TabsTrigger value="calendar">Календарь</TabsTrigger>
                <TabsTrigger value="reviews">
                  Отзывы ({venue.reviewCount})
                </TabsTrigger>
                {venue.latitude && venue.longitude && (
                  <TabsTrigger value="map">На карте</TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="description" className="mt-4">
                <div className="prose prose-sm max-w-none text-foreground">
                  <p className="whitespace-pre-line">{venue.description}</p>
                </div>
                {venue.cuisineTypes.length > 0 && (
                  <div className="mt-6">
                    <h3 className="mb-2 text-sm font-semibold">Кухня</h3>
                    <div className="flex flex-wrap gap-2">
                      {venue.cuisineTypes.map((c) => (
                        <Badge key={c} variant="secondary">
                          {c}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="calendar" className="mt-4">
                <VenueCalendar blockedDates={blockedDatesStr} />
              </TabsContent>

              <TabsContent value="reviews" className="mt-4">
                {venue.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {venue.reviews.map((review) => (
                      <div
                        key={review.id}
                        className="rounded-xl border border-surface-200 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {review.author.name}
                          </span>
                          <div className="flex items-center gap-1">
                            <Star className="size-4 fill-brand-400 text-brand-400" />
                            <span className="text-sm font-medium">
                              {review.rating}
                            </span>
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {review.text}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Пока нет отзывов. Будьте первым!
                  </p>
                )}
              </TabsContent>

              {venue.latitude && venue.longitude && (
                <TabsContent value="map" className="mt-4">
                  <VenueMap
                    latitude={venue.latitude}
                    longitude={venue.longitude}
                    name={venue.name}
                  />
                </TabsContent>
              )}
            </Tabs>
          </div>

          <aside className="lg:w-80">
            <div className="sticky top-20 rounded-2xl border border-surface-200 p-6">
              <div className="text-center">
                <span className="text-2xl font-bold text-brand-600">
                  {formatPrice(venue.pricePerPerson)}
                </span>
                <span className="text-sm text-muted-foreground"> / чел.</span>
              </div>

              <Button
                size="lg"
                className="mt-4 w-full bg-brand-500 hover:bg-brand-600"
                render={<Link href={`/booking/${venue.id}`} />}
              >
                Оставить заявку
              </Button>

              <Separator className="my-4" />

              <div className="space-y-2 text-sm">
                <p className="font-medium">Контакт владельца</p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="size-4 shrink-0" />
                  {venue.owner.phone
                    ? formatPhone(venue.owner.phone)
                    : (venue.owner.email ?? "—")}
                </p>
              </div>
            </div>
          </aside>
        </div>

        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-surface-200 bg-white p-3 lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-lg font-bold text-brand-600">
                {formatPrice(venue.pricePerPerson)}
              </span>
              <span className="text-xs text-muted-foreground"> / чел.</span>
            </div>
            <Button
              className="bg-brand-500 hover:bg-brand-600"
              render={<Link href={`/booking/${venue.id}`} />}
            >
              Забронировать
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
