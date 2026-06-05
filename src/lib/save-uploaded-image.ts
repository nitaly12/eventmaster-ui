import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "avatars");
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function extensionForType(type: string) {
  if (type === "image/jpeg") return "jpg";
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  return "gif";
}

export async function saveAvatarFile(file: File) {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Only JPG, PNG, WebP, or GIF images are allowed");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Image must be 5MB or smaller");
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const filename = `avatar-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extensionForType(file.type)}`;
  const filePath = path.join(UPLOAD_DIR, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  return `/uploads/avatars/${filename}`;
}

export async function deleteUploadedAvatar(avatarUrl: string | null | undefined) {
  if (!avatarUrl?.startsWith("/uploads/avatars/")) return;

  const filePath = path.join(process.cwd(), "public", avatarUrl);
  try {
    await unlink(filePath);
  } catch {
    // File may already be removed.
  }
}
