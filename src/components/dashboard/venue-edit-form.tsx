"use client"

import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { createVenueSchema } from "@/validators/venue"
import type { z } from "zod/v4"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

const FEATURE_FIELDS = [
  { name: "hasHalalKitchen" as const, label: "Халяль кухня" },
  { name: "allowOwnCook" as const, label: "Свой повар" },
  { name: "hasPrayerRoom" as const, label: "Молельная комната" },
  { name: "hasSeparateHalls" as const, label: "Раздельные залы" },
  { name: "allowOwnFruits" as const, label: "Свой фрукт" },
  { name: "hasStage" as const, label: "Сцена" },
  { name: "hasProjector" as const, label: "Проектор" },
  { name: "hasParking" as const, label: "Парковка" },
  { name: "hasSoundSystem" as const, label: "Звуковая система" },
  { name: "hasWelcomeZone" as const, label: "Зона приёма" },
  { name: "hasOutdoorArea" as const, label: "Открытая площадка" },
]

interface VenueEditFormProps {
  venue: {
    id: string
    name: string
    description: string
    address: string
    city: string
    district: string | null
    capacityMin: number
    capacityMax: number
    pricePerPerson: number
    rentalPrice: number | null
    hasHalalKitchen: boolean
    allowOwnCook: boolean
    hasPrayerRoom: boolean
    hasSeparateHalls: boolean
    allowOwnFruits: boolean
    hasStage: boolean
    hasProjector: boolean
    hasParking: boolean
    hasSoundSystem: boolean
    hasWelcomeZone: boolean
    hasOutdoorArea: boolean
    cuisineTypes: string[]
  }
}

export const VenueEditForm = ({ venue }: VenueEditFormProps) => {
  const router = useRouter()

  type VenueFormValues = z.output<typeof createVenueSchema>
  const form = useForm<VenueFormValues>({
    resolver: zodResolver(createVenueSchema) as Resolver<VenueFormValues>,
    defaultValues: {
      name: venue.name,
      description: venue.description,
      address: venue.address,
      city: venue.city,
      district: venue.district ?? "",
      capacityMin: venue.capacityMin,
      capacityMax: venue.capacityMax,
      pricePerPerson: venue.pricePerPerson,
      rentalPrice: venue.rentalPrice ?? undefined,
      hasHalalKitchen: venue.hasHalalKitchen,
      allowOwnCook: venue.allowOwnCook,
      hasPrayerRoom: venue.hasPrayerRoom,
      hasSeparateHalls: venue.hasSeparateHalls,
      allowOwnFruits: venue.allowOwnFruits,
      hasStage: venue.hasStage,
      hasProjector: venue.hasProjector,
      hasParking: venue.hasParking,
      hasSoundSystem: venue.hasSoundSystem,
      hasWelcomeZone: venue.hasWelcomeZone,
      hasOutdoorArea: venue.hasOutdoorArea,
      cuisineTypes: venue.cuisineTypes,
    },
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      const res = await fetch(`/api/venues/${venue.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) {
        toast.error(json.error ?? "Ошибка сохранения")
        return
      }
      toast.success("Зал обновлён")
      router.push("/dashboard/venues")
    } catch {
      toast.error("Ошибка сохранения")
    }
  })

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 -ml-2"
          render={<Link href="/dashboard/venues" />}
        >
          <ArrowLeft className="size-4" />
          Назад к залам
        </Button>
        <h1 className="font-display text-2xl font-bold md:text-3xl">
          Редактировать зал
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-surface-200">
          <CardHeader>
            <CardTitle>Основная информация</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Название *</Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder="Золотая Империя"
                className="mt-1.5"
              />
              {form.formState.errors.name && (
                <p className="mt-1 text-sm text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="description">Описание *</Label>
              <Textarea
                id="description"
                {...form.register("description")}
                placeholder="Опишите ваш зал..."
                rows={4}
                className="mt-1.5"
              />
              {form.formState.errors.description && (
                <p className="mt-1 text-sm text-destructive">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="address">Адрес *</Label>
              <Input
                id="address"
                {...form.register("address")}
                placeholder="ул. Примерная, 1"
                className="mt-1.5"
              />
              {form.formState.errors.address && (
                <p className="mt-1 text-sm text-destructive">
                  {form.formState.errors.address.message}
                </p>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="city">Город</Label>
                <Input id="city" {...form.register("city")} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="district">Район</Label>
                <Input
                  id="district"
                  {...form.register("district")}
                  placeholder="Советский"
                  className="mt-1.5"
                />
              </div>
            </div>
          </CardContent>
        </Card>

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
                  {...form.register("capacityMin", { valueAsNumber: true })}
                  className="mt-1.5"
                />
                {form.formState.errors.capacityMin && (
                  <p className="mt-1 text-sm text-destructive">
                    {form.formState.errors.capacityMin.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="capacityMax">Макс. гостей *</Label>
                <Input
                  id="capacityMax"
                  type="number"
                  {...form.register("capacityMax", { valueAsNumber: true })}
                  className="mt-1.5"
                />
                {form.formState.errors.capacityMax && (
                  <p className="mt-1 text-sm text-destructive">
                    {form.formState.errors.capacityMax.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="pricePerPerson">Цена за человека (₽) *</Label>
              <Input
                id="pricePerPerson"
                type="number"
                {...form.register("pricePerPerson", { valueAsNumber: true })}
                placeholder="1200"
                className="mt-1.5"
              />
              {form.formState.errors.pricePerPerson && (
                <p className="mt-1 text-sm text-destructive">
                  {form.formState.errors.pricePerPerson.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-surface-200">
          <CardHeader>
            <CardTitle>Удобства</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {FEATURE_FIELDS.map(({ name, label }) => (
                <label
                  key={name}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <Checkbox
                    checked={form.watch(name)}
                    onCheckedChange={(checked) =>
                      form.setValue(name, !!checked)
                    }
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button
            type="submit"
            className="flex-1 bg-brand-500 hover:bg-brand-600"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Сохранение..." : "Сохранить"}
          </Button>
          <Button
            type="button"
            variant="outline"
            render={<Link href="/dashboard/venues" />}
          >
            Отмена
          </Button>
        </div>
      </form>
    </div>
  )
}
