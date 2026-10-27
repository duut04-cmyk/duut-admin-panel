/** Forgot-password UI placeholder until backend admin reset is wired. */

export function delay(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export async function mockAdminPasswordReset(ms = 500): Promise<void> {
  await delay(ms);
}
