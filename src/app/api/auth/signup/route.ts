import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth-utils";
import { jsonError, jsonOk, parseJsonBody } from "@/lib/api-response";
import { prismaErrorResponse } from "@/lib/prisma-error";

export async function POST(request: Request) {
  try {
    const body = await parseJsonBody<{
      name: string;
      email: string;
      password: string;
      phone?: string;
      role?: string;
      organizationCode?: string;
    }>(request);

    const email = body?.email?.trim().toLowerCase();
    const name = body?.name?.trim();
    const password = body?.password;
    const phone = body?.phone?.trim();
    const role = body?.role === "user" ? "user" : "admin";
    const organizationCode = body?.organizationCode?.trim();

    if (!name) return jsonError("Name is required");
    if (!email) return jsonError("Email is required");
    if (!password || password.length < 6)
      return jsonError("Password must be at least 6 characters");
    if (role === "user" && !organizationCode)
      return jsonError("Organization code is required for user role");

    const passwordHash = await hashPassword(password);

    const user = await prisma.authUser.create({
      data: {
        email,
        name,
        phone: phone || null,
        role,
        organizationCode: organizationCode || null,
        passwordHash,
      },
      select: { id: true, email: true, name: true, role: true },
    });

    return jsonOk(user, 201);
  } catch (error) {
    return prismaErrorResponse(error) ?? jsonError("Internal server error", 500);
  }
}
