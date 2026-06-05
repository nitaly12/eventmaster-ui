import path from "node:path";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaDatabaseUrl: string | undefined;
};

/** Resolve DATABASE_URL; SQLite paths are relative to prisma/ when used locally. */
export function resolveDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL?.trim();

  if (!envUrl) {
    throw new Error(
      "DATABASE_URL is not set. Add your Neon PostgreSQL connection string in Vercel → Settings → Environment Variables.",
    );
  }

  if (envUrl.startsWith("file:")) {
    const filePath = envUrl.replace(/^file:/, "").replace(/^\/+/, "");
    const absolutePath = path.isAbsolute(filePath)
      ? filePath
      : path.join(process.cwd(), "prisma", path.basename(filePath) || "dev.db");
    return `file:${absolutePath.replace(/\\/g, "/")}`;
  }

  return envUrl;
}

function createPrismaClient(databaseUrl: string) {
  return new PrismaClient({
    datasources: {
      db: { url: databaseUrl },
    },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

function getPrismaClient() {
  const databaseUrl = resolveDatabaseUrl();

  if (
    globalForPrisma.prisma &&
    globalForPrisma.prismaDatabaseUrl === databaseUrl
  ) {
    return globalForPrisma.prisma;
  }

  void globalForPrisma.prisma?.$disconnect();

  const client = createPrismaClient(databaseUrl);
  globalForPrisma.prisma = client;
  globalForPrisma.prismaDatabaseUrl = databaseUrl;
  return client;
}

export const prisma = getPrismaClient();
