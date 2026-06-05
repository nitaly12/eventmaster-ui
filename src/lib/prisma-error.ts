import { Prisma } from "@prisma/client";
import { jsonError } from "@/lib/api-response";

export function prismaErrorResponse(error: unknown) {
  if (error instanceof Prisma.PrismaClientInitializationError) {
    const hint = error.message.includes("Authentication failed")
      ? "Stop npm run dev, run: npm run dev:reset, then npm run dev again."
      : "Run: npm run db:push && npm run db:seed, then npm run dev:reset";
    return jsonError(`Database connection failed. ${hint}`, 503);
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return jsonError("A record with this value already exists", 409);
    }
    if (error.code === "P2025") {
      return jsonError("Record not found", 404);
    }
  }

  return null;
}
