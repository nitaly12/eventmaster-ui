import { getOverviewStats } from "@/lib/db/overview";
import { jsonOk } from "@/lib/api-response";

export async function GET() {
  const stats = await getOverviewStats();
  return jsonOk({ stats });
}
