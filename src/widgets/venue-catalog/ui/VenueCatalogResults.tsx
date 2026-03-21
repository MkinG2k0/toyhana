"use client"

import { useCallback } from "react"
import { VenueCard, type VenueListResponse } from "@/entities/venue"
import { EmptyState } from "@/shared/ui/EmptyState"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/ui/pagination"
import { VENUE_CATALOG_GRID_CLASS } from "../lib/layout-classes"
import { VenueCatalogGridSkeleton } from "./VenueCatalogSkeleton"
import { VenueCatalogPageLink } from "./VenueCatalogPageLink"

interface VenueCatalogResultsProps {
  isLoading: boolean
  data: VenueListResponse | undefined
  onPageChange: (page: number) => void
}

const VISIBLE_PAGE_RADIUS = 2

const getVisiblePages = (totalPages: number, current: number): number[] =>
  Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) =>
      p === 1 ||
      p === totalPages ||
      Math.abs(p - current) <= VISIBLE_PAGE_RADIUS,
  )

export const VenueCatalogResults = ({
  isLoading,
  data,
  onPageChange,
}: VenueCatalogResultsProps) => {
  const handlePrevPage = useCallback(() => {
    if (!data || data.page <= 1) return
    onPageChange(data.page - 1)
  }, [data, onPageChange])

  const handleNextPage = useCallback(() => {
    if (!data || data.page >= data.totalPages) return
    onPageChange(data.page + 1)
  }, [data, onPageChange])

  if (isLoading) {
    return <VenueCatalogGridSkeleton />
  }

  if (data && data.venues.length > 0) {
    const visiblePages = getVisiblePages(data.totalPages, data.page)

    return (
      <>
        <div className={VENUE_CATALOG_GRID_CLASS}>
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
                    onClick={handlePrevPage}
                    className="cursor-pointer"
                  />
                </PaginationItem>
              )}
              {visiblePages.map((p) => (
                <VenueCatalogPageLink
                  key={p}
                  page={p}
                  isActive={p === data.page}
                  onPageChange={onPageChange}
                />
              ))}
              {data.page < data.totalPages && (
                <PaginationItem>
                  <PaginationNext
                    onClick={handleNextPage}
                    className="cursor-pointer"
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        )}
      </>
    )
  }

  return (
    <EmptyState
      title="Залы не найдены"
      description="Попробуйте изменить параметры поиска или сбросить фильтры"
    />
  )
}
