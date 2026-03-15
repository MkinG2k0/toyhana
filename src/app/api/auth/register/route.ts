import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { registerSchema } from "@/validators/auth"
import { created, error, serverError } from "@/lib/api-response"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return error(parsed.error.issues[0].message)
    }

    const { phone, name, role, code } = parsed.data

    const existing = await prisma.user.findUnique({ where: { phone } })
    if (existing) {
      return error("Пользователь с таким номером уже зарегистрирован")
    }

    const storedOtp = await prisma.otpCode.findFirst({
      where: { phone },
      orderBy: { createdAt: 'desc' },
      select: { code: true, expiresAt: true },
    })

    if (
      !storedOtp ||
      storedOtp.code !== code ||
      storedOtp.expiresAt < new Date()
    ) {
      return error("Неверный или просроченный код")
    }

    await prisma.otpCode.deleteMany({ where: { phone } })

    const user = await prisma.user.create({
      data: { phone, name, role },
      select: { id: true, phone: true, name: true, role: true },
    })

    return created(user)
  } catch (err) {
    return serverError(err)
  }
}
