/**
 * TEMPORARY UI prototype — mock admin authentication only.
 * Credentials are validated server-side via /api/auth/login using .env vars.
 * Replace with real server-side authentication in production.
 */

export function delay(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export async function mockAdminLogin(
  email: string,
  password: string,
): Promise<boolean> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    return false;
  }

  const data = (await response.json()) as { success?: boolean };
  return data.success === true;
}

export async function mockAdminPasswordReset(ms = 500): Promise<void> {
  await delay(ms);
}
