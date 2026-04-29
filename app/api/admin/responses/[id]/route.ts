import { isAdmin } from "@/lib/auth";
import { db, dbReady } from "@/lib/db";

export async function DELETE(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const numId = Number(id);
  if (!Number.isInteger(numId)) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }
  await dbReady;
  const result = await db.execute({
    sql: "DELETE FROM responses WHERE id = ?",
    args: [numId],
  });
  return Response.json({ ok: true, deleted: Number(result.rowsAffected) });
}
