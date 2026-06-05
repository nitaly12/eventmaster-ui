import { prisma } from "@/lib/prisma";
import { mapOrganization } from "@/lib/mappers";
import { jsonError, jsonOk, parseJsonBody } from "@/lib/api-response";

export async function GET() {
  const org = await prisma.organization.findUnique({ where: { id: "default" } });
  if (!org) return jsonError("Organization not found", 404);
  return jsonOk(mapOrganization(org));
}

export async function PATCH(request: Request) {
  const body = await parseJsonBody<{ name: string; address: string }>(request);
  if (!body?.name?.trim() || !body?.address?.trim()) {
    return jsonError("Name and address are required");
  }

  const org = await prisma.organization.upsert({
    where: { id: "default" },
    update: {
      name: body.name.trim(),
      address: body.address.trim(),
    },
    create: {
      id: "default",
      name: body.name.trim(),
      address: body.address.trim(),
    },
  });

  return jsonOk(mapOrganization(org));
}
