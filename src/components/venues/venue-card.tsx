import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Star, Users, MapPin, Crown } from "lucide-react"
import { formatPrice, cn } from "@/lib/utils"
import { VenueFeatureBadges } from "./venue-features"

import type { VenueCard as VenueCardType } from "@/types/venue"

interface VenueCardProps {
  venue: VenueCardType
  className?: string
}

export const VenueCard = ({ venue, className }: VenueCardProps) => {
  const mainPhoto = venue.photos[0]?.url ?? "/images/placeholder/venue-1.jpg"

  return (
    <Link href={`/venues/${venue.slug}`}>
      <Card
        className={cn(
          "group overflow-hidden border-surface-200 transition-shadow hover:shadow-lg",
          className
        )}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={mainPhoto}
            alt={venue.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {venue.isPremium && (
            <Badge className="absolute left-3 top-3 bg-brand-500 text-white">
              <Crown className="mr-1 size-3" />
              Премиум
            </Badge>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold leading-tight">{venue.name}</h3>
            {venue.reviewCount > 0 && (
              <div className="flex shrink-0 items-center gap-1 text-sm">
                <Star className="size-4 fill-brand-400 text-brand-400" />
                <span className="font-medium">
                  {venue.averageRating.toFixed(1)}
                </span>
                <span className="text-muted-foreground">
                  ({venue.reviewCount})
                </span>
              </div>
            )}
          </div>

          {venue.district && (
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="size-3.5" />
              {venue.district}, {venue.city}
            </p>
          )}

          <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="size-3.5" />
            {venue.capacityMin}–{venue.capacityMax} гостей
          </div>

          <VenueFeatureBadges venue={venue} className="mt-3" limit={3} />

          <div className="mt-3 border-t border-surface-200 pt-3">
            <span className="text-lg font-bold text-brand-600">
              {formatPrice(venue.pricePerPerson)}
            </span>
            <span className="text-sm text-muted-foreground"> / персона</span>
          </div>
        </div>
      </Card>
    </Link>
  )
}
