import { NextRequest } from "next/server"
import { prisma } from "@/shared/lib/prisma"
import { sendOtp, generateOtpCode } from "@/shared/lib/sms"
import { loginSchema } from "@/features/auth-sms/model/schema"
import { success, error, serverError } from "@/shared/api"

const OTP_EXPIRY_MINUTES = 5
const OTP_COOLDOWN_SECONDS = 60

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = loginSchema.safeParse(body)

    if (!parsed.success) {
      return error(parsed.error.issues[0].message)
    }

    const { phone } = parsed.data

    const recent = await prisma.otpCode.findFirst({
      where: { phone },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    })

    if (recent) {
      const elapsed =
        (Date.now() - recent.createdAt.getTime()) / 1000
      if (elapsed < OTP_COOLDOWN_SECONDS) {
        return error(
          `Подождите ${Math.ceil(OTP_COOLDOWN_SECONDS - elapsed)} секунд перед повторной отправкой`,
          429
        )
      }
    }

    const code = generateOtpCode()
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000)

    await prisma.otpCode.deleteMany({ where: { phone } })
    await prisma.otpCode.create({
      data: { phone, code, expiresAt },
    })

    const result = await sendOtp(phone, code)

    if (!result.success) {
      return error("Не удалось отправить SMS. Попробуйте позже.", 500)
    }

    return success({ sent: true, expiresIn: OTP_EXPIRY_MINUTES * 60 })
  } catch (err) {
    return serverError(err)
  }
}
