import fs from "node:fs";
import path from "node:path";
import { chromium, type FullConfig } from "@playwright/test";

const AUTH_FILE = path.join(__dirname, ".auth", "admin.json");

function loadEnvLocal(): { ADMIN_EMAIL: string; ADMIN_PASSWORD: string } {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) {
    throw new Error(".env.local missing for E2E.");
  }
  const raw: Record<string, string> = {};
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    raw[key] = val;
  }
  if (!raw.ADMIN_EMAIL?.trim() || !raw.ADMIN_PASSWORD) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD required in .env.local.");
  }
  return { ADMIN_EMAIL: raw.ADMIN_EMAIL.trim(), ADMIN_PASSWORD: raw.ADMIN_PASSWORD };
}

async function performLogin(
  baseURL: string,
  env: { ADMIN_EMAIL: string; ADMIN_PASSWORD: string },
) {
  const browser = await chromium.launch();
  const context = await browser.newContext({ baseURL });
  const page = await context.newPage();
  await page.goto("/login");
  await page.getByLabel("Email address").fill(env.ADMIN_EMAIL);
  await page.locator('input[name="password"]').fill(env.ADMIN_PASSWORD);
  const signIn = page.getByRole("button", { name: "Sign in" });

  for (let attempt = 0; attempt < 8; attempt++) {
    const loginResponse = page.waitForResponse((response) =>
      response.url().includes("/api/auth/login"),
    );
    await signIn.click();
    const response = await loginResponse;
    if (response.status() === 429) {
      await page.waitForTimeout(10_000 * (attempt + 1));
      continue;
    }
    if (response.status() !== 200) {
      await browser.close();
      throw new Error(`Login failed with status ${response.status()}.`);
    }
    await page.waitForURL(/\/overview/, { timeout: 60_000 });
    fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });
    await context.storageState({ path: AUTH_FILE });
    await browser.close();
    return;
  }
  await browser.close();
  throw new Error("Login rate-limited (429) after retries.");
}

export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0]?.use?.baseURL ?? "http://localhost:3000";
  const env = loadEnvLocal();
  if (fs.existsSync(AUTH_FILE)) {
    const ageMs = Date.now() - fs.statSync(AUTH_FILE).mtimeMs;
    if (ageMs < 30 * 60 * 1000) {
      return;
    }
  }
  await performLogin(String(baseURL), env);
}

export { AUTH_FILE };
