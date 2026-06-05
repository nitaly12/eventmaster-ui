import { cookies } from "next/headers";
import { jsonOk } from "@/lib/api-response";
import { getJwtCookieName } from "@/lib/auth-utils";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set(getJwtCookieName(), "", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });

  return jsonOk({ success: true });
}

