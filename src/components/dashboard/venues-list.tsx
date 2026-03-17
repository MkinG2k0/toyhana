"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/shared/empty-state"
import { Building2, Pencil, Trash2 } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"

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
  const [confirmType, setConfirmType] = useState<"visibility" | "delete" | null>(
    null
  )
  const [targetVenue, setTargetVenue] = useState<VenueItem | null>(null)
  const [nextIsActive, setNextIsActive] = useState<boolean | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const openVisibilityDialog = (venue: VenueItem) => {
    setTargetVenue(venue)
    setNextIsActive(!venue.isActive)
    setConfirmType("visibility")
  }

  const openDeleteDialog = (venue: VenueItem) => {
    setTargetVenue(venue)
    setConfirmType("delete")
  }

  const closeDialog = () => {
    if (isSubmitting) return
    setConfirmType(null)
    setTargetVenue(null)
    setNextIsActive(null)
  }

  const handleConfirm = async () => {
    if (!targetVenue || !confirmType) return
    setIsSubmitting(true)
    try {
      if (confirmType === "visibility") {
        if (nextIsActive === null) return
        const res = await fetch(`/api/venues/${targetVenue.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive: nextIsActive }),
        })
        const json = await res.json()
        if (!res.ok) {
          toast.error(json.error ?? "Ошибка изменения статуса")
          return
        }
        toast.success(
          nextIsActive ? "Зал снова отображается в каталоге" : "Зал скрыт"
        )
        window.location.reload()
      } else if (confirmType === "delete") {
        const res = await fetch(`/api/venues/${targetVenue.id}`, {
          method: "DELETE",
        })
        const json = await res.json()
        if (!res.ok) {
          toast.error(json.error ?? "Ошибка удаления")
          return
        }
        const result = json.data as { deleted: boolean; archived: boolean }

        if (result?.archived) {
          toast.success("Зал скрыт и больше не отображается в каталоге.")
        } else {
          toast.success("Зал удалён.")
        }
        window.location.reload()
      }
    } catch {
      toast.error("Что-то пошло не так. Попробуйте ещё раз.")
    } finally {
      setIsSubmitting(false)
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
                        className="text-muted-foreground hover:bg-surface-200"
                        onClick={() => openVisibilityDialog(venue)}
                      >
                        {venue.isActive ? "Скрыть" : "Показать"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => openDeleteDialog(venue)}
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

      <Dialog open={!!confirmType} onOpenChange={closeDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {confirmType === "delete"
                ? "Скрыть зал?"
                : nextIsActive
                  ? "Показать зал в каталоге?"
                  : "Скрыть зал?"}
            </DialogTitle>
            <DialogDescription>
              {confirmType === "delete"
                ? "Зал будет скрыт из каталога и не будет доступен для новых заявок. Существующие данные сохранятся."
                : nextIsActive
                  ? "Зал снова станет виден в каталоге и доступен для заявок."
                  : "Зал перестанет отображаться в каталоге, но данные сохранятся, и вы сможете включить его позже."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={closeDialog}
              disabled={isSubmitting}
            >
              Отмена
            </Button>
            <Button
              type="button"
              className={
                confirmType === "delete"
                  ? "bg-destructive text-white hover:bg-destructive/90"
                  : "bg-brand-500 text-white hover:bg-brand-600"
              }
              onClick={handleConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Подтверждение..."
                : confirmType === "delete"
                  ? "Скрыть"
                  : nextIsActive
                    ? "Показать"
                    : "Скрыть"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
