import { prisma } from "@/lib/prisma";
import { mapAsset } from "@/lib/mappers";
import { jsonError, jsonOk, parseJsonBody } from "@/lib/api-response";
import { prismaErrorResponse } from "@/lib/prisma-error";

async function renumberAssets() {
  const assets = await prisma.asset.findMany({ orderBy: { createdAt: "asc" } });
  await Promise.all(
    assets.map((asset, index) =>
      prisma.asset.update({
        where: { id: asset.id },
        data: { no: index + 1 },
      }),
    ),
  );
}

export async function GET() {
  const assets = await prisma.asset.findMany({ orderBy: { no: "asc" } });
  return jsonOk(assets.map(mapAsset));
}

export async function POST(request: Request) {
  const body = await parseJsonBody<{
    name: string;
    qty: number;
    unit: string;
    createdBy?: string;
  }>(request);

  if (!body?.name?.trim()) return jsonError("Asset name is required");

  const count = await prisma.asset.count();
  const asset = await prisma.asset.create({
    data: {
      no: count + 1,
      name: body.name.trim(),
      qty: Number(body.qty) || 0,
      unit: body.unit,
      createdBy: body.createdBy ?? "Thomas Brown",
    },
  });

  return jsonOk(mapAsset(asset), 201);
}

export async function DELETE(request: Request) {
  try {
    const body = await parseJsonBody<{ ids?: string[] }>(request);
    const ids = body?.ids?.filter(Boolean) ?? [];
    if (ids.length === 0) return jsonError("No assets selected");

    const result = await prisma.asset.deleteMany({
      where: { id: { in: ids } },
    });

    if (result.count === 0) return jsonError("No assets found", 404);

    await renumberAssets();

    return jsonOk({ deleted: result.count });
  } catch (error) {
    return prismaErrorResponse(error) ?? jsonError("Internal server error", 500);
  }
}

export { renumberAssets };
