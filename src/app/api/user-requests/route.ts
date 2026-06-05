import { prisma } from "@/lib/prisma";
import { mapUserRequest } from "@/lib/mappers";
import { jsonOk } from "@/lib/api-response";

export async function GET() {
  const requests = await prisma.userRequest.findMany({
    where: { status: "pending" },
    orderBy: { displayId: "asc" },
  });
  return jsonOk(requests.map(mapUserRequest));
}
