import { prisma } from "@/lib/prisma";
import { mapEventDetail } from "@/lib/mappers";

export async function getDashboardEventFromDb(id: string) {
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      agendaItems: { orderBy: { sortOrder: "asc" } },
      materials: { orderBy: { no: "asc" } },
    },
  });

  if (!event) return null;
  return mapEventDetail(event);
}
