import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { success, error, serverError } from "@/lib/api-response"
import { requireAuth } from "@/lib/auth-guard"
import { z } from "zod/v4"

const updateProfileSchema = z.object({
  name: z.string().min(2, "Минимум 2 символа").max(100).optional(),
  telegramChatId: z.string().max(50).nullable().optional(),
  whatsappPhone: z.string().max(20).nullable().optional(),
  role: z.enum(["CLIENT", "OWNER"]).optional(),
})

export async function PATCH(req: NextRequest) {
  try {
    const result = await requireAuth(["OWNER", "ADMIN", "CLIENT"])
    if (result.error) return result.error

    const body = await req.json()
    const parsed = updateProfileSchema.safeParse(body)
    if (!parsed.success) {
      return error(parsed.error.issues[0].message)
    }

    const data = { ...parsed.data }
    if (data.role !== undefined) {
      if (result.user.role !== "CLIENT" || data.role !== "OWNER") {
        return error("Сменить роль можно только с «Найти зал» на «Разместить зал» один раз")
      }
    }

    const updated = await prisma.user.update({
      where: { id: result.user.id },
      data,
    })

    return success({
      id: updated.id,
      name: updated.name,
      role: updated.role,
      telegramChatId: updated.telegramChatId,
      whatsappPhone: updated.whatsappPhone,
    })
  } catch (err) {
    return serverError(err)
  }
}
