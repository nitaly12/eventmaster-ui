import { prisma } from "@/lib/prisma";
import { mapNotification } from "@/lib/mappers";
import { jsonOk } from "@/lib/api-response";

export async function GET() {
  const notifications = await prisma.notification.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return jsonOk(notifications.map((notification, index) => mapNotification(notification, index)));
}

export async function PATCH() {
  await prisma.notification.updateMany({
    data: { unread: false },
  });
  return jsonOk({ success: true });
}
