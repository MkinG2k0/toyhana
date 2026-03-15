const SMS_RU_API_URL = "https://sms.ru/sms/send"

interface SendSmsResult {
  success: boolean
  error?: string
}

export const sendSms = async (
  phone: string,
  message: string
): Promise<SendSmsResult> => {
  const apiKey = process.env.SMS_RU_API_KEY

  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.info(`[SMS Mock] To: ${phone}, Message: ${message}`)
      return { success: true }
    }
    return { success: false, error: "SMS API key not configured" }
  }

  try {
    const params = new URLSearchParams({
      api_id: apiKey,
      to: phone.replace(/\D/g, ""),
      msg: message,
      json: "1",
    })

    const response = await fetch(`${SMS_RU_API_URL}?${params}`)
    const data = await response.json()

    if (data.status === "OK") {
      return { success: true }
    }

    return { success: false, error: data.status_text ?? "Unknown SMS error" }
  } catch (err) {
    const message = err instanceof Error ? err.message : "SMS send failed"
    return { success: false, error: message }
  }
}

export const sendOtp = async (phone: string, code: string): Promise<SendSmsResult> => {
  return sendSms(phone, `Тойхана: ваш код подтверждения — ${code}. Никому не сообщайте этот код.`)
}

export const generateOtpCode = (): string => {
  return String(Math.floor(1000 + Math.random() * 9000))
}
