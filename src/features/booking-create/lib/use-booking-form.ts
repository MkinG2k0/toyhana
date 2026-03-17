"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm, type UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { createBookingSchema, type CreateBookingFormValues } from "../model/schema"
import { useBookingMutation } from "../model/use-booking-mutation"

interface UseBookingFormReturn {
  form: UseFormReturn<CreateBookingFormValues>
  handleSubmit: (e?: React.BaseSyntheticEvent) => void
  isPending: boolean
}

export const useBookingForm = (
  venueId: string,
  venueName: string,
  capacityMin: number,
  capacityMax: number,
  onSuccess?: () => void,
): UseBookingFormReturn => {
  const router = useRouter()
  const { mutate, isPending } = useBookingMutation()

  const form = useForm<CreateBookingFormValues>({
    resolver: zodResolver(createBookingSchema(capacityMin, capacityMax)),
    defaultValues: {
      venueId,
      eventType: "WEDDING",
      eventDate: "",
      guestCount: capacityMin,
      contactName: "",
      contactPhone: "",
      message: "",
    },
  })

  useEffect(() => {
    const savedName = localStorage.getItem("booking_contactName")
    const savedPhone = localStorage.getItem("booking_contactPhone")
    if (!savedName && !savedPhone) return
    const current = form.getValues()
    form.reset({
      ...current,
      contactName: savedName ?? current.contactName,
      contactPhone: savedPhone ?? current.contactPhone,
    })
  }, [form])

  const contactName = form.watch("contactName")
  const contactPhone = form.watch("contactPhone")

  useEffect(() => {
    if (contactName) localStorage.setItem("booking_contactName", contactName)
    if (contactPhone) localStorage.setItem("booking_contactPhone", contactPhone)
  }, [contactName, contactPhone])

  const handleSubmit = form.handleSubmit((values) => {
    mutate(values, {
      onSuccess: () => {
        toast.success("Заявка отправлена!", {
          description: `Владелец зала «${venueName}» получит уведомление и свяжется с вами.`,
        })
        form.reset()
        onSuccess?.()
        router.push("/")
      },
      onError: (error) => {
        toast.error("Ошибка", { description: error.message })
      },
    })
  })

  return { form, handleSubmit, isPending }
}
