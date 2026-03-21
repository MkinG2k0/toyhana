"use client"

import { useCallback } from "react"
import {
  PaginationItem,
  PaginationLink,
} from "@/shared/ui/pagination"

interface VenueCatalogPageLinkProps {
  page: number
  isActive: boolean
  onPageChange: (page: number) => void
}

export const VenueCatalogPageLink = ({
  page,
  isActive,
  onPageChange,
}: VenueCatalogPageLinkProps) => {
  const handleClick = useCallback(() => {
    onPageChange(page)
  }, [page, onPageChange])

  return (
    <PaginationItem>
      <PaginationLink
        isActive={isActive}
        onClick={handleClick}
        className="cursor-pointer"
      >
        {page}
      </PaginationLink>
    </PaginationItem>
  )
}
