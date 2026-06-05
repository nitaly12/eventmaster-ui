import { prisma } from "@/lib/prisma";
import {
  getJwtCookieName,
  verifyAuthToken,
} from "@/lib/auth-utils";
import { jsonError, jsonOk } from "@/lib/api-response";
import { prismaErrorResponse } from "@/lib/prisma-error";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(getJwtCookieName())?.value;
    if (!token) return jsonError("Unauthorized", 401);

    const payload = verifyAuthToken(token);
    const user = await prisma.authUser.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!user) return jsonError("Unauthorized", 401);

    return jsonOk(user);
  } catch (error) {
    // Token invalid/expired, or DB issues
    return prismaErrorResponse(error) ?? jsonError("Unauthorized", 401);
  }
}

