import { Skeleton } from "@/shared/ui/skeleton";

export default function VenueDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Skeleton className="aspect-[2/1] w-full rounded-xl" />
      <div className="mt-6 flex flex-col gap-8 lg:flex-row">
        <div className="flex-1 space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="mt-4 h-32 w-full" />
        </div>
        <div className="lg:w-80">
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
