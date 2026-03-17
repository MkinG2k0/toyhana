import { Checkbox } from "@/shared/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import type { UseFormWatch, UseFormSetValue } from "react-hook-form"
import type { VenueFormValues } from "../model/types"

interface FeatureField {
  name: keyof Pick<
    VenueFormValues,
    | "hasHalalKitchen"
    | "allowOwnCook"
    | "hasPrayerRoom"
    | "hasSeparateHalls"
    | "allowOwnFruits"
    | "hasStage"
    | "hasProjector"
    | "hasParking"
    | "hasSoundSystem"
    | "hasWelcomeZone"
    | "hasOutdoorArea"
  >
  label: string
}

const FEATURE_FIELDS: FeatureField[] = [
  { name: "hasHalalKitchen", label: "Халяль кухня" },
  { name: "allowOwnCook", label: "Свой повар" },
  { name: "hasPrayerRoom", label: "Молельная комната" },
  { name: "hasSeparateHalls", label: "Раздельные залы" },
  { name: "allowOwnFruits", label: "Свой фрукт" },
  { name: "hasStage", label: "Сцена" },
  { name: "hasProjector", label: "Проектор" },
  { name: "hasParking", label: "Парковка" },
  { name: "hasSoundSystem", label: "Звуковая система" },
  { name: "hasWelcomeZone", label: "Зона приёма" },
  { name: "hasOutdoorArea", label: "Открытая площадка" },
]

interface VenueFeaturesSectionProps {
  watch: UseFormWatch<VenueFormValues>
  setValue: UseFormSetValue<VenueFormValues>
}

export const VenueFeaturesSection = ({
  watch,
  setValue,
}: VenueFeaturesSectionProps) => (
  <Card className="border-surface-200">
    <CardHeader>
      <CardTitle>Удобства</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid gap-3 sm:grid-cols-2">
        {FEATURE_FIELDS.map(({ name, label }) => (
          <label key={name} className="flex cursor-pointer items-center gap-2">
            <Checkbox
              checked={watch(name)}
              onCheckedChange={(checked) => setValue(name, !!checked)}
            />
            <span className="text-sm">{label}</span>
          </label>
        ))}
      </div>
    </CardContent>
  </Card>
)
