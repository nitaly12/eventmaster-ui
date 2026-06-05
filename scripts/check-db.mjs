import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

try {
  const count = await prisma.eventCategory.count();
  console.log(`OK: ${count} event categories in database`);
} catch (error) {
  console.error("FAIL:", error.message);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
