import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import { normalizeDatabaseUrl } from "../../src/shared/lib/database-url";

export const createScriptPrismaClient = (): PrismaClient => {
  const raw = process.env.DATABASE_URL ?? "";
  const connectionString = normalizeDatabaseUrl(raw);
  if (!connectionString) {
    throw new Error("Задайте DATABASE_URL в окружении или в .env");
  }
  const adapter = new PrismaPg({ connectionString: raw });
  return new PrismaClient({ adapter });
};
