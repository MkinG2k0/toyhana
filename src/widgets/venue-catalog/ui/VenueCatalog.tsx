"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  buildVenueCatalogSearchParams,
  parseRawSearchParamsToVenueListParams,
  venueListParamsSignature,
  venueListParamsToFilters,
  useVenues,
  type VenueFilters,
  type VenueListResponse,
} from "@/entities/venue";
import { VenueFilters as VenueFiltersPanel } from "@/features/venue-search";
import { isVenueSortOption } from "../lib/sort-options";
import { VenueCatalogHeader } from "./VenueCatalogHeader";
import { VenueCatalogResults } from "./VenueCatalogResults";

interface VenueCatalogProps {
  initialData?: VenueListResponse;
  filtersSignature: string;
}

export const VenueCatalog = ({
  initialData,
  filtersSignature,
}: VenueCatalogProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const listParams = useMemo(() => {
    const raw: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      raw[key] = value;
    });
    return parseRawSearchParamsToVenueListParams(raw);
  }, [searchParams]);

  const filters = useMemo(
    () => venueListParamsToFilters(listParams),
    [listParams],
  );

  const clientSignature = useMemo(
    () => venueListParamsSignature(listParams),
    [listParams],
  );

  const effectiveInitialData =
    initialData && clientSignature === filtersSignature
      ? initialData
      : undefined;

  const { data, isLoading } = useVenues(filters, {
    initialData: effectiveInitialData,
  });

  const replaceCatalogUrl = useCallback(
    (next: VenueFilters) => {
      const params = buildVenueCatalogSearchParams(next);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  const handleSortChange = useCallback(
    (sort: string | null) => {
      if (!sort || !isVenueSortOption(sort)) return;
      replaceCatalogUrl({
        ...filters,
        sort,
        page: 1,
      });
    },
    [filters, replaceCatalogUrl],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      replaceCatalogUrl({ ...filters, page });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [filters, replaceCatalogUrl],
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <VenueCatalogHeader
        totalCount={data?.total}
        sort={filters.sort}
        onSortChange={handleSortChange}
      />

      <div className="flex gap-8">
        <div className="hidden lg:block">
          <VenueFiltersPanel
            filters={filters}
            onFiltersChange={replaceCatalogUrl}
          />
        </div>

        <div className="flex-1">
          <VenueCatalogResults
            isLoading={isLoading}
            data={data}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </main>
  );
};
