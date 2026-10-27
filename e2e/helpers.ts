import { expect, type Page, type Response, type TestInfo } from "@playwright/test";

/** Harmless search token unlikely to match production-like dev data. */
export const EMPTY_SEARCH = "e2e-no-match-7f3a9c2e";

export type NetworkIssue = { url: string; status: number };

export function attachDiagnostics(page: Page) {
  const consoleErrors: string[] = [];
  const failedRequests: NetworkIssue[] = [];

  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    const text = msg.text();
    if (text.includes("Download the React DevTools")) return;
    if (text.includes("Fast Refresh")) return;
    consoleErrors.push(text.slice(0, 300));
  });

  page.on("response", (response: Response) => {
    const url = response.url();
    if (!url.includes("/api/")) return;
    const status = response.status();
    if (status >= 400) {
      failedRequests.push({ url: url.replace(/\/\/[^/]+/, "//[host]"), status });
    }
  });

  return { consoleErrors, failedRequests };
}

export const NAV_HREF: Record<string, string> = {
  Overview: "/overview",
  Customers: "/customers",
  Providers: "/providers",
  Deliveries: "/deliveries",
  Reports: "/reports",
  Integrations: "/integrations",
  Settings: "/settings",
};

export async function openNavLink(page: Page, label: string) {
  const viewport = page.viewportSize();
  const narrow = viewport != null && viewport.width < 1280;
  const href = NAV_HREF[label];

  if (narrow) {
    const menuButton = page.getByRole("button", { name: "Open navigation menu" });
    if (await menuButton.isVisible()) {
      await menuButton.click();
      const drawer = page.getByRole("dialog", { name: "Navigation menu" });
      await drawer.getByRole("link", { name: label, exact: true }).click();
      return;
    }
  } else {
    const nav = page.getByRole("navigation", { name: "Admin navigation" });
    if (await nav.isVisible()) {
      await nav.getByRole("link", { name: label, exact: true }).click();
      return;
    }
  }

  if (href) {
    await page.goto(href);
    return;
  }
  await page.getByRole("link", { name: label, exact: true }).click();
}

export async function assertNoAppError(page: Page) {
  await expect(page.getByText("Application error")).toHaveCount(0);
  await expect(page.getByText("Hydration failed")).toHaveCount(0);
}

export function waitForCustomersGet(page: Page, urlMatch?: (url: string) => boolean) {
  return page.waitForResponse(
    (res) => {
      if (res.request().method() !== "GET") return false;
      const url = res.url();
      if (!url.includes("/api/customers") || url.includes("/api/customers/"))
        return false;
      if (urlMatch && !urlMatch(url)) return false;
      return res.ok();
    },
    { timeout: 45_000 },
  );
}

export function visibleSearchbox(page: Page, name: string) {
  return page.getByRole("searchbox", { name }).locator("visible=true").first();
}

export async function fillSearchAndWaitForGet(
  page: Page,
  ariaLabel: string,
  value: string,
  apiPath: string,
  queryFragment: string,
) {
  const search = visibleSearchbox(page, ariaLabel);
  await expect(search).toBeVisible();
  const responsePromise = page.waitForResponse(
    (res) =>
      res.request().method() === "GET" &&
      res.url().includes(apiPath) &&
      res.url().includes(queryFragment),
    { timeout: 45_000 },
  );
  await search.fill(value);
  return responsePromise;
}

export async function openFiltersSheet(page: Page) {
  await page
    .getByRole("button", { name: /^Filters/ })
    .locator("visible=true")
    .first()
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
}

export async function pickFilterSelectOption(
  page: Page,
  fieldLabel: string,
  optionLabel: string,
) {
  const dialog = page.getByRole("dialog");
  const combobox = dialog
    .getByText(fieldLabel, { exact: true })
    .locator("xpath=..")
    .getByRole("button", { expanded: false });
  await combobox.click();
  await dialog.getByRole("option", { name: optionLabel, exact: true }).click();
}

export async function closeFiltersSheet(page: Page) {
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Done" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
}

export async function tryPaginationWhenAvailable(
  page: Page,
  testInfo: TestInfo,
  options: { navAriaLabel: string; apiPath: string; scope: string },
) {
  const nav = page.getByRole("navigation", { name: options.navAriaLabel });
  if ((await nav.count()) === 0) {
    testInfo.annotations.push({
      type: "not-verified",
      description: `${options.scope}: pagination UI hidden (totalPages ≤ 1 in shared dev data)`,
    });
    return;
  }

  const responsePromise = page.waitForResponse(
    (res) =>
      res.request().method() === "GET" &&
      res.url().includes(options.apiPath) &&
      /[?&]page=2(?:&|$)/.test(res.url()) &&
      res.ok(),
    { timeout: 45_000 },
  );
  await nav.getByRole("button", { name: "Next" }).click();
  await responsePromise;
  await expect(nav.getByText(/Page 2 of \d+/)).toBeVisible();
  testInfo.annotations.push({
    type: "verified",
    description: `${options.scope}: advanced to page 2 via Next`,
  });
}
