import { z } from "zod/v4"

export const profileSchema = z.object({
  name: z.string().min(2, "Минимум 2 символа").max(100),
  telegramChatId: z.string().optional(),
  whatsappPhone: z.string().optional(),
})

export type ProfileFormValues = z.infer<typeof profileSchema>
