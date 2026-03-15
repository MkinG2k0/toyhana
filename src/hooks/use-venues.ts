"use client"

import {
  useQuery,
  keepPreviousData,
} from "@tanstack/react-query"
import { venueKeys } from "./query-keys"

import type { VenueFilters, VenueListResponse, VenueDetail } from "@/types/venue"

const STALE_TIME_LIST = 1000 * 60 * 5
const STALE_TIME_DETAIL = 1000 * 60 * 10

const fetchVenues = async (filters: VenueFilters): Promise<VenueListResponse> => {
  const params = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value))
    }
  })

  const res = await fetch(`/api/venues?${params}`)
  const json = await res.json()

  if (!res.ok) throw new Error(json.error ?? "Ошибка загрузки залов")
  return json.data
}

const fetchVenue = async (slug: string): Promise<VenueDetail> => {
  const res = await fetch(`/api/venues/${slug}`)
  const json = await res.json()

  if (!res.ok) throw new Error(json.error ?? "Зал не найден")
  return json.data
}

export const useVenues = (filters: VenueFilters) => {
  return useQuery({
    queryKey: venueKeys.list(filters),
    queryFn: () => fetchVenues(filters),
    staleTime: STALE_TIME_LIST,
    placeholderData: keepPreviousData,
  })
}

export const useVenue = (slug: string) => {
  return useQuery({
    queryKey: venueKeys.detail(slug),
    queryFn: () => fetchVenue(slug),
    staleTime: STALE_TIME_DETAIL,
    enabled: !!slug,
  })
}
