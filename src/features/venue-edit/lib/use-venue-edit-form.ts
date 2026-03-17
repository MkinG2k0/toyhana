"use client"

import { useForm, type UseFormReturn, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createVenueSchema } from "../model/schema"
import type { VenueFormValues, VenueEditData } from "../model/types"
import type { UploadedImage } from "@/shared/ui/ImageUpload"

interface UseVenueEditFormReturn {
  form: UseFormReturn<VenueFormValues>
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>
  photosValue: UploadedImage[]
}

export const useVenueEditForm = (venue: VenueEditData): UseVenueEditFormReturn => {
  const router = useRouter()

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
      photos: venue.photos.map((p) => ({ url: p.url, key: p.key })),
    },
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      const res = await fetch(`/api/venues/${venue.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = (await res.json()) as { error?: string }
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

  const photosValue =
    (form.watch("photos") as UploadedImage[] | undefined) ?? []

  return { form, handleSubmit, photosValue }
}
