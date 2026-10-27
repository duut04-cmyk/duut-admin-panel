import { test, expect } from "@playwright/test";
import { attachDiagnostics, openNavLink, assertNoAppError } from "./helpers";

test.describe.configure({ mode: "serial" });

test.describe("Admin panel read-only interactive acceptance", () => {
  test("shell navigation and primary pages", async ({ page }, testInfo) => {
    const { consoleErrors, failedRequests } = attachDiagnostics(page);
    await page.goto("/overview");
    await assertNoAppError(page);
    await expect(page.getByText(/what's happening with Doot/i)).toBeVisible({
      timeout: 60_000,
    });

    const navRoutes: { label: string; heading: RegExp }[] = [
      { label: "Customers", heading: /Customers/i },
      { label: "Providers", heading: /Providers/i },
      { label: "Deliveries", heading: /Deliveries/i },
      { label: "Reports", heading: /Reports|Accountability/i },
      { label: "Integrations", heading: /Integrations/i },
      { label: "Settings", heading: /Settings/i },
    ];

    for (const { label, heading } of navRoutes) {
      await openNavLink(page, label);
      await assertNoAppError(page);
      await expect(page.getByRole("heading", { name: heading }).first()).toBeVisible({
        timeout: 60_000,
      });
    }

    await page.goto("/design-system");
    await assertNoAppError(page);
    await openNavLink(page, "Overview");

    if (consoleErrors.length > 0) {
      testInfo.annotations.push({
        type: "console-errors",
        description: consoleErrors.slice(0, 5).join(" | "),
      });
    }
    if (failedRequests.length > 0) {
      testInfo.annotations.push({
        type: "failed-api",
        description: failedRequests
          .slice(0, 8)
          .map((r) => `${r.status} ${r.url}`)
          .join(" | "),
      });
    }

    expect(failedRequests.filter((r) => r.status >= 500)).toEqual([]);
  });

  test("list to detail flows and provider edit cancel", async ({ page }, testInfo) => {
    const { consoleErrors, failedRequests } = attachDiagnostics(page);
    await page.goto("/overview");

    await openNavLink(page, "Customers");
    const customerLink = page.locator('a[href^="/customers/"]').first();
    if ((await customerLink.count()) > 0) {
      await customerLink.click();
      await assertNoAppError(page);
      await expect(page).toHaveURL(/\/customers\/.+/);
    }

    await openNavLink(page, "Providers");
    const providerLink = page.locator('a[href^="/providers/"]').first();
    if ((await providerLink.count()) > 0) {
      await providerLink.click();
      await assertNoAppError(page);
      const editBtn = page.getByRole("button", { name: "Edit" }).first();
      if ((await editBtn.count()) > 0) {
        await editBtn.click();
        await page.getByRole("button", { name: "Cancel" }).first().click();
      }
    }

    await openNavLink(page, "Deliveries");
    const deliveryLink = page.locator('a[href^="/deliveries/"]').first();
    if ((await deliveryLink.count()) > 0) {
      await deliveryLink.click();
      await assertNoAppError(page);
    }

    if (consoleErrors.length > 0) {
      testInfo.annotations.push({
        type: "console-errors",
        description: consoleErrors.slice(0, 5).join(" | "),
      });
    }
    expect(failedRequests.filter((r) => r.status >= 500)).toEqual([]);
  });

  test("overview reporting widgets load", async ({ page }) => {
    attachDiagnostics(page);
    await page.goto("/overview");
    await expect(
      page.getByText(/Recent deliveries|recent deliveries/i).first(),
    ).toBeVisible({
      timeout: 90_000,
    });
    await assertNoAppError(page);
  });
});
