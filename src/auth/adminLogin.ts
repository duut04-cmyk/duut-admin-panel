export type AdminLoginResult = { success: true } | { success: false; error: string };

export async function submitAdminLogin(
  email: string,
  password: string,
): Promise<AdminLoginResult> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = (await response.json().catch(() => ({}))) as {
    success?: boolean;
    error?: string;
  };

  if (!response.ok || !data.success) {
    return {
      success: false,
      error:
        typeof data.error === "string" && data.error.trim()
          ? data.error
          : "Invalid email or password.",
    };
  }

  return { success: true };
}

export async function submitAdminLogout(): Promise<boolean> {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
  });
  const data = (await response.json().catch(() => ({}))) as { success?: boolean };
  return response.ok && data.success === true;
}
