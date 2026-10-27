import fs from "node:fs";
import path from "node:path";
import { defineConfig, devices } from "@playwright/test";

function loadEnvLocal(): Record<string, string> {
  const envPath = path.join(__dirname, ".env.local");
  const out: Record<string, string> = {};
  if (!fs.existsSync(envPath)) return out;
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
    out[key] = val;
  }
  return out;
}

const localEnv = loadEnvLocal();

const AUTH_FILE = path.join(__dirname, "e2e", ".auth", "admin.json");

export default defineConfig({
  globalSetup: "./e2e/global-setup.ts",
  testDir: "./e2e",
  timeout: 120_000,
  expect: { timeout: 30_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"], ["json", { outputFile: "e2e/results.json" }]],
  use: {
    baseURL: process.env.ADMIN_BASE_URL ?? "http://localhost:3000",
    storageState: AUTH_FILE,
    trace: "off",
    screenshot: "off",
    video: "off",
  },
  projects: [
    {
      name: "chromium-desktop",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "chromium-mobile",
      use: { ...devices["Pixel 5"] },
    },
  ],
  metadata: {
    adminEmailConfigured: Boolean(localEnv.ADMIN_EMAIL),
  },
});
