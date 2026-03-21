"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"
import { Building2 } from "lucide-react"
import { Card, CardContent } from "@/shared/ui/card"
import { Button } from "@/shared/ui/button"
import { EmptyState } from "@/shared/ui/EmptyState"
import { formatPrice } from "@/shared/lib/utils"
import { approveVenue } from "../api/adminVenueApi"
import type { PendingVenueDto } from "../model/types"

interface PendingVenuesTableProps {
  venues: PendingVenueDto[]
}

interface VenueCardProps {
  venue: PendingVenueDto
  onApprove: (id: string) => Promise<void>
  isProcessing: boolean
}

const VenueCard = ({ venue, onApprove, isProcessing }: VenueCardProps) => {
  const mainPhoto =
    venue.photos[0]?.url ?? "/images/venue-placeholder.webp"

  const handleApprove = useCallback(
    () => onApprove(venue.id),
    [onApprove, venue.id]
  )

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
            <Link
              href={`/venues/${venue.slug}`}
              target="_blank"
              className="font-semibold hover:text-brand-600 hover:underline"
            >
              {venue.name}
            </Link>
            <div className="mt-1 flex flex-wrap gap-2 text-sm text-muted-foreground">
              <span>{formatPrice(venue.pricePerPerson)}/чел</span>
              <span>·</span>
              <span>до {venue.capacityMax} гостей</span>
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              <span className="font-medium">{venue.owner.name}</span>
              {venue.owner.phone && <span> · {venue.owner.phone}</span>}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Добавлен{" "}
              {formatDistanceToNow(new Date(venue.createdAt), {
                addSuffix: true,
                locale: ru,
              })}
            </p>
          </div>
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700"
            onClick={handleApprove}
            disabled={isProcessing}
          >
            {isProcessing ? "Одобрение..." : "Одобрить"}
          </Button>
        </div>
      </div>
    </Card>
  )
}

export const PendingVenuesTable = ({ venues }: PendingVenuesTableProps) => {
  const router = useRouter()
  const [processingId, setProcessingId] = useState<string | null>(null)

  const handleApprove = useCallback(
    async (id: string) => {
      setProcessingId(id)
      try {
        await approveVenue(id)
        toast.success("Зал одобрен и теперь отображается в каталоге")
        router.refresh()
      } catch {
        toast.error("Ошибка при одобрении зала")
      } finally {
        setProcessingId(null)
      }
    },
    [router]
  )

  if (venues.length === 0) {
    return (
      <EmptyState
        icon={<Building2 className="size-12" />}
        title="Нет залов на проверке"
        description="Новые залы от владельцев появятся здесь"
      />
    )
  }

  return (
    <div className="space-y-4">
      {venues.map((venue) => (
        <VenueCard
          key={venue.id}
          venue={venue}
          onApprove={handleApprove}
          isProcessing={processingId === venue.id}
        />
      ))}
    </div>
  )
}
