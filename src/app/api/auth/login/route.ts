import { prisma } from "@/lib/prisma";
import { signAuthToken, verifyPassword, getJwtCookieName } from "@/lib/auth-utils";
import { jsonError, jsonOk, parseJsonBody } from "@/lib/api-response";
import { prismaErrorResponse } from "@/lib/prisma-error";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await parseJsonBody<{ email: string; password: string }>(
      request,
    );
    const email = body?.email?.trim().toLowerCase();
    const password = body?.password;

    if (!email) return jsonError("Email is required");
    if (!password) return jsonError("Password is required");

    const user = await prisma.authUser.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, role: true, passwordHash: true },
    });

    if (!user) return jsonError("Invalid email or password", 401);

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) return jsonError("Invalid email or password", 401);

    const token = signAuthToken({ sub: user.id, role: user.role });

    const cookieStore = await cookies();
    cookieStore.set(getJwtCookieName(), token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    });

    return jsonOk(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      200,
    );
  } catch (error) {
    return prismaErrorResponse(error) ?? jsonError("Internal server error", 500);
  }
}

