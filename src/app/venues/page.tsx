"use client";

import { useState, useCallback } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { VenueCard } from "@/components/venues/venue-card";
import { VenueFilters } from "@/components/venues/venue-filters";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useVenues } from "@/hooks/use-venues";
import { pluralize } from "@/lib/utils";

import type {
  VenueFilters as VenueFiltersType,
  VenueSortOption,
} from "@/types/venue";

const SORT_OPTIONS: { value: VenueSortOption; label: string }[] = [
  { value: "popular", label: "Популярные" },
  { value: "rating", label: "По рейтингу" },
  { value: "price_asc", label: "Сначала дешевле" },
  { value: "price_desc", label: "Сначала дороже" },
  { value: "newest", label: "Новые" },
];

export default function VenuesPage() {
  const [filters, setFilters] = useState<VenueFiltersType>({
    page: 1,
    sort: "popular",
  });

  const { data, isLoading } = useVenues(filters);

  const handleFiltersChange = useCallback((newFilters: VenueFiltersType) => {
    setFilters(newFilters);
  }, []);

  const handleSortChange = useCallback(
    (sort: string | null) => {
      if (!sort) return;
      setFilters({ ...filters, sort: sort as VenueSortOption, page: 1 });
    },
    [filters],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setFilters({ ...filters, page });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [filters],
  );

  return (
    <>
      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold md:text-3xl">
              Банкетные залы
            </h1>
            {data && (
              <p className="mt-1 text-sm text-muted-foreground">
                {pluralize(data.total, "зал", "зала", "залов")}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-8">
          <div className="hidden lg:block">
            <VenueFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </div>

          <div className="flex-1">
            {isLoading ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <VenueCardSkeleton key={i} />
                ))}
              </div>
            ) : data && data.venues.length > 0 ? (
              <>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {data.venues.map((venue) => (
                    <VenueCard key={venue.id} venue={venue} />
                  ))}
                </div>

                {data.totalPages > 1 && (
                  <Pagination className="mt-8">
                    <PaginationContent>
                      {data.page > 1 && (
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => handlePageChange(data.page - 1)}
                            className="cursor-pointer"
                          />
                        </PaginationItem>
                      )}
                      {Array.from({ length: data.totalPages }, (_, i) => i + 1)
                        .filter(
                          (p) =>
                            p === 1 ||
                            p === data.totalPages ||
                            Math.abs(p - data.page) <= 2,
                        )
                        .map((p) => (
                          <PaginationItem key={p}>
                            <PaginationLink
                              isActive={p === data.page}
                              onClick={() => handlePageChange(p)}
                              className="cursor-pointer"
                            >
                              {p}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                      {data.page < data.totalPages && (
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => handlePageChange(data.page + 1)}
                            className="cursor-pointer"
                          />
                        </PaginationItem>
                      )}
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            ) : (
              <EmptyState
                title="Залы не найдены"
                description="Попробуйте изменить параметры поиска или сбросить фильтры"
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

const VenueCardSkeleton = () => (
  <div className="overflow-hidden rounded-xl border border-surface-200">
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
);
