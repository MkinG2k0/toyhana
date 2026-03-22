import "dotenv/config";
import { defineConfig } from "prisma/config";

import { normalizeDatabaseUrl } from "./src/shared/lib/database-url";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: normalizeDatabaseUrl(process.env["DATABASE_URL"] ?? ""),
  },
});
