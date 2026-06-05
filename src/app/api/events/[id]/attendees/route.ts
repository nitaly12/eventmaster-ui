import { prisma } from "@/lib/prisma";
import { mapAttendee } from "@/lib/mappers";
import { jsonError, jsonOk } from "@/lib/api-response";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) return jsonError("Event not found", 404);

  const attendees = await prisma.attendee.findMany({
    where: { eventId: id },
    orderBy: { id: "asc" },
  });

  return jsonOk(attendees.map((attendee, index) => mapAttendee(attendee, index)));
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id: eventId } = await context.params;
  const url = new URL(_request.url);
  const attendeeId = url.searchParams.get("attendeeId");
  if (!attendeeId) return jsonError("attendeeId is required");

  const rows = await prisma.attendee.findMany({
    where: { eventId },
    orderBy: { id: "asc" },
  });
  const index = Number(attendeeId) - 1;
  const target = rows[index];
  if (!target) return jsonError("Attendee not found", 404);

  await prisma.attendee.delete({ where: { id: target.id } });
  return jsonOk({ success: true });
}
