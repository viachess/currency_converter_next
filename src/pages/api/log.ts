import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const payload = req.body;
  // In a real app, forward to a logging backend here.
  // For now, log to server console in a readable line.
  const ts = payload?.timestamp ?? new Date().toISOString();
  const level = String(payload?.level ?? "info").toUpperCase();
  const message = payload?.message ?? "";
  // eslint-disable-next-line no-console
  console.log(`[${ts}] ${level}: ${message}`, payload);

  res.status(204).end();
}
