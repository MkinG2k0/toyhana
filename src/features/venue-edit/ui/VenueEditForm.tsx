"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/shared/ui/button"
import type { UploadedImage } from "@/shared/ui/ImageUpload"
import { useVenueEditForm } from "../lib/use-venue-edit-form"
import { VenueBasicInfoSection } from "./VenueBasicInfoSection"
import { VenueCapacitySection } from "./VenueCapacitySection"
import { VenueFeaturesSection } from "./VenueFeaturesSection"
import { VenuePhotosSection } from "./VenuePhotosSection"
import type { VenueEditData } from "../model/types"

interface VenueEditFormProps {
  venue: VenueEditData
}

export const VenueEditForm = ({ venue }: VenueEditFormProps) => {
  const { form, handleSubmit, photosValue } = useVenueEditForm(venue)

  const handlePhotosChange = (images: UploadedImage[]): void => {
    form.setValue("photos", images, { shouldDirty: true })
  }

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
        <VenueBasicInfoSection
          register={form.register}
          errors={form.formState.errors}
        />
        <VenueCapacitySection
          register={form.register}
          errors={form.formState.errors}
        />
        <VenueFeaturesSection watch={form.watch} setValue={form.setValue} />
        <VenuePhotosSection value={photosValue} onChange={handlePhotosChange} />

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
