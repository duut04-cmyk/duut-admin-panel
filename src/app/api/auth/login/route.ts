/**
 * TEMPORARY UI prototype — validates credentials against server env vars.
 * Replace with real server-side authentication in production.
 */

import { NextResponse } from "next/server";

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    password?: string;
  };

  const email = String(body.email ?? "").trim();
  const password = String(body.password ?? "");

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return NextResponse.json(
      { success: false, error: "Admin credentials are not configured." },
      { status: 500 },
    );
  }

  await delay(500);

  const success =
    email.toLowerCase() === adminEmail.toLowerCase() &&
    password === adminPassword;

  return NextResponse.json({ success });
}
