import { cookies } from "next/headers";

const COOKIE_NAME = "admin";
const ONE_DAY = 60 * 60 * 24;

export function adminPassword() {
  return process.env.ADMIN_PASSWORD ?? "azuki";
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
