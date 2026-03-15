import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

import type { UserRole } from "@/types/user"

declare module "next-auth" {
  interface User {
    id?: string
    phone?: string
    name?: string | null
    role?: UserRole
  }

  interface Session {
    user: {
      id: string
      phone: string
      name: string
      role: UserRole
    }
  }
}

const authSecret =
  process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: authSecret,
  providers: [
    Credentials({
      id: "otp-login",
      name: "OTP Login",
      credentials: {
        phone: { label: "Телефон", type: "text" },
        code: { label: "Код", type: "text" },
      },
      async authorize(credentials) {
        const phone = credentials?.phone as string | undefined
        const code = credentials?.code as string | undefined

        if (!phone || !code) return null

        const { prisma } = await import("@/lib/prisma")

        const storedOtp = await prisma.$queryRaw<
          { code: string; expires_at: Date }[]
        >`SELECT code, expires_at FROM otp_codes WHERE phone = ${phone} ORDER BY created_at DESC LIMIT 1`

        if (
          !storedOtp.length ||
          storedOtp[0].code !== code ||
          storedOtp[0].expires_at < new Date()
        ) {
          return null
        }

        await prisma.$executeRaw`DELETE FROM otp_codes WHERE phone = ${phone}`

        const user = await prisma.user.findUnique({ where: { phone } })
        if (!user) return null

        return {
          id: user.id,
          phone: user.phone,
          name: user.name,
          role: user.role as UserRole,
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.phone = user.phone
        token.role = user.role
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      session.user.phone = token.phone as string
      session.user.role = token.role as UserRole
      return session
    },
  },
})
