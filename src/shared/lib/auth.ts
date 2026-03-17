import NextAuth from "next-auth"
import "next-auth/jwt"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"

import type { UserRole } from "@/entities/user"

declare module "next-auth" {
  interface User {
    id?: string
    phone?: string | null
    email?: string | null
    name?: string | null
    role?: UserRole
  }

  interface Session {
    user: {
      id: string
      phone?: string | null
      email?: string | null
      name: string
      role: UserRole
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    phone?: string | null
    email?: string | null
    role?: UserRole
  }
}

const authSecret =
  process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: authSecret,
  providers: [
    ...(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            authorization: {
              params: { prompt: "consent" },
            },
          }),
        ]
      : []),
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

        const { prisma } = await import("@/shared/lib/prisma")

        const storedOtp = await prisma.otpCode.findFirst({
          where: { phone },
          orderBy: { createdAt: "desc" },
          select: { code: true, expiresAt: true },
        })

        if (
          !storedOtp ||
          storedOtp.code !== code ||
          storedOtp.expiresAt < new Date()
        ) {
          return null
        }

        await prisma.otpCode.deleteMany({ where: { phone } })

        const user = await prisma.user.findUnique({ where: { phone } })
        if (!user) return null

        return {
          id: user.id,
          phone: user.phone ?? undefined,
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
    async jwt({ token, user, account }) {
      if (user && account?.provider === "google") {
        const { prisma } = await import("@/shared/lib/prisma")
        const email = user.email ?? null
        const name = user.name ?? "Пользователь"
        const image = user.image ?? null
        if (!email) return token

        const dbUser = await prisma.user.upsert({
          where: { email },
          update: {
            name,
            avatar: image,
          },
          create: {
            email,
            name,
            avatar: image,
            role: "CLIENT",
          },
        })

        token.id = dbUser.id
        token.phone = dbUser.phone ?? null
        token.email = dbUser.email ?? null
        token.role = dbUser.role
        return token
      }
      if (user) {
        token.id = user.id
        token.phone = user.phone ?? null
        token.email = null
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      const u = session.user as {
        id: string
        phone?: string | null
        email?: string | null
        name: string
        role: UserRole
      }
      u.id = token.id as string
      u.phone = (token.phone as string | null) ?? undefined
      u.email = (token.email as string | null) ?? undefined
      if (token.id) {
        const { prisma } = await import("@/shared/lib/prisma")
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true },
        })
        u.role = (dbUser?.role ?? token.role) as UserRole
      } else {
        u.role = token.role as UserRole
      }
      return session
    },
  },
})
