export type UserRole = "CLIENT" | "OWNER" | "ADMIN"

export interface UserProfile {
  id: string
  phone: string
  name: string
  role: UserRole
  avatar: string | null
  telegramChatId: string | null
  whatsappPhone: string | null
}
