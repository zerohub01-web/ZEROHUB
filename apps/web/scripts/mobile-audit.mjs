import { chromium, devices } from "@playwright/test";

const baseUrl = process.env.WEB_URL || "http://127.0.0.1:3000";
const routes = [
  "/",
  "/admin",
  "/blog",
  "/book",
  "/book-call",
  "/client-dashboard",
  "/client-login",
  "/services",
  "/services/marketing",
  "/pricing",
  "/process",
  "/privacy",
  "/technology",
  "/testimonials",
  "/works",
  "/features",
  "/features/snake",
  "/login",
  "/portal",
  "/signup",
  "/maintenance",
  "/zero-control",
  "/zero-control/analytics",
  "/zero-control/blog",
  "/zero-control/calls",
  "/zero-control/clients",
  "/zero-control/contracts",
  "/zero-control/followups",
  "/zero-control/invoices",
  "/zero-control/proposals",
  "/zero-control/reviews",
  "/zero-control/settings",
  "/zero-control/whatsapp",
  "/zero-control/works",
  "/portal/contract/demo",
  "/portal/invoice/demo",
  "/zero-control/contracts/demo/view",
  "/zero-control/invoices/demo/view"
];

const profiles = [
  { name: "iPhone 14 Pro", device: devices["iPhone 14 Pro"] },
  { name: "Pixel 7", device: devices["Pixel 7"] }
];

async function auditRoute(page, route) {
  const url = new URL(route, baseUrl).toString();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(450);

  const result = await page.evaluate(() => {
    const viewportWidth = window.innerWidth;
    const docWidth = document.documentElement.scrollWidth;
    const bodyWidth = document.body.scrollWidth;
    const hasHorizontalOverflow = docWidth > viewportWidth + 1 || bodyWidth > viewportWidth + 1;
    const cls = performance
      .getEntriesByType("layout-shift")
      .filter((entry) => !(entry.hadRecentInput))
      .reduce((sum, entry) => sum + entry.value, 0);

    const nodes = Array.from(
      document.querySelectorAll("a[href], button, input:not([type='hidden']), select, textarea, [role='button']")
    );

    const badTargets = [];
    for (const node of nodes) {
      const style = window.getComputedStyle(node);
      if (style.display === "none" || style.visibility === "hidden") continue;
      if (node.closest("[aria-hidden='true']")) continue;
      const rect = node.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) continue;

      if (rect.width < 44 || rect.height < 44) {
        const label =
          node.getAttribute("aria-label") ||
          node.getAttribute("title") ||
          node.textContent?.trim() ||
          node.getAttribute("name") ||
          node.tagName.toLowerCase();
        badTargets.push({
          label: label?.slice(0, 80) || node.tagName.toLowerCase(),
          tag: node.tagName.toLowerCase(),
          className: (node.getAttribute("class") || "").slice(0, 120),
          href: node instanceof HTMLAnchorElement ? node.getAttribute("href") : undefined,
          width: Number(rect.width.toFixed(1)),
          height: Number(rect.height.toFixed(1))
        });
      }

      if (badTargets.length >= 30) break;
    }

    return {
      viewportWidth,
      docWidth,
      bodyWidth,
      hasHorizontalOverflow,
      cls: Number(cls.toFixed(4)),
      badTargets
    };
  });

  return { route, ...result };
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const output = [];
  let totalOverflowRoutes = 0;
  let totalBadTargetRoutes = 0;
  let totalHighClsRoutes = 0;

  try {
    for (const profile of profiles) {
      const context = await browser.newContext({
        ...profile.device
      });
      const page = await context.newPage();
      const profileResults = [];

      for (const route of routes) {
        try {
          const routeResult = await auditRoute(page, route);
          profileResults.push(routeResult);
        } catch (error) {
          profileResults.push({
            route,
            error: error instanceof Error ? error.message : String(error)
          });
        }
      }

      await context.close();
      totalOverflowRoutes += profileResults.filter((routeResult) => routeResult.hasHorizontalOverflow).length;
      totalBadTargetRoutes += profileResults.filter(
        (routeResult) => Array.isArray(routeResult.badTargets) && routeResult.badTargets.length > 0
      ).length;
      totalHighClsRoutes += profileResults.filter(
        (routeResult) => typeof routeResult.cls === "number" && routeResult.cls > 0.1
      ).length;
      output.push({
        device: profile.name,
        results: profileResults
      });
    }
  } finally {
    await browser.close();
  }

  const summary = {
    baseUrl,
    routeCount: routes.length,
    devices: profiles.map((profile) => profile.name),
    totalOverflowRoutes,
    totalBadTargetRoutes,
    totalHighClsRoutes
  };

  console.log(
    JSON.stringify(
      {
        summary,
        devices: output
      },
      null,
      2
    )
  );

  if (totalOverflowRoutes > 0 || totalBadTargetRoutes > 0 || totalHighClsRoutes > 0) {
    process.exitCode = 1;
  }
}

await run();
