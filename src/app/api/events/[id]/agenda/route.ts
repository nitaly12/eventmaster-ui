import { saveEventAgenda } from "@/lib/db/event-content";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk, parseJsonBody } from "@/lib/api-response";
import { prismaErrorResponse } from "@/lib/prisma-error";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await parseJsonBody<{ items?: unknown[] }>(request);

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return jsonError("Event not found", 404);

    const items = Array.isArray(body?.items) ? body.items : [];
    await saveEventAgenda(id, items as Parameters<typeof saveEventAgenda>[1]);

    return jsonOk({ success: true });
  } catch (error) {
    return prismaErrorResponse(error) ?? jsonError("Internal server error", 500);
  }
}
