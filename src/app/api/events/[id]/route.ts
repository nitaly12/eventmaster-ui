import { getDashboardEventFromDb } from "@/lib/db/events";
import { prisma } from "@/lib/prisma";
import { mapEventListItem } from "@/lib/mappers";
import { jsonError, jsonOk, parseJsonBody } from "@/lib/api-response";
import { prismaErrorResponse } from "@/lib/prisma-error";

function resolveImageUrl(image: unknown, fallback: string | null) {
  if (typeof image !== "string" || !image.trim() || image.startsWith("blob:")) {
    return fallback;
  }
  return image;
}

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const event = await getDashboardEventFromDb(id);
  if (!event) return jsonError("Event not found", 404);
  return jsonOk(event);
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await parseJsonBody<Record<string, unknown>>(request);
    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) return jsonError("Event not found", 404);

    const event = await prisma.event.update({
      where: { id },
      data: {
        title: typeof body?.title === "string" ? body.title.trim() : existing.title,
        category: typeof body?.category === "string" ? body.category : existing.category,
        status: typeof body?.status === "string" ? body.status : existing.status,
        startDate:
          typeof body?.startDate === "string" ? new Date(body.startDate) : existing.startDate,
        endDate: typeof body?.endDate === "string" ? new Date(body.endDate) : existing.endDate,
        duration: typeof body?.duration === "string" ? body.duration : existing.duration,
        maxAttendee:
          body?.maxAttendee !== undefined
            ? Number(body.maxAttendee) || 0
            : existing.maxAttendee,
        address: typeof body?.address === "string" ? body.address : existing.address,
        description:
          typeof body?.description === "string" ? body.description : existing.description,
        longDescription:
          typeof body?.longDescription === "string"
            ? body.longDescription
            : existing.longDescription,
        image: resolveImageUrl(body?.image, existing.image),
        isPublic:
          typeof body?.isPublic === "boolean" ? body.isPublic : existing.isPublic,
      },
    });

    return jsonOk(mapEventListItem(event));
  } catch (error) {
    return prismaErrorResponse(error) ?? jsonError("Internal server error", 500);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const existing = await prisma.event.findUnique({ where: { id } });
  if (!existing) return jsonError("Event not found", 404);

  await prisma.event.delete({ where: { id } });
  return jsonOk({ success: true });
}
