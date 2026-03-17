import { Badge } from "@/shared/ui/badge"
import { cn } from "@/shared/lib/utils"

interface VenueFeatures {
  hasHalalKitchen?: boolean
  allowOwnCook?: boolean
  hasPrayerRoom?: boolean
  hasSeparateHalls?: boolean
  hasParking?: boolean
  hasStage?: boolean
  hasProjector?: boolean
  hasSoundSystem?: boolean
  hasWelcomeZone?: boolean
  hasOutdoorArea?: boolean
}

interface VenueFeatureBadgesProps {
  venue: VenueFeatures
  className?: string
  limit?: number
}

const FEATURE_CONFIG: {
  key: keyof VenueFeatures
  label: string
  emoji: string
}[] = [
  { key: "hasHalalKitchen", label: "Халяль", emoji: "🍖" },
  { key: "allowOwnCook", label: "Свой повар", emoji: "👨‍🍳" },
  { key: "hasPrayerRoom", label: "Молельная", emoji: "🕌" },
  { key: "hasSeparateHalls", label: "Раздельные залы", emoji: "🚪" },
  { key: "hasParking", label: "Парковка", emoji: "🅿️" },
  { key: "hasStage", label: "Сцена", emoji: "🎤" },
  { key: "hasSoundSystem", label: "Звук", emoji: "🔊" },
  { key: "hasProjector", label: "Проектор", emoji: "📽️" },
  { key: "hasWelcomeZone", label: "Велком зона", emoji: "🎪" },
  { key: "hasOutdoorArea", label: "Летняя площадка", emoji: "🌿" },
]

export const VenueFeatureBadges = ({
  venue,
  className,
  limit,
}: VenueFeatureBadgesProps) => {
  const activeFeatures = FEATURE_CONFIG.filter((f) => venue[f.key])
  const visibleFeatures = limit
    ? activeFeatures.slice(0, limit)
    : activeFeatures
  const remaining = limit ? activeFeatures.length - limit : 0

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {visibleFeatures.map((feature) => (
        <Badge
          key={feature.key}
          variant="secondary"
          className="bg-surface-100 text-xs font-normal"
        >
          {feature.emoji} {feature.label}
        </Badge>
      ))}
      {remaining > 0 && (
        <Badge
          variant="secondary"
          className="bg-surface-100 text-xs font-normal"
        >
          +{remaining}
        </Badge>
      )}
    </div>
  )
}
