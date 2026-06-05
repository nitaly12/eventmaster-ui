import { saveEventRegistrationForm } from "@/lib/db/event-content";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk, parseJsonBody } from "@/lib/api-response";
import { prismaErrorResponse } from "@/lib/prisma-error";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await parseJsonBody<{ activities?: unknown[] }>(request);

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return jsonError("Event not found", 404);

    const activities = Array.isArray(body?.activities) ? body.activities : [];
    await saveEventRegistrationForm(
      id,
      activities as Parameters<typeof saveEventRegistrationForm>[1],
    );

    return jsonOk({ success: true });
  } catch (error) {
    return prismaErrorResponse(error) ?? jsonError("Internal server error", 500);
  }
}
