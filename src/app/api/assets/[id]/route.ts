import { prisma } from "@/lib/prisma";
import { mapAsset } from "@/lib/mappers";
import { jsonError, jsonOk, parseJsonBody } from "@/lib/api-response";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = await parseJsonBody<{
    name?: string;
    qty?: number;
    unit?: string;
  }>(request);

  const existing = await prisma.asset.findUnique({ where: { id } });
  if (!existing) return jsonError("Asset not found", 404);

  const asset = await prisma.asset.update({
    where: { id },
    data: {
      name: body?.name?.trim() ?? existing.name,
      qty: body?.qty !== undefined ? Number(body.qty) : existing.qty,
      unit: body?.unit ?? existing.unit,
    },
  });

  return jsonOk(mapAsset(asset));
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const existing = await prisma.asset.findUnique({ where: { id } });
  if (!existing) return jsonError("Asset not found", 404);

  await prisma.asset.delete({ where: { id } });

  const assets = await prisma.asset.findMany({ orderBy: { createdAt: "asc" } });
  await Promise.all(
    assets.map((asset, index) =>
      prisma.asset.update({
        where: { id: asset.id },
        data: { no: index + 1 },
      }),
    ),
  );

  return jsonOk({ success: true });
}
