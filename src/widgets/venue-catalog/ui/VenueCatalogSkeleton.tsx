import { Skeleton } from "@/shared/ui/skeleton"
import { VENUE_CATALOG_GRID_CLASS } from "../lib/layout-classes"

const SKELETON_GRID_COUNT = 6

const venueCardSkeletonWrapClass =
  "overflow-hidden rounded-xl border border-surface-200"

const VenueCardSkeleton = () => (
  <div className={venueCardSkeletonWrapClass}>
    <Skeleton className="aspect-4/3 w-full" />
    <div className="space-y-3 p-4">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
      </div>
      <Skeleton className="h-6 w-24" />
    </div>
  </div>
)

export const VenueCatalogGridSkeleton = () => (
  <div className={VENUE_CATALOG_GRID_CLASS}>
    {Array.from({ length: SKELETON_GRID_COUNT }, (_, i) => (
      <VenueCardSkeleton key={i} />
    ))}
  </div>
)

export const VenueCatalogSuspenseFallback = () => (
  <main className="mx-auto max-w-7xl px-4 py-6">
    <Skeleton className="mb-2 h-8 w-48" />
    <Skeleton className="mb-6 h-5 w-32" />
    <VenueCatalogGridSkeleton />
  </main>
)
