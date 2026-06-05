import { prisma } from "@/lib/prisma";
import { mapUserProfile } from "@/lib/mappers";
import { deleteUploadedAvatar } from "@/lib/save-uploaded-image";
import { jsonError, jsonOk, parseJsonBody } from "@/lib/api-response";
import { prismaErrorResponse } from "@/lib/prisma-error";

function resolveAvatarUrl(avatar: unknown, fallback: string | null) {
  if (typeof avatar !== "string" || !avatar.trim() || avatar.startsWith("blob:")) {
    return fallback;
  }
  return avatar;
}

export async function GET() {
  try {
    const profile = await prisma.userProfile.findUnique({ where: { id: "default" } });
    if (!profile) return jsonError("Profile not found", 404);
    return jsonOk(mapUserProfile(profile));
  } catch (error) {
    return prismaErrorResponse(error) ?? jsonError("Internal server error", 500);
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await parseJsonBody<{
      name: string;
      gender: string;
      email: string;
      date: string;
      phone: string;
      address: string;
      role?: string;
      avatar?: string | null;
    }>(request);

    if (!body?.name?.trim()) return jsonError("Name is required");
    if (!body?.gender?.trim()) return jsonError("Gender is required");
    if (!body?.email?.trim()) return jsonError("Email is required");
    if (!body?.date) return jsonError("Date is required");
    if (!body?.phone?.trim()) return jsonError("Phone number is required");
    if (!body?.address?.trim()) return jsonError("Address is required");

    const birthDate = new Date(body.date);
    if (Number.isNaN(birthDate.getTime())) {
      return jsonError("Invalid date");
    }

    const existing = await prisma.userProfile.findUnique({ where: { id: "default" } });

    const nextAvatar = resolveAvatarUrl(body.avatar, existing?.avatar ?? null);

    const profile = await prisma.userProfile.upsert({
      where: { id: "default" },
      update: {
        name: body.name.trim(),
        gender: body.gender.trim(),
        email: body.email.trim(),
        birthDate,
        phone: body.phone.trim(),
        address: body.address.trim(),
        role: body.role?.trim() || existing?.role || "User",
        avatar: nextAvatar,
      },
      create: {
        id: "default",
        name: body.name.trim(),
        gender: body.gender.trim(),
        email: body.email.trim(),
        birthDate,
        phone: body.phone.trim(),
        address: body.address.trim(),
        role: body.role?.trim() || "User",
        avatar: nextAvatar ?? "/images/Ellipse 44.png",
      },
    });

    if (existing?.avatar && nextAvatar && existing.avatar !== nextAvatar) {
      await deleteUploadedAvatar(existing.avatar);
    }

    return jsonOk(mapUserProfile(profile));
  } catch (error) {
    return prismaErrorResponse(error) ?? jsonError("Internal server error", 500);
  }
}
