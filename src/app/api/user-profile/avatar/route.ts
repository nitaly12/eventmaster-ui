import { saveAvatarFile } from "@/lib/save-uploaded-image";
import { jsonError, jsonOk } from "@/lib/api-response";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("avatar");

    if (!(file instanceof File) || file.size === 0) {
      return jsonError("Avatar image is required");
    }

    const avatar = await saveAvatarFile(file);
    return jsonOk({ avatar }, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to upload avatar";
    return jsonError(message, 400);
  }
}
