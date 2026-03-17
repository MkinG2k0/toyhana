const TELEGRAM_API = "https://api.telegram.org"

interface TelegramNotification {
  type: "new_booking" | "status_update"
  venueName: string
  eventDate: string
  eventType: string
  guestCount: number
  contactName: string
  contactPhone: string
  message?: string | null
  status?: string
}

export const sendTelegramNotification = async (
  chatId: string,
  data: TelegramNotification
): Promise<boolean> => {
  const token = process.env.TELEGRAM_BOT_TOKEN

  if (!token) {
    if (process.env.NODE_ENV === "development") {
      console.info("[Telegram Mock]", chatId, data)
      return true
    }
    return false
  }

  const text =
    data.type === "new_booking"
      ? `🎉 Новая заявка!\n\nЗал: ${data.venueName}\nДата: ${data.eventDate}\nТип: ${data.eventType}\nГостей: ${data.guestCount}\nКонтакт: ${data.contactName}\nТел: ${data.contactPhone}${data.message ? `\nСообщение: ${data.message}` : ""}`
      : `📋 Обновление заявки\n\nЗал: ${data.venueName}\nДата: ${data.eventDate}\nСтатус: ${data.status}`

  try {
    const res = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    })
    return res.ok
  } catch {
    return false
  }
}
