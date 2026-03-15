import { Skeleton } from "@/components/ui/skeleton"

export default function VenuesLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Skeleton className="mb-2 h-8 w-48" />
      <Skeleton className="mb-6 h-5 w-32" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-surface-200"
          >
            <Skeleton className="aspect-[4/3] w-full" />
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
        ))}
      </div>
    </div>
  )
}
