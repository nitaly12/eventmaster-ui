import { prisma } from "@/lib/prisma";
import { mapMember } from "@/lib/mappers";
import { jsonError, jsonOk, parseJsonBody } from "@/lib/api-response";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = await parseJsonBody<{ role?: string }>(request);

  const existing = await prisma.member.findUnique({ where: { displayId: id } });
  if (!existing) return jsonError("Member not found", 404);

  const member = await prisma.member.update({
    where: { displayId: id },
    data: { role: body?.role ?? existing.role },
  });

  return jsonOk(mapMember(member));
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const existing = await prisma.member.findUnique({ where: { displayId: id } });
  if (!existing) return jsonError("Member not found", 404);
  if (existing.role === "Admin") return jsonError("Cannot delete admin member", 403);

  await prisma.member.delete({ where: { displayId: id } });
  return jsonOk({ success: true });
}
