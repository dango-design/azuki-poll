import { adminPassword, setAdminCookie } from "@/lib/auth";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { password } = (body as { password?: unknown }) ?? {};
  if (typeof password !== "string" || password !== adminPassword()) {
    return Response.json({ error: "Wrong password" }, { status: 401 });
  }
  await setAdminCookie();
  return Response.json({ ok: true });
}
