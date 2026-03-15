"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createVenueSchema, type CreateVenueInput } from "@/validators/venue"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

const DEFAULT_VALUES: Partial<CreateVenueInput> = {
  city: "Махачкала",
  hasHalalKitchen: true,
  allowOwnCook: false,
  hasPrayerRoom: false,
  hasSeparateHalls: false,
  allowOwnFruits: true,
  hasStage: false,
  hasProjector: false,
  hasParking: false,
  hasSoundSystem: false,
  hasWelcomeZone: false,
  hasOutdoorArea: false,
  cuisineTypes: [],
}

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

export default function NewVenuePage() {
  const router = useRouter()

  const form = useForm<CreateVenueInput>({
    // @ts-expect-error zod v4 schema compatibility with resolver
    resolver: zodResolver(createVenueSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      city: "Махачкала",
      district: "",
      capacityMin: 50,
      capacityMax: 300,
      pricePerPerson: 1000,
      ...DEFAULT_VALUES,
    },
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      const res = await fetch("/api/venues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) {
        toast.error(json.error ?? "Ошибка сохранения")
        return
      }
      toast.success("Зал успешно добавлен")
      router.push("/dashboard/venues")
    } catch {
      toast.error("Ошибка сохранения")
    }
  })

  return (
    <div className="mx-auto max-w-2xl">
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
            Добавить зал
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
                  <Input
                    id="city"
                    {...form.register("city")}
                    className="mt-1.5"
                  />
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
                    {...form.register("capacityMin", {
                      valueAsNumber: true,
                    })}
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
                    {...form.register("capacityMax", {
                      valueAsNumber: true,
                    })}
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
                  {...form.register("pricePerPerson", {
                    valueAsNumber: true,
                  })}
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
              {form.formState.isSubmitting ? "Сохранение..." : "Добавить зал"}
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
