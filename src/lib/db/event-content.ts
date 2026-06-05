import { prisma } from "@/lib/prisma";

type AgendaInput = {
  id?: string;
  time: string;
  title: string;
  description?: string | null;
  speaker?: string | null;
  accent?: string;
};

type MaterialInput = {
  id?: string;
  no: number;
  name: string;
  qty: number | string;
  unit: string;
  dueDate: string;
  handler: string;
  supporterIds?: string[];
  status: string;
  note?: string;
};

type RegistrationActivityInput = {
  id?: string;
  fullName: string;
  phone: string;
};

export async function saveEventAgenda(eventId: string, items: AgendaInput[]) {
  await prisma.agendaItem.deleteMany({ where: { eventId } });

  if (items.length === 0) return;

  await prisma.agendaItem.createMany({
    data: items.map((item, index) => ({
      eventId,
      sortOrder: index,
      time: item.time,
      title: item.title,
      description: item.description ?? null,
      speaker: item.speaker ?? null,
      accent: item.accent ?? "green",
    })),
  });
}

export async function saveEventMaterials(eventId: string, items: MaterialInput[]) {
  await prisma.material.deleteMany({ where: { eventId } });

  if (items.length === 0) return;

  await prisma.material.createMany({
    data: items.map((item, index) => ({
      eventId,
      no: item.no ?? index + 1,
      name: item.name || "Untitled",
      qty: Number(item.qty) || 0,
      unit: item.unit || "Boxes",
      dueDate: item.dueDate || "",
      handler: item.handler || "",
      supporterIds: item.supporterIds ?? [],
      status: item.status || "Pending",
      note: item.note ?? "",
    })),
  });
}

export async function saveEventRegistrationForm(
  eventId: string,
  activities: RegistrationActivityInput[],
) {
  await prisma.event.update({
    where: { id: eventId },
    data: { registrationForm: activities },
  });
}
