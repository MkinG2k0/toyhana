import { auth } from "@/lib/auth"
import { unauthorized, forbidden } from "@/lib/api-response"

import type { UserRole } from "@/types/user"
import type { NextResponse } from "next/server"

interface AuthSuccess {
  user: {
    id: string
    phone?: string | null
    email?: string | null
    name: string
    role: UserRole
  }
  error?: never
}

interface AuthFailure {
  user?: never
  error: NextResponse
}

export const requireAuth = async (
  allowedRoles?: UserRole[]
): Promise<AuthSuccess | AuthFailure> => {
  const session = await auth()

  if (!session?.user) {
    return { error: unauthorized() }
  }

  if (allowedRoles && !allowedRoles.includes(session.user.role)) {
    return { error: forbidden() }
  }

  return { user: session.user }
}
