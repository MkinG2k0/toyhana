import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendOtp, generateOtpCode } from "@/lib/sms"
import { loginSchema } from "@/validators/auth"
import { success, error, serverError } from "@/lib/api-response"

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

    const recent = await prisma.$queryRaw<{ created_at: Date }[]>`
      SELECT created_at FROM otp_codes 
      WHERE phone = ${phone} 
      ORDER BY created_at DESC LIMIT 1
    `

    if (recent.length > 0) {
      const elapsed =
        (Date.now() - new Date(recent[0].created_at).getTime()) / 1000
      if (elapsed < OTP_COOLDOWN_SECONDS) {
        return error(
          `Подождите ${Math.ceil(OTP_COOLDOWN_SECONDS - elapsed)} секунд перед повторной отправкой`,
          429
        )
      }
    }

    const code = generateOtpCode()
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000)

    await prisma.$executeRaw`DELETE FROM otp_codes WHERE phone = ${phone}`
    await prisma.$executeRaw`
      INSERT INTO otp_codes (phone, code, expires_at, created_at) 
      VALUES (${phone}, ${code}, ${expiresAt}, NOW())
    `

    const result = await sendOtp(phone, code)

    if (!result.success) {
      return error("Не удалось отправить SMS. Попробуйте позже.", 500)
    }

    return success({ sent: true, expiresIn: OTP_EXPIRY_MINUTES * 60 })
  } catch (err) {
    return serverError(err)
  }
}
