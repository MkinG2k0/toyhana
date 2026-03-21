import { NextRequest } from "next/server"
import { prisma } from "@/shared/lib/prisma"
import { z } from "zod/v4"
import { success, created, error, serverError } from "@/shared/api"
import { requireAuth } from "@/shared/lib/auth-guard"

const submitSchema = z.object({
  description: z.string().min(20, "Описание слишком короткое").max(2000),
})

export async function POST(req: NextRequest) {
  try {
    const result = await requireAuth()
    if (result.error) return result.error

    const body = await req.json()
    const parsed = submitSchema.safeParse(body)
    if (!parsed.success) {
      return error(parsed.error.issues[0].message)
    }

    const existing = await prisma.venuePlacementRequest.findFirst({
      where: {
        userId: result.user.id,
        status: { in: ["PENDING", "APPROVED"] },
      },
    })

    if (existing) {
      return error(
        existing.status === "APPROVED"
          ? "Ваша заявка уже одобрена"
          : "У вас уже есть заявка на рассмотрении"
      )
    }

    // Временно: заявка на аккаунт владельца сразу одобрена, без админки.
    const request = await prisma.venuePlacementRequest.create({
      data: {
        description: parsed.data.description,
        userId: result.user.id,
        status: "APPROVED",
      },
    })

    return created(request)
  } catch (err) {
    return serverError(err)
  }
}

export async function GET() {
  try {
    const result = await requireAuth(["ADMIN"])
    if (result.error) return result.error

    const requests = await prisma.venuePlacementRequest.findMany({
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      take: 200,
      select: {
        id: true,
        description: true,
        status: true,
        adminComment: true,
        createdAt: true,
        user: {
          select: { id: true, name: true, phone: true },
        },
      },
    })

    return success(requests)
  } catch (err) {
    return serverError(err)
  }
}
