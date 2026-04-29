import { cookies } from "next/headers";

const COOKIE_NAME = "admin";
const ONE_DAY = 60 * 60 * 24;

export function adminPassword() {
  const p = process.env.ADMIN_PASSWORD;
  if (!p) {
    throw new Error(
      "ADMIN_PASSWORD env var is required (set it in .env.local locally and in Vercel project settings).",
    );
  }
  return p;
}

export async function isAdmin() {
  const c = await cookies();
  return c.get(COOKIE_NAME)?.value === adminPassword();
}

export async function setAdminCookie() {
  const c = await cookies();
  c.set(COOKIE_NAME, adminPassword(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: ONE_DAY,
  });
}

export async function clearAdminCookie() {
  const c = await cookies();
  c.delete(COOKIE_NAME);
}
