import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk } from "@/lib/api-response";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const existing = await prisma.notification.findUnique({ where: { id } });
  if (!existing) return jsonError("Notification not found", 404);

  await prisma.notification.update({
    where: { id },
    data: { unread: false },
  });

  return jsonOk({ success: true });
}
