import "dotenv/config";

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { createScriptPrismaClient } from "./lib/script-prisma-client";

const EXPORT_DIR = "generated/db-export";
const EXPORT_FILE = "prisma-full-export.json";

const main = async (): Promise<void> => {
  const prisma = createScriptPrismaClient();

  try {
    const [
      otpCodes,
      users,
      venues,
      venuePhotos,
      blockedDates,
      bookings,
      venuePlacementRequests,
      reviews,
    ] = await Promise.all([
      prisma.otpCode.findMany(),
      prisma.user.findMany(),
      prisma.venue.findMany(),
      prisma.venuePhoto.findMany(),
      prisma.blockedDate.findMany(),
      prisma.booking.findMany(),
      prisma.venuePlacementRequest.findMany(),
      prisma.review.findMany(),
    ]);

    const payload = {
      meta: {
        exportedAt: new Date().toISOString(),
        source: "postgresql",
        note: "Порядок вставки на новом хосте: users → otp_codes → venues → venue_photos → blocked_dates → bookings → venue_placement_requests → reviews. Для PostgreSQL проще: pg_dump/pg_restore.",
      },
      counts: {
        otpCodes: otpCodes.length,
        users: users.length,
        venues: venues.length,
        venuePhotos: venuePhotos.length,
        blockedDates: blockedDates.length,
        bookings: bookings.length,
        venuePlacementRequests: venuePlacementRequests.length,
        reviews: reviews.length,
      },
      data: {
        otpCodes,
        users,
        venues,
        venuePhotos,
        blockedDates,
        bookings,
        venuePlacementRequests,
        reviews,
      },
    };

    const outDir = join(process.cwd(), EXPORT_DIR);
    await mkdir(outDir, { recursive: true });
    const outPath = join(outDir, EXPORT_FILE);
    await writeFile(outPath, JSON.stringify(payload, null, 2), "utf8");

    process.stdout.write(
      `Экспорт готов: ${outPath}\n` +
        `Записей: users=${users.length}, venues=${venues.length}, bookings=${bookings.length}, …\n`,
    );
  } finally {
    await prisma.$disconnect();
  }
};

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Ошибка экспорта: ${message}\n`);
  process.exit(1);
});
