import Image from "next/image"
import Link from "next/link"
import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { Card } from "@/shared/ui/card"
import { Badge } from "@/shared/ui/badge"
import { formatPrice } from "@/shared/lib/utils"

export interface VenueItem {
  id: string
  slug: string
  name: string
  isActive: boolean
  isApproved: boolean
  reviewCount: number
  pricePerPerson: number
  capacityMax: number
  _count: { bookings: number }
  photos: { url: string }[]
}

interface VenueListItemProps {
  venue: VenueItem
  onVisibilityClick: () => void
  onDeleteClick: () => void
}

export const VenueListItem = ({
  venue,
  onVisibilityClick,
  onDeleteClick,
}: VenueListItemProps) => {
  const mainPhoto = venue.photos[0]?.url ?? "/images/venue-placeholder.webp"

  return (
    <Card className="overflow-hidden border-surface-200 py-0">
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
              <span>от {formatPrice(venue.pricePerPerson)}/чел</span>
              <span>·</span>
              <span>до {venue.capacityMax} гостей</span>
              <span>·</span>
              <span>{venue.reviewCount} отзывов</span>
              <span>·</span>
              <span>{venue._count.bookings} заявок</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge
                variant={venue.isActive ? "default" : "secondary"}
                className={venue.isActive ? "bg-green-600 hover:bg-green-600" : ""}
              >
                {venue.isActive ? "Активен" : "Скрыт"}
              </Badge>
              <Badge
                variant={venue.isApproved ? "outline" : "secondary"}
                className={
                  venue.isApproved
                    ? "border-green-500 text-green-700"
                    : "border-orange-300 text-orange-700"
                }
              >
                {venue.isApproved ? "Одобрен" : "На проверке"}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              render={<Link href={`/dashboard/venues/${venue.id}/edit`} />}
            >
              <Pencil className="size-4" />
              Редактировать
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-muted-foreground hover:bg-surface-200"
              onClick={onVisibilityClick}
            >
              {venue.isActive ? "Скрыть" : "Показать"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={onDeleteClick}
            >
              <Trash2 className="size-4" />
              Удалить
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
