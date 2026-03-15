"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/shared/empty-state"
import { Building2, Pencil, Trash2 } from "lucide-react"
import { formatPrice } from "@/lib/utils"

interface VenueItem {
  id: string
  slug: string
  name: string
  isActive: boolean
  reviewCount: number
  pricePerPerson: number
  capacityMax: number
  _count: { bookings: number }
  photos: { url: string }[]
}

interface VenuesListProps {
  venues: VenueItem[]
}

export const VenuesList = ({ venues }: VenuesListProps) => {
  const handleDelete = async (id: string) => {
    if (!confirm("Удалить зал? Он будет скрыт из каталога.")) return
    try {
      const res = await fetch(`/api/venues/${id}`, { method: "DELETE" })
      if (res.ok) {
        window.location.reload()
      } else {
        const { error } = await res.json()
        alert(error ?? "Ошибка удаления")
      }
    } catch {
      alert("Ошибка удаления")
    }
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold md:text-3xl">
            Мои залы
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {venues.length} {venues.length === 1 ? "зал" : "залов"}
          </p>
        </div>
        <Button
          className="bg-brand-500 hover:bg-brand-600"
          render={<Link href="/dashboard/venues/new" />}
        >
          Добавить зал
        </Button>
      </div>

      {venues.length === 0 ? (
        <EmptyState
          icon={<Building2 className="size-12" />}
          title="Нет залов"
          description="Добавьте первый зал, чтобы получать заявки от клиентов"
          action={
            <Button
              className="bg-brand-500 hover:bg-brand-600"
              render={<Link href="/dashboard/venues/new" />}
            >
              Добавить зал
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {venues.map((venue) => {
            const mainPhoto = venue.photos[0]?.url ?? "/images/venue-placeholder.webp"
            return (
              <Card
                key={venue.id}
                className="overflow-hidden border-surface-200"
              >
                <div className="flex flex-col gap-4 p-4 sm:flex-row">
                  <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-40">
                    <Image
                      src={mainPhoto}
                      alt={venue.name}
                      fill
                      className="object-cover"
                      sizes="160px"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <div>
                      <h3 className="font-semibold">{venue.name}</h3>
                      <div className="mt-1 flex flex-wrap gap-2 text-sm text-muted-foreground">
                        <span>
                          от {formatPrice(venue.pricePerPerson)}/чел
                        </span>
                        <span>·</span>
                        <span>до {venue.capacityMax} гостей</span>
                        <span>·</span>
                        <span>{venue.reviewCount} отзывов</span>
                        <span>·</span>
                        <span>{venue._count.bookings} заявок</span>
                      </div>
                      <div className="mt-2">
                        <Badge
                          variant={venue.isActive ? "default" : "secondary"}
                          className={
                            venue.isActive
                              ? "bg-green-600 hover:bg-green-600"
                              : ""
                          }
                        >
                          {venue.isActive ? "Активен" : "Скрыт"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        render={
                          <Link
                            href={`/dashboard/venues/${venue.id}/edit`}
                          />
                        }
                      >
                        <Pencil className="size-4" />
                        Редактировать
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDelete(venue.id)}
                      >
                        <Trash2 className="size-4" />
                        Удалить
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </>
  )
}
