import { Label } from "@/shared/ui/label"
import { Input } from "@/shared/ui/input"
import { Textarea } from "@/shared/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import type { UseFormRegister, FieldErrors } from "react-hook-form"
import type { VenueFormValues } from "../model/types"

interface VenueBasicInfoSectionProps {
  register: UseFormRegister<VenueFormValues>
  errors: FieldErrors<VenueFormValues>
}

export const VenueBasicInfoSection = ({
  register,
  errors,
}: VenueBasicInfoSectionProps) => (
  <Card className="border-surface-200">
    <CardHeader>
      <CardTitle>Основная информация</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <Label htmlFor="name">Название *</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="Золотая Империя"
          className="mt-1.5"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="description">Описание *</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Опишите ваш зал..."
          rows={4}
          className="mt-1.5"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="address">Адрес *</Label>
        <Input
          id="address"
          {...register("address")}
          placeholder="ул. Примерная, 1"
          className="mt-1.5"
        />
        {errors.address && (
          <p className="mt-1 text-sm text-destructive">
            {errors.address.message}
          </p>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="city">Город</Label>
          <Input id="city" {...register("city")} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="district">Район</Label>
          <Input
            id="district"
            {...register("district")}
            placeholder="Советский"
            className="mt-1.5"
          />
        </div>
      </div>
    </CardContent>
  </Card>
)
