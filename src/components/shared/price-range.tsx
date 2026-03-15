"use client"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { formatPrice, cn } from "@/lib/utils"

interface PriceRangeProps {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  step?: number
  className?: string
}

export const PriceRange = ({
  min,
  max,
  value,
  onChange,
  step = 100,
  className,
}: PriceRangeProps) => {
  return (
    <div className={cn("space-y-3", className)}>
      <Label>Цена за персону</Label>
      <Slider
        min={min}
        max={max}
        step={step}
        value={value}
        onValueChange={(v) => {
          const arr = Array.isArray(v) ? v : [v]
          onChange([arr[0], arr[1] ?? arr[0]] as [number, number])
        }}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatPrice(value[0])}</span>
        <span>{formatPrice(value[1])}</span>
      </div>
    </div>
  )
}
