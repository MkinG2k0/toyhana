"use client"

import { useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SlidersHorizontal } from "lucide-react"
import { useIsMobile } from "@/hooks/use-media-query"
import { formatPrice } from "@/lib/utils"

import type { VenueFilters as VenueFiltersType } from "@/types/venue"

interface VenueFiltersProps {
  filters: VenueFiltersType
  onFiltersChange: (filters: VenueFiltersType) => void
}

const DISTRICTS = [
  "Советский",
  "Кировский",
  "Ленинский",
  "Ленинкент",
  "Редукторный",
]

const ALL_DISTRICTS_VALUE = "Все районы"

const CAPACITY_MIN = 50
const CAPACITY_MAX = 1000
const PRICE_MIN = 500
const PRICE_MAX = 5000

const FiltersContent = ({ filters, onFiltersChange }: VenueFiltersProps) => {
  const updateFilter = useCallback(
    (key: keyof VenueFiltersType, value: unknown) => {
      onFiltersChange({ ...filters, [key]: value, page: 1 })
    },
    [filters, onFiltersChange]
  )

  const handleReset = useCallback(() => {
    onFiltersChange({ page: 1 })
  }, [onFiltersChange])

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Район</Label>
        <Select
          value={filters.district ?? ALL_DISTRICTS_VALUE}
          onValueChange={(v: string | null) =>
            updateFilter("district", !v || v === ALL_DISTRICTS_VALUE ? undefined : v)
          }
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

      <div className="space-y-3">
        <Label>Вместимость</Label>
        <Slider
          min={CAPACITY_MIN}
          max={CAPACITY_MAX}
          step={50}
          value={[
            filters.capacityMin ?? CAPACITY_MIN,
            filters.capacityMax ?? CAPACITY_MAX,
          ]}
          onValueChange={(val) => {
            const arr = Array.isArray(val) ? val : [val]
            onFiltersChange({
              ...filters,
              capacityMin: arr[0] === CAPACITY_MIN ? undefined : arr[0],
              capacityMax: arr[1] === CAPACITY_MAX ? undefined : arr[1],
              page: 1,
            })
          }}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{filters.capacityMin ?? CAPACITY_MIN} чел.</span>
          <span>{filters.capacityMax ?? CAPACITY_MAX} чел.</span>
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <Label>Цена за персону</Label>
        <Slider
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={100}
          value={[
            filters.priceMin ?? PRICE_MIN,
            filters.priceMax ?? PRICE_MAX,
          ]}
          onValueChange={(val) => {
            const arr = Array.isArray(val) ? val : [val]
            onFiltersChange({
              ...filters,
              priceMin: arr[0] === PRICE_MIN ? undefined : arr[0],
              priceMax: arr[1] === PRICE_MAX ? undefined : arr[1],
              page: 1,
            })
          }}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatPrice(filters.priceMin ?? PRICE_MIN)}</span>
          <span>{formatPrice(filters.priceMax ?? PRICE_MAX)}</span>
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <Label>Особенности</Label>
        {[
          { key: "hasHalalKitchen" as const, label: "Халяль кухня" },
          { key: "allowOwnCook" as const, label: "Можно своего повара" },
          { key: "hasPrayerRoom" as const, label: "Молельная комната" },
          { key: "hasSeparateHalls" as const, label: "Раздельные залы" },
        ].map(({ key, label }) => (
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

export const VenueFilters = (props: VenueFiltersProps) => {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger render={<Button variant="outline" size="sm" />}>
          <SlidersHorizontal className="mr-2 size-4" />
          Фильтры
        </SheetTrigger>
        <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Фильтры</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <FiltersContent {...props} />
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <aside className="sticky top-20 w-64 shrink-0 space-y-1">
      <h3 className="mb-4 text-sm font-semibold">Фильтры</h3>
      <FiltersContent {...props} />
    </aside>
  )
}
