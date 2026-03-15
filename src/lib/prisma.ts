import { PrismaClient } from "../../generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

import { normalizeDatabaseUrl } from "@/lib/database-url"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const createPrismaClient = (): PrismaClient => {
  const raw = process.env.DATABASE_URL ?? ""
  const connectionString = normalizeDatabaseUrl(raw)
  const adapter = new PrismaPg({ connectionString })
  return new PrismaClient({ adapter })
}

const getPrisma = (): PrismaClient => {
  const cached = globalForPrisma.prisma
  const isStale =
    process.env.NODE_ENV !== "production" &&
    cached != null &&
    !("otpCode" in cached)
  if (isStale) globalForPrisma.prisma = undefined
  const client = globalForPrisma.prisma ?? createPrismaClient()
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client
  return client
}

export const prisma = getPrisma()
