import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_COOKIE_NAME = "auth_token";
const JWT_EXPIRES_IN = "7d";

function getJwtSecret() {
  if (process.env.AUTH_JWT_SECRET) return process.env.AUTH_JWT_SECRET;
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_JWT_SECRET is required in production.");
  }
  return "dev-auth-secret-change-me";
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signAuthToken(payload: { sub: string; role: string }) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: JWT_EXPIRES_IN });
}

export function verifyAuthToken(token: string): { sub: string; role: string } {
  const decoded = jwt.verify(token, getJwtSecret()) as { sub: string; role: string };
  return { sub: decoded.sub, role: decoded.role };
}

export function getJwtCookieName() {
  return JWT_COOKIE_NAME;
}

