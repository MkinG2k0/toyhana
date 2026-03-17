"use client"

import { Controller } from "react-hook-form"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Textarea } from "@/shared/ui/textarea"
import { PhoneInput } from "@/shared/ui/PhoneInput"
import { cn } from "@/shared/lib/utils"
import { useBookingForm } from "../lib/use-booking-form"
import { BookingDateField } from "./BookingDateField"

interface BookingFormProps {
  venueId: string
  venueName: string
  capacityMin: number
  capacityMax: number
  onSuccess?: () => void
  className?: string
}

export const BookingForm = ({
  venueId,
  venueName,
  capacityMin,
  capacityMax,
  onSuccess,
  className,
}: BookingFormProps) => {
  const { form, handleSubmit, isPending } = useBookingForm(
    venueId,
    venueName,
    capacityMin,
    capacityMax,
    onSuccess,
  )
  const {
    register,
    control,
    formState: { errors },
  } = form

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <BookingDateField control={control} error={errors.eventDate?.message} />

      <div className="space-y-2">
        <Label htmlFor="guestCount">Количество гостей</Label>
        <p className="text-xs text-muted-foreground">
          Зал вмещает от {capacityMin} до {capacityMax} гостей
        </p>
        <Input
          id="guestCount"
          type="number"
          placeholder={String(capacityMin)}
          {...register("guestCount", { valueAsNumber: true })}
          className={cn(errors.guestCount && "border-destructive")}
        />
        {errors.guestCount && (
          <p className="text-sm text-destructive">{errors.guestCount.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactName">Ваше имя</Label>
        <Input
          id="contactName"
          placeholder="Магомед"
          {...register("contactName")}
          className={cn(errors.contactName && "border-destructive")}
        />
        {errors.contactName && (
          <p className="text-sm text-destructive">{errors.contactName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactPhone">Телефон</Label>
        <Controller
          control={control}
          name="contactPhone"
          render={({ field }) => (
            <PhoneInput
              id="contactPhone"
              value={field.value ? field.value.replace(/^\+7/, "") : ""}
              onChange={(v) => field.onChange(v ? `+7${v}` : "")}
              disabled={isPending}
            />
          )}
        />
        {errors.contactPhone && (
          <p className="text-sm text-destructive">{errors.contactPhone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Пожелания (необязательно)</Label>
        <Textarea
          id="message"
          placeholder="Нужна сцена, хотим обсудить меню..."
          rows={3}
          {...register("message")}
        />
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full bg-brand-500 hover:bg-brand-600"
        disabled={isPending}
      >
        {isPending ? "Отправляем..." : "Отправить заявку"}
      </Button>
    </form>
  )
}
