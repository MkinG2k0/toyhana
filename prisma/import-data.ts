import "dotenv/config";

import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { createScriptPrismaClient } from "./lib/script-prisma-client";
import {
  mapBlockedDates,
  mapBookings,
  mapOtpCodes,
  mapReviews,
  mapUsers,
  mapVenuePhotos,
  mapVenuePlacementRequests,
  mapVenues,
} from "./lib/map-export-rows";

const DEFAULT_RELATIVE_PATH = join(
  "generated",
  "db-export",
  "prisma-full-export-2.json",
);

interface ExportFileShape {
  data: {
    otpCodes: Record<string, unknown>[];
    users: Record<string, unknown>[];
    venues: Record<string, unknown>[];
    venuePhotos: Record<string, unknown>[];
    blockedDates: Record<string, unknown>[];
    bookings: Record<string, unknown>[];
    venuePlacementRequests: Record<string, unknown>[];
    reviews: Record<string, unknown>[];
  };
}

const parsePayload = (raw: unknown): ExportFileShape => {
  if (typeof raw !== "object" || raw === null || !("data" in raw)) {
    throw new Error("Неверный формат JSON: ожидается объект с полем data");
  }
  const { data } = raw as { data: unknown };
  if (typeof data !== "object" || data === null) {
    throw new Error("Неверный формат JSON: data должен быть объектом");
  }
  const d = data as Record<string, unknown>;
  const keys = [
    "otpCodes",
    "users",
    "venues",
    "venuePhotos",
    "blockedDates",
    "bookings",
    "venuePlacementRequests",
    "reviews",
  ] as const;
  for (const key of keys) {
    if (!Array.isArray(d[key])) {
      throw new Error(`Неверный формат JSON: data.${key} должен быть массивом`);
    }
  }
  return raw as ExportFileShape;
};

const main = async (): Promise<void> => {
  const relativePath = process.argv[2] ?? DEFAULT_RELATIVE_PATH;
  const absolutePath = join(process.cwd(), relativePath);
  const fileText = await readFile(absolutePath, "utf8");
  const payload = parsePayload(JSON.parse(fileText) as unknown);

  const prisma = createScriptPrismaClient();
  console.log("start import data");
  try {
    await prisma.$transaction(async (tx) => {
      const { data } = payload;

      if (data.users.length > 0) {
        console.log("import users");
        await tx.user.createMany({
          data: mapUsers(data.users),
          skipDuplicates: true,
        });
      }
      if (data.otpCodes.length > 0) {
        console.log("import otp codes");
        await tx.otpCode.createMany({
          data: mapOtpCodes(data.otpCodes),
          skipDuplicates: true,
        });
      }
      if (data.venues.length > 0) {
        console.log("import venues");
        await tx.venue.createMany({
          data: mapVenues(data.venues),
          skipDuplicates: true,
        });
      }
      if (data.venuePhotos.length > 0) {
        console.log("import venue photos");
        await tx.venuePhoto.createMany({
          data: mapVenuePhotos(data.venuePhotos),
          skipDuplicates: true,
        });
      }
      if (data.blockedDates.length > 0) {
        console.log("import blocked dates");
        await tx.blockedDate.createMany({
          data: mapBlockedDates(data.blockedDates),
          skipDuplicates: true,
        });
      }
      if (data.bookings.length > 0) {
        console.log("import bookings");
        await tx.booking.createMany({
          data: mapBookings(data.bookings),
          skipDuplicates: true,
        });
      }
      if (data.venuePlacementRequests.length > 0) {
        console.log("import venue placement requests");
        await tx.venuePlacementRequest.createMany({
          data: mapVenuePlacementRequests(data.venuePlacementRequests),
          skipDuplicates: true,
        });
      }
      if (data.reviews.length > 0) {
        console.log("import reviews");
        await tx.review.createMany({
          data: mapReviews(data.reviews),
          skipDuplicates: true,
        });
      }
    });

    process.stdout.write(
      `Импорт из ${absolutePath} завершён (дубликаты по PK пропущены).\n`,
    );
  } finally {
    await prisma.$disconnect();
  }
};

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Ошибка импорта: ${message}\n`);
  process.exit(1);
});
