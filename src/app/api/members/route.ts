import { prisma } from "@/lib/prisma";
import { mapMember } from "@/lib/mappers";
import { jsonError, jsonOk, parseJsonBody } from "@/lib/api-response";
import { prismaErrorResponse } from "@/lib/prisma-error";

export async function GET() {
  const members = await prisma.member.findMany({ orderBy: { displayId: "asc" } });
  return jsonOk(members.map(mapMember));
}

export async function POST(request: Request) {
  const body = await parseJsonBody<{
    name: string;
    gender: string;
    email: string;
    address: string;
    role: string;
    avatar?: string | null;
  }>(request);

  if (!body?.name?.trim() || !body.email?.trim()) {
    return jsonError("Name and email are required");
  }

  const count = await prisma.member.count();
  const displayId = String(count + 1).padStart(3, "0");

  const member = await prisma.member.create({
    data: {
      displayId,
      name: body.name.trim(),
      gender: body.gender,
      email: body.email.trim(),
      address: body.address,
      role: body.role,
      avatar: body.avatar ?? null,
    },
  });

  return jsonOk(mapMember(member), 201);
}

export async function DELETE(request: Request) {
  try {
    const body = await parseJsonBody<{ ids?: string[] }>(request);
    const ids = body?.ids?.filter(Boolean) ?? [];
    if (ids.length === 0) return jsonError("No members selected");

    const members = await prisma.member.findMany({
      where: { displayId: { in: ids } },
    });

    if (members.length === 0) return jsonError("No members found", 404);

    const hasAdmin = members.some((member) => member.role === "Admin");
    if (hasAdmin) return jsonError("Cannot delete admin members", 403);

    await prisma.member.deleteMany({
      where: { displayId: { in: ids } },
    });

    return jsonOk({ deleted: ids.length });
  } catch (error) {
    return prismaErrorResponse(error) ?? jsonError("Internal server error", 500);
  }
}
