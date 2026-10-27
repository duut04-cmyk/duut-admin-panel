import { test, expect } from "@playwright/test";
import {
  EMPTY_SEARCH,
  assertNoAppError,
  closeFiltersSheet,
  fillSearchAndWaitForGet,
  openFiltersSheet,
  pickFilterSelectOption,
  tryPaginationWhenAvailable,
  visibleSearchbox,
  waitForCustomersGet,
} from "./helpers";

test.describe.configure({ mode: "serial" });

test.describe("Admin panel read-only list interactions", () => {
  test("empty search shows empty states on list pages", async ({ page }) => {
    await page.goto("/customers");
    await waitForCustomersGet(page);
    await fillSearchAndWaitForGet(
      page,
      "Search customers",
      EMPTY_SEARCH,
      "/api/customers",
      `search=${encodeURIComponent(EMPTY_SEARCH)}`,
    );
    await expect(page.getByText("No customers found")).toBeVisible();
    await assertNoAppError(page);

    await page.goto("/deliveries");
    await page.waitForResponse(
      (res) =>
        res.request().method() === "GET" &&
        res.url().includes("/api/deliveries") &&
        res.ok(),
      { timeout: 45_000 },
    );
    await fillSearchAndWaitForGet(
      page,
      "Search by delivery reference",
      EMPTY_SEARCH,
      "/api/deliveries",
      `reference=${encodeURIComponent(EMPTY_SEARCH)}`,
    );
    await expect(page.getByText("No deliveries found")).toBeVisible();
    await assertNoAppError(page);

    await page.goto("/providers");
    await page.waitForResponse(
      (res) =>
        res.request().method() === "GET" &&
        res.url().includes("/api/providers") &&
        res.ok(),
      { timeout: 45_000 },
    );
    const providerSearch = visibleSearchbox(page, "Search providers");
    await providerSearch.fill(EMPTY_SEARCH);
    await expect(page.getByText("No providers found")).toBeVisible();
    await assertNoAppError(page);
  });

  test("filter controls refetch or narrow list results", async ({ page }) => {
    await page.goto("/customers");
    await waitForCustomersGet(page);

    await openFiltersSheet(page);
    const statusGet = page.waitForResponse(
      (res) =>
        res.request().method() === "GET" &&
        res.url().includes("/api/customers") &&
        res.url().includes("status=ACTIVE") &&
        res.ok(),
      { timeout: 45_000 },
    );
    await pickFilterSelectOption(page, "Status", "Active");
    await statusGet;
    await closeFiltersSheet(page);
    await page
      .getByRole("button", { name: "Clear all" })
      .locator("visible=true")
      .first()
      .click();
    await waitForCustomersGet(page);

    await page.goto("/deliveries");
    await page.waitForResponse(
      (res) =>
        res.request().method() === "GET" &&
        res.url().includes("/api/deliveries") &&
        res.ok(),
      { timeout: 45_000 },
    );
    await openFiltersSheet(page);
    const deliveryStatusGet = page.waitForResponse(
      (res) => {
        if (res.request().method() !== "GET" || !res.url().includes("/api/deliveries"))
          return false;
        return res.url().includes("status=DELIVERED") && res.ok();
      },
      { timeout: 45_000 },
    );
    await pickFilterSelectOption(page, "Delivery status", "Delivered");
    await deliveryStatusGet;
    await closeFiltersSheet(page);
    await page
      .getByRole("button", { name: "Clear all" })
      .locator("visible=true")
      .first()
      .click();

    await page.goto("/providers");
    await page.waitForResponse(
      (res) =>
        res.request().method() === "GET" &&
        res.url().includes("/api/providers") &&
        res.ok(),
      { timeout: 45_000 },
    );
    await openFiltersSheet(page);
    await pickFilterSelectOption(page, "Enabled", "Disabled only");
    await closeFiltersSheet(page);
    await expect(
      page.getByRole("button", { name: "Clear all" }).locator("visible=true").first(),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Clear all" })
      .locator("visible=true")
      .first()
      .click();

    await assertNoAppError(page);
  });

  test("pagination when shared dev data has multiple pages", async ({
    page,
  }, testInfo) => {
    await page.goto("/customers");
    await waitForCustomersGet(page);
    await tryPaginationWhenAvailable(page, testInfo, {
      navAriaLabel: "Customer list pagination",
      apiPath: "/api/customers",
      scope: "Customers",
    });

    await page.goto("/deliveries");
    await page.waitForResponse(
      (res) =>
        res.request().method() === "GET" &&
        res.url().includes("/api/deliveries") &&
        res.ok(),
      { timeout: 45_000 },
    );
    await tryPaginationWhenAvailable(page, testInfo, {
      navAriaLabel: "Delivery list pagination",
      apiPath: "/api/deliveries",
      scope: "Deliveries",
    });

    testInfo.annotations.push({
      type: "not-verified",
      description: "Providers: no server pagination UI (client-side list only)",
    });
    await assertNoAppError(page);
  });

  test("customers list retries after simulated read-only GET failure", async ({
    page,
  }) => {
    let listGetAttempts = 0;
    let allowCustomerListGets = false;

    const matchCustomerListUrl = (url: URL) => url.pathname === "/api/customers";

    const isCustomerListGet = (url: string, method: string) => {
      if (method !== "GET") return false;
      try {
        return new URL(url).pathname === "/api/customers";
      } catch {
        return false;
      }
    };

    const handler = async (route: import("@playwright/test").Route) => {
      const request = route.request();
      if (request.method() !== "GET") {
        await route.continue();
        return;
      }

      listGetAttempts += 1;
      if (!allowCustomerListGets) {
        await route.fulfill({
          status: 503,
          contentType: "application/json",
          body: JSON.stringify({ success: false, error: "E2E simulated list failure" }),
        });
        return;
      }
      await route.continue();
    };

    await page.route(matchCustomerListUrl, handler);
    try {
      await page.goto("/customers");
      await expect(page.getByText("Unable to load customers")).toBeVisible({
        timeout: 45_000,
      });
      expect(listGetAttempts).toBeGreaterThanOrEqual(1);

      allowCustomerListGets = true;
      const retryResponse = page.waitForResponse(
        (res) => isCustomerListGet(res.url(), res.request().method()) && res.ok(),
        { timeout: 45_000 },
      );
      await page.getByRole("button", { name: "Retry" }).click();
      await retryResponse;
      expect(listGetAttempts).toBeGreaterThanOrEqual(2);

      await expect(page.getByText("Unable to load customers")).toHaveCount(0);
      await expect(
        page.getByRole("heading", { name: "Customers" }).first(),
      ).toBeVisible({ timeout: 45_000 });
      await assertNoAppError(page);
    } finally {
      await page.unroute(matchCustomerListUrl, handler);
    }
  });
});
