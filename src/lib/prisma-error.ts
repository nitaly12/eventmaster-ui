import { Prisma } from "@prisma/client";
import { jsonError } from "@/lib/api-response";

export function prismaErrorResponse(error: unknown) {
  if (error instanceof Prisma.PrismaClientInitializationError) {
    const message = error.message.toLowerCase();
    const hint = message.includes("authentication")
      ? "Check DATABASE_URL in your .env file (copy a fresh pooled connection string from Neon → Connection details)."
      : message.includes("must start with the protocol")
        ? "DATABASE_URL must be a PostgreSQL URL (postgresql://...)."
        : "Use the Neon *pooled* connection string in Vercel and add ?sslmode=require if missing.";
    return jsonError(`Database connection failed. ${hint}`, 503);
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return jsonError("A record with this value already exists", 409);
    }
    if (error.code === "P2025") {
      return jsonError("Record not found", 404);
    }
    if (error.code === "P2021") {
      return jsonError(
        "Database tables not found. Run: npx prisma db push && npm run db:seed (using your Neon DATABASE_URL).",
        503,
      );
    }
    if (error.code === "P1001" || error.code === "P1002") {
      return jsonError(
        "Cannot reach the database server. Check Neon is active and DATABASE_URL uses the pooled connection string.",
        503,
      );
    }
  }

  if (error instanceof Error) {
    if (error.message.includes("DATABASE_URL is not set")) {
      return jsonError(error.message, 503);
    }
  }

  return null;
}
