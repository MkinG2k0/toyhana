import { z } from "zod/v4"

const BASE_MIN_GUESTS = 10
const BASE_MAX_GUESTS = 2000

const baseBookingSchema = z.object({
  venueId: z.string().min(1, "Не указан зал"),
  eventDate: z.string().refine((d) => new Date(d) > new Date(), {
    message: "Дата мероприятия должна быть в будущем",
  }),
  eventType: z.enum([
    "WEDDING",
    "ENGAGEMENT",
    "BIRTHDAY",
    "CORPORATE",
    "FUNERAL",
    "OTHER",
  ]),
  guestCount: z
    .number()
    .int()
    .min(BASE_MIN_GUESTS, `Минимум ${BASE_MIN_GUESTS} гостей`)
    .max(BASE_MAX_GUESTS, `Максимум ${BASE_MAX_GUESTS} гостей`),
  contactName: z.string().min(2, "Введите имя").max(100),
  contactPhone: z.string().regex(/^\+7\d{10}$/, "Формат: +7XXXXXXXXXX"),
  message: z.string().max(1000).optional(),
})

export const createBookingSchema = (
  minGuests: number = BASE_MIN_GUESTS,
  maxGuests: number = BASE_MAX_GUESTS,
) =>
  baseBookingSchema.extend({
    guestCount: baseBookingSchema.shape.guestCount
      .min(minGuests, `Минимум ${minGuests} гостей`)
      .max(maxGuests, `Максимум ${maxGuests} гостей`),
  })

export type CreateBookingFormValues = z.infer<typeof baseBookingSchema>
