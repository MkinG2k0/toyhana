import { Skeleton } from "@/components/ui/skeleton";

export default function BookingLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="mb-6 h-8 w-32" />
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        <div className="flex-1 space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-full max-w-md" />
          <div className="mt-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <aside className="lg:w-80 lg:shrink-0">
          <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
          <div className="mt-4 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </aside>
      </div>
    </div>
  );
}
