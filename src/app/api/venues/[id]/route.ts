import { NextRequest } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { updateVenueSchema } from "@/features/venue-edit/model/schema";
import { success, error, notFound, serverError } from "@/shared/api";
import { requireAuth } from "@/shared/lib/auth-guard";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, ctx: RouteContext) {
  try {
    const { id } = await ctx.params;

    const venue = await prisma.venue.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
        isActive: true,
      },
      include: {
        photos: { orderBy: { order: "asc" } },
        owner: { select: { id: true, name: true, phone: true } },
        blockedDates: { select: { date: true } },
      },
    });

    if (!venue) return notFound("Зал");

    await prisma.venue.update({
      where: { id: venue.id },
      data: { viewCount: { increment: 1 } },
    });

    return success(venue);
  } catch (err) {
    return serverError(err);
  }
}

export async function PUT(req: NextRequest, ctx: RouteContext) {
  try {
    const { id } = await ctx.params;
    const result = await requireAuth(["OWNER", "ADMIN"]);
    if (result.error) return result.error;

    const venue = await prisma.venue.findUnique({
      where: { id },
      select: { ownerId: true },
    });

    if (!venue) return notFound("Зал");
    if (venue.ownerId !== result.user.id && result.user.role !== "ADMIN") {
      return error("Вы не можете редактировать этот зал", 403);
    }

    const body = await req.json();
    const parsed = updateVenueSchema.safeParse(body);

    if (!parsed.success) {
      return error(parsed.error.issues[0].message);
    }

    const { photos, ...data } = parsed.data;

    const updated = await prisma.$transaction(async (tx) => {
      if (photos) {
        await tx.venuePhoto.deleteMany({ where: { venueId: id } });

        if (photos.length > 0) {
          await tx.venuePhoto.createMany({
            data: photos.map((photo, index) => ({
              venueId: id,
              url: photo.url,
              key: photo.key,
              order: index,
              isMain: index === 0,
            })),
          });
        }
      }

      return tx.venue.update({
        where: { id },
        data,
      });
    });

    return success(updated);
  } catch (err) {
    return serverError(err);
  }
}

export async function DELETE(_req: NextRequest, ctx: RouteContext) {
  try {
    const { id } = await ctx.params;
    const result = await requireAuth(["OWNER", "ADMIN"]);
    if (result.error) return result.error;

    const venue = await prisma.venue.findUnique({
      where: { id },
      select: { ownerId: true },
    });

    if (!venue) return notFound("Зал");
    if (venue.ownerId !== result.user.id && result.user.role !== "ADMIN") {
      return error("Вы не можете удалить этот зал", 403);
    }
    console.log("aaa", id);
    const updated = await prisma.venue.update({
      where: { id },
      data: { isActive: false },
    });
    console.log("ssss");
    return success({ deleted: false, archived: true, venue: updated });
  } catch (err) {
    return serverError(err);
  }
}

export async function PATCH(req: NextRequest, ctx: RouteContext) {
  try {
    const { id } = await ctx.params;
    const result = await requireAuth(["OWNER", "ADMIN"]);
    if (result.error) return result.error;

    const venue = await prisma.venue.findUnique({
      where: { id },
      select: { ownerId: true },
    });

    if (!venue) return notFound("Зал");
    if (venue.ownerId !== result.user.id && result.user.role !== "ADMIN") {
      return error("Вы не можете изменять статус этого зала", 403);
    }

    const body = await req.json();
    const { isActive } = body as { isActive?: boolean };

    if (typeof isActive !== "boolean") {
      return error("Некорректный статус зала");
    }

    const updated = await prisma.venue.update({
      where: { id },
      data: { isActive },
    });

    return success(updated);
  } catch (err) {
    return serverError(err);
  }
}
