import { prisma } from "@/lib/prisma";
import { mapEventCategory } from "@/lib/mappers";
import { jsonError, jsonOk, parseJsonBody } from "@/lib/api-response";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = await parseJsonBody<{ name: string }>(request);
  const trimmed = body?.name?.trim();
  if (!trimmed) return jsonError("Category name is required");

  const existing = await prisma.eventCategory.findUnique({ where: { id } });
  if (!existing) return jsonError("Category not found", 404);

  const category = await prisma.eventCategory.update({
    where: { id },
    data: { name: trimmed },
  });

  return jsonOk(mapEventCategory(category));
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const existing = await prisma.eventCategory.findUnique({ where: { id } });
  if (!existing) return jsonError("Category not found", 404);

  await prisma.eventCategory.delete({ where: { id } });

  const categories = await prisma.eventCategory.findMany({ orderBy: { no: "asc" } });
  await Promise.all(
    categories.map((category, index) =>
      prisma.eventCategory.update({
        where: { id: category.id },
        data: { no: index + 1 },
      }),
    ),
  );

  return jsonOk({ success: true });
}
