import { notFound } from "next/navigation";
import { db, dbReady } from "@/lib/db";
import { POLL_OPTIONS } from "@/lib/options";
import PollPicker from "./PollPicker";

export default async function PollPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  await dbReady;
  const { token } = await params;

  const recipientResult = await db.execute({
    sql: "SELECT * FROM recipients WHERE token = ?",
    args: [token],
  });
  const recipientRow = recipientResult.rows[0];
  if (!recipientRow) notFound();
  const recipientName =
    recipientRow.name === null ? null : String(recipientRow.name);

  const responseResult = await db.execute({
    sql: "SELECT * FROM responses WHERE token = ?",
    args: [token],
  });
  const existingRow = responseResult.rows[0];
  const existing = existingRow
    ? {
        respondentName:
          existingRow.respondent_name === null
            ? null
            : String(existingRow.respondent_name),
        picks: JSON.parse(String(existingRow.picks)) as string[],
      }
    : null;

  return (
    <PollPicker
      token={token}
      recipientName={recipientName}
      options={POLL_OPTIONS}
      existing={existing}
    />
  );
}
