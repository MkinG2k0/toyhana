import { Label } from "@/shared/ui/label"
import { Slider } from "@/shared/ui/slider"

interface VenueRangeSliderProps {
  label: string
  min: number
  max: number
  step: number
  value: [number, number]
  minLabel: string
  maxLabel: string
  onValueChange: (val: number[]) => void
}

export const VenueRangeSlider = ({
  label,
  min,
  max,
  step,
  value,
  minLabel,
  maxLabel,
  onValueChange,
}: VenueRangeSliderProps) => {
  const handleChange = (val: number | readonly number[]) => {
    onValueChange(Array.isArray(val) ? [...val] : [val as number])
  }

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      <Slider
        min={min}
        max={max}
        step={step}
        value={value}
        onValueChange={handleChange}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  )
}
