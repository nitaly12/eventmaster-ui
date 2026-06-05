import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk } from "@/lib/api-response";
import { prismaErrorResponse } from "@/lib/prisma-error";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categoryCount = await prisma.eventCategory.count();
    return jsonOk({
      ok: true,
      database: "connected",
      eventCategories: categoryCount,
    });
  } catch (error) {
    return prismaErrorResponse(error) ?? jsonError("Database health check failed", 500);
  }
}
