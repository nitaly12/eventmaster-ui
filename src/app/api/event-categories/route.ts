import { prisma } from "@/lib/prisma";
import { mapEventCategory } from "@/lib/mappers";
import { jsonError, jsonOk, parseJsonBody } from "@/lib/api-response";
import { prismaErrorResponse } from "@/lib/prisma-error";

function formatToday() {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export async function GET() {
  try {
    const categories = await prisma.eventCategory.findMany({ orderBy: { no: "asc" } });
    return jsonOk(categories.map(mapEventCategory));
  } catch (error) {
    return prismaErrorResponse(error) ?? jsonError("Internal server error", 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await parseJsonBody<{ name: string; createdBy?: string }>(request);
    const trimmed = body?.name?.trim();
    if (!trimmed) return jsonError("Category name is required");

    const categories = await prisma.eventCategory.findMany();
    const existing = categories.find(
      (category) => category.name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (existing) return jsonError("Category already exists");

    const count = await prisma.eventCategory.count();
    const category = await prisma.eventCategory.create({
      data: {
        no: count + 1,
        name: trimmed,
        createdAt: formatToday(),
        createdBy: body?.createdBy ?? "Thomas Brown",
      },
    });

    return jsonOk(mapEventCategory(category), 201);
  } catch (error) {
    return prismaErrorResponse(error) ?? jsonError("Internal server error", 500);
  }
}
