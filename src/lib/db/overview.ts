import { prisma } from "@/lib/prisma";

export async function getOverviewStats() {
  const [eventCount, publishedCount, attendeeCount, memberCount] = await Promise.all([
    prisma.event.count(),
    prisma.event.count({ where: { status: "Open" } }),
    prisma.attendee.count(),
    prisma.member.count(),
  ]);

  return [
    { id: "events", label: "Event Count", value: String(eventCount), icon: "calendar" },
    {
      id: "published",
      label: "Published Event",
      value: String(publishedCount),
      icon: "published",
    },
    {
      id: "attendees",
      label: "Total Attendees",
      value: attendeeCount.toLocaleString(),
      icon: "users",
    },
    { id: "members", label: "Members", value: String(memberCount), icon: "member" },
  ];
}
