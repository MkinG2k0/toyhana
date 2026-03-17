"use client"

import { useCallback } from "react"
import { Button } from "@/shared/ui/button"
import { Checkbox } from "@/shared/ui/checkbox"
import { Label } from "@/shared/ui/label"
import { Separator } from "@/shared/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import { formatPrice } from "@/shared/lib/utils"
import type { VenueFilters } from "@/entities/venue"
import { VenueRangeSlider } from "./VenueRangeSlider"
import {
  DISTRICTS,
  FEATURE_FILTERS,
  ALL_DISTRICTS_VALUE,
  CAPACITY_MIN,
  CAPACITY_MAX,
  PRICE_MIN,
  PRICE_MAX,
} from "../model/config"

interface VenueFiltersContentProps {
  filters: VenueFilters
  onFiltersChange: (filters: VenueFilters) => void
}

export const VenueFiltersContent = ({
  filters,
  onFiltersChange,
}: VenueFiltersContentProps) => {
  const updateFilter = useCallback(
    (key: keyof VenueFilters, value: unknown) => {
      onFiltersChange({ ...filters, [key]: value, page: 1 })
    },
    [filters, onFiltersChange],
  )

  const handleCapacityChange = useCallback(
    (val: number[]) => {
      onFiltersChange({
        ...filters,
        capacityMin: val[0] === CAPACITY_MIN ? undefined : val[0],
        capacityMax: val[1] === CAPACITY_MAX ? undefined : val[1],
        page: 1,
      })
    },
    [filters, onFiltersChange],
  )

  const handlePriceChange = useCallback(
    (val: number[]) => {
      onFiltersChange({
        ...filters,
        priceMin: val[0] === PRICE_MIN ? undefined : val[0],
        priceMax: val[1] === PRICE_MAX ? undefined : val[1],
        page: 1,
      })
    },
    [filters, onFiltersChange],
  )

  const handleReset = useCallback(() => {
    onFiltersChange({ page: 1 })
  }, [onFiltersChange])

  const handleDistrictChange = useCallback(
    (v: string | null) => {
      updateFilter(
        "district",
        !v || v === ALL_DISTRICTS_VALUE ? undefined : v,
      )
    },
    [updateFilter],
  )

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Район</Label>
        <Select
          value={filters.district ?? ALL_DISTRICTS_VALUE}
          onValueChange={handleDistrictChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Все районы" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_DISTRICTS_VALUE}>Все районы</SelectItem>
            {DISTRICTS.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <VenueRangeSlider
        label="Вместимость"
        min={CAPACITY_MIN}
        max={CAPACITY_MAX}
        step={50}
        value={[
          filters.capacityMin ?? CAPACITY_MIN,
          filters.capacityMax ?? CAPACITY_MAX,
        ]}
        minLabel={`${filters.capacityMin ?? CAPACITY_MIN} чел.`}
        maxLabel={`${filters.capacityMax ?? CAPACITY_MAX} чел.`}
        onValueChange={handleCapacityChange}
      />

      <Separator />

      <VenueRangeSlider
        label="Цена за персону"
        min={PRICE_MIN}
        max={PRICE_MAX}
        step={100}
        value={[
          filters.priceMin ?? PRICE_MIN,
          filters.priceMax ?? PRICE_MAX,
        ]}
        minLabel={formatPrice(filters.priceMin ?? PRICE_MIN)}
        maxLabel={formatPrice(filters.priceMax ?? PRICE_MAX)}
        onValueChange={handlePriceChange}
      />

      <Separator />

      <div className="space-y-3">
        <Label>Особенности</Label>
        {FEATURE_FILTERS.map(({ key, label }) => (
          <div key={key} className="flex items-center gap-2">
            <Checkbox
              id={key}
              checked={!!filters[key]}
              onCheckedChange={(checked) =>
                updateFilter(key, checked ? true : undefined)
              }
            />
            <Label htmlFor={key} className="cursor-pointer text-sm font-normal">
              {label}
            </Label>
          </div>
        ))}
      </div>

      <Button variant="outline" className="w-full" onClick={handleReset}>
        Сбросить фильтры
      </Button>
    </div>
  )
}
