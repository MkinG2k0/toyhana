import { z } from "zod/v4"

export const phoneSchema = z
  .string()
  .regex(/^\+7\d{10}$/, "Формат: +7XXXXXXXXXX")

export const loginSchema = z.object({
  phone: phoneSchema,
})

export type LoginInput = z.infer<typeof loginSchema>

export const otpSchema = z.object({
  phone: phoneSchema,
  code: z
    .string()
    .length(4, "Код должен содержать 4 цифры")
    .regex(/^\d{4}$/, "Только цифры"),
})

export type OtpInput = z.infer<typeof otpSchema>

export const registerSchema = z.object({
  phone: phoneSchema,
  name: z
    .string()
    .min(2, "Минимум 2 символа")
    .max(100, "Максимум 100 символов"),
  role: z.enum(["CLIENT", "OWNER"]).default("CLIENT"),
  code: z
    .string()
    .length(4, "Код должен содержать 4 цифры")
    .regex(/^\d{4}$/, "Только цифры"),
})

export type RegisterInput = z.infer<typeof registerSchema>
