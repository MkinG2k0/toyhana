import { NextRequest } from "next/server"
import { prisma } from "@/shared/lib/prisma"
import { z } from "zod/v4"
import { success, error, notFound, serverError } from "@/shared/api"
import { requireAuth } from "@/shared/lib/auth-guard"

const patchSchema = z.object({
  action: z.enum(["approve", "reject"]),
  adminComment: z.string().min(5, "Укажите причину").max(1000).optional(),
})

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function PATCH(req: NextRequest, ctx: RouteContext) {
  try {
    const { id } = await ctx.params
    const result = await requireAuth(["ADMIN"])
    if (result.error) return result.error

    const body = await req.json()
    const parsed = patchSchema.safeParse(body)
    if (!parsed.success) {
      return error(parsed.error.issues[0].message)
    }

    const { action, adminComment } = parsed.data

    if (action === "reject" && !adminComment) {
      return error("Укажите причину отклонения")
    }

    const existing = await prisma.venuePlacementRequest.findUnique({
      where: { id },
    })

    if (!existing) return notFound("Заявка")

    if (existing.status !== "PENDING") {
      return error("Заявка уже обработана")
    }

    const updated = await prisma.venuePlacementRequest.update({
      where: { id },
      data: {
        status: action === "approve" ? "APPROVED" : "REJECTED",
        adminComment: action === "reject" ? adminComment : null,
      },
    })

    return success(updated)
  } catch (err) {
    return serverError(err)
  }
}
