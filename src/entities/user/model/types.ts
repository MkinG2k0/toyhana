export type UserRole = "CLIENT" | "OWNER" | "ADMIN"

export interface UserProfile {
  id: string
  name: string
  email: string | null
  phone: string
  image: string | null
  role: UserRole
  createdAt: string
}

export interface SessionUser {
  id: string
  name: string
  email: string | null
  phone: string
  role: UserRole
  image: string | null
}
