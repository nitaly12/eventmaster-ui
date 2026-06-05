import { DEFAULT_PROFILE_AVATAR } from "@/lib/default-avatar";

const AUTH_STORAGE_KEY = "eventmaster_auth";

const defaultSession = {
  name: "Thomas Brown",
  email: "ThomasNikola@gmail.com",
  avatar: DEFAULT_PROFILE_AVATAR,
};

export function setAuthSession(session) {
  if (typeof window === "undefined") return;
  const payload = {
    ...defaultSession,
    ...session,
    loggedInAt: Date.now(),
  };
  window.sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
}

export function getAuthSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getDefaultSession() {
  return { ...defaultSession };
}
