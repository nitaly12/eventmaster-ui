import { prisma } from "@/lib/prisma";
import { mapEventListItem } from "@/lib/mappers";
import { jsonError, jsonOk, parseJsonBody } from "@/lib/api-response";
import { prismaErrorResponse } from "@/lib/prisma-error";

function resolveImageUrl(image: unknown) {
  if (typeof image !== "string" || !image.trim()) {
    return "/images/festival.png";
  }
  if (image.startsWith("blob:")) {
    return "/images/festival.png";
  }
  return image;
}

export async function GET() {
  try {
    const events = await prisma.event.findMany({ orderBy: { startDate: "desc" } });
    return jsonOk(events.map(mapEventListItem));
  } catch (error) {
    return prismaErrorResponse(error) ?? jsonError("Internal server error", 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await parseJsonBody<{
      id?: string;
      title: string;
      category: string;
      status?: string;
      startDate: string;
      endDate: string;
      duration?: string;
      maxAttendee?: number | null;
      address?: string;
      description?: string;
      image?: string | null;
      isPublic?: boolean;
    }>(request);

    if (!body?.title?.trim()) return jsonError("Event title is required");
    if (!body?.category) return jsonError("Category is required");
    if (!body?.startDate || !body?.endDate) {
      return jsonError("Start and end dates are required");
    }

    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return jsonError("Invalid date values");
    }

    const id = body.id ?? `evt-${Date.now()}`;
    const event = await prisma.event.create({
      data: {
        id,
        title: body.title.trim(),
        category: body.category,
        status: body.status ?? "Open",
        startDate,
        endDate,
        duration: body.duration?.trim() || "TBD",
        maxAttendee:
          body.maxAttendee !== undefined && body.maxAttendee !== null
            ? Number(body.maxAttendee) || 0
            : 0,
        address: body.address?.trim() || "",
        description: body.description?.trim() || "",
        longDescription: body.description?.trim() || "",
        image: resolveImageUrl(body.image),
        isPublic: body.isPublic ?? true,
      },
    });

    return jsonOk(mapEventListItem(event), 201);
  } catch (error) {
    return prismaErrorResponse(error) ?? jsonError("Internal server error", 500);
  }
}
