import { Label } from "@/shared/ui/label"
import { Input } from "@/shared/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import type { UseFormRegister, FieldErrors } from "react-hook-form"
import type { VenueFormValues } from "../model/types"

interface VenueCapacitySectionProps {
  register: UseFormRegister<VenueFormValues>
  errors: FieldErrors<VenueFormValues>
}

export const VenueCapacitySection = ({
  register,
  errors,
}: VenueCapacitySectionProps) => (
  <Card className="border-surface-200">
    <CardHeader>
      <CardTitle>Вместимость и цены</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="capacityMin">Мин. гостей *</Label>
          <Input
            id="capacityMin"
            type="number"
            {...register("capacityMin", { valueAsNumber: true })}
            className="mt-1.5"
          />
          {errors.capacityMin && (
            <p className="mt-1 text-sm text-destructive">
              {errors.capacityMin.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="capacityMax">Макс. гостей *</Label>
          <Input
            id="capacityMax"
            type="number"
            {...register("capacityMax", { valueAsNumber: true })}
            className="mt-1.5"
          />
          {errors.capacityMax && (
            <p className="mt-1 text-sm text-destructive">
              {errors.capacityMax.message}
            </p>
          )}
        </div>
      </div>
      <div>
        <Label htmlFor="pricePerPerson">Цена за человека (₽) *</Label>
        <Input
          id="pricePerPerson"
          type="number"
          {...register("pricePerPerson", { valueAsNumber: true })}
          placeholder="1200"
          className="mt-1.5"
        />
        {errors.pricePerPerson && (
          <p className="mt-1 text-sm text-destructive">
            {errors.pricePerPerson.message}
          </p>
        )}
      </div>
    </CardContent>
  </Card>
)
