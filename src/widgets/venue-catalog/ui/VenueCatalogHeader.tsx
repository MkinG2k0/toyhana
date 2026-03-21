"use client"

import { OptionsSelect } from "@/shared/ui"
import { pluralize } from "@/shared/lib/utils"
import { VENUE_CATALOG_SORT_OPTIONS } from "../lib/sort-options"
import type { VenueSortOption } from "@/entities/venue"

const headerRowClass =
  "mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"

interface VenueCatalogHeaderProps {
  totalCount: number | undefined
  sort: VenueSortOption | undefined
  onSortChange: (sort: string | null) => void
}

export const VenueCatalogHeader = ({
  totalCount,
  sort,
  onSortChange,
}: VenueCatalogHeaderProps) => (
  <div className={headerRowClass}>
    <div>
      <h1 className="font-display text-2xl font-bold md:text-3xl">
        Банкетные залы
      </h1>
      {totalCount != null ? (
        <p className="mt-1 text-sm text-muted-foreground">
          {pluralize(totalCount, "зал", "зала", "залов")}
        </p>
      ) : null}
    </div>
    <OptionsSelect
      value={sort ?? VENUE_CATALOG_SORT_OPTIONS[0].value}
      onValueChange={onSortChange}
      options={[...VENUE_CATALOG_SORT_OPTIONS]}
      placeholder="Сортировка"
      className="w-48"
    />
  </div>
)
