import path from "node:path";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaDatabaseUrl: string | undefined;
};

/** SQLite paths in .env are relative to prisma/; Next.js cwd is the project root. */
export function resolveDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL?.trim();

  if (envUrl?.startsWith("file:")) {
    const filePath = envUrl.replace(/^file:/, "").replace(/^\/+/, "");
    const absolutePath = path.isAbsolute(filePath)
      ? filePath
      : path.join(process.cwd(), "prisma", path.basename(filePath) || "dev.db");
    return `file:${absolutePath.replace(/\\/g, "/")}`;
  }

  if (envUrl) {
    return envUrl;
  }

  const fallback = path.join(process.cwd(), "prisma", "dev.db");
  return `file:${fallback.replace(/\\/g, "/")}`;
}

function createPrismaClient(databaseUrl: string) {
  return new PrismaClient({
    datasources: {
      db: { url: databaseUrl },
    },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

const databaseUrl = resolveDatabaseUrl();

if (globalForPrisma.prismaDatabaseUrl !== databaseUrl) {
  void globalForPrisma.prisma?.$disconnect();
  globalForPrisma.prisma = undefined;
}

export const prisma =
  globalForPrisma.prisma ?? createPrismaClient(databaseUrl);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaDatabaseUrl = databaseUrl;
}
