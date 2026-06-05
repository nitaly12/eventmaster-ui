import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk } from "@/lib/api-response";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const existing = await prisma.userRequest.findUnique({ where: { displayId: id } });
  if (!existing) return jsonError("Request not found", 404);

  await prisma.userRequest.delete({ where: { displayId: id } });
  return jsonOk({ success: true });
}
