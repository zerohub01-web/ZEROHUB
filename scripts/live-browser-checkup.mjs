import { chromium, devices } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

const BASE_URL = process.env.CHECKUP_BASE_URL ?? "https://zeroops.in";
const ROUTES = [
  "/",
  "/book",
  "/book-call",
  "/services",
  "/services/marketing",
  "/pricing",
  "/maintenance",
  "/works",
  "/testimonials",
  "/privacy",
  "/login"
];

function slugifyRoute(route) {
  if (route === "/") return "home";
  return route.replace(/^\/+/, "").replace(/[\/\\?&#=]+/g, "-");
}

function nowStamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function checkHeaders(url) {
  const response = await fetch(url, { method: "HEAD" });
  return {
    status: response.status,
    strictTransportSecurity: response.headers.get("strict-transport-security"),
    xFrameOptions: response.headers.get("x-frame-options"),
    xContentTypeOptions: response.headers.get("x-content-type-options"),
    contentSecurityPolicy: response.headers.get("content-security-policy")
  };
}

async function checkHttpRedirect(domain) {
  const response = await fetch(`http://${domain}`, {
    method: "HEAD",
    redirect: "manual"
  });
  return {
    status: response.status,
    location: response.headers.get("location")
  };
}

async function checkCors(apiUrl, origin) {
  const response = await fetch(apiUrl, {
    method: "OPTIONS",
    headers: {
      Origin: origin,
      "Access-Control-Request-Method": "GET",
      "Access-Control-Request-Headers": "authorization,content-type"
    }
  });

  return {
    status: response.status,
    allowOrigin: response.headers.get("access-control-allow-origin"),
    allowCredentials: response.headers.get("access-control-allow-credentials"),
    allowMethods: response.headers.get("access-control-allow-methods")
  };
}

async function collectInternalLinks(page) {
  const links = await page.$$eval("a[href]", (nodes) =>
    nodes
      .map((a) => a.getAttribute("href") || "")
      .filter(Boolean)
  );

  const normalized = Array.from(
    new Set(
      links
        .filter((href) => href.startsWith("/"))
        .filter((href) => !href.startsWith("//"))
        .filter((href) => !href.startsWith("/#"))
        .map((href) => href.split("#")[0])
    )
  );

  return normalized.slice(0, 60);
}

async function checkLinks(baseUrl, links) {
  const results = [];

  for (const link of links) {
    const fullUrl = new URL(link, baseUrl).toString();
    try {
      const response = await fetch(fullUrl, {
        method: "HEAD",
        redirect: "manual"
      });
      results.push({
        link,
        status: response.status
      });
    } catch (error) {
      results.push({
        link,
        status: 0,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  return results;
}

async function auditViewport(browser, outDir, viewportName, contextOptions) {
  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();
  const routeResults = [];
  const consoleErrors = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push({
        type: msg.type(),
        text: msg.text(),
        location: msg.location()
      });
    }
  });

  page.on("pageerror", (error) => {
    consoleErrors.push({
      type: "pageerror",
      text: error.message
    });
  });

  for (const route of ROUTES) {
    const url = new URL(route, BASE_URL).toString();
    const startedAt = Date.now();
    let status = 0;
    let title = "";
    let screenshot = "";
    let errorMessage = "";

    try {
      const response = await page.goto(url, {
        waitUntil: "networkidle",
        timeout: 60_000
      });

      status = response?.status() ?? 0;
      title = await page.title();
      screenshot = path.join("screenshots", `${viewportName}-${slugifyRoute(route)}.png`);
      await page.screenshot({
        path: path.join(outDir, screenshot),
        fullPage: true
      });
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : String(error);
    }

    routeResults.push({
      route,
      url,
      status,
      title,
      durationMs: Date.now() - startedAt,
      screenshot,
      error: errorMessage || undefined
    });
  }

  const homepageUrl = new URL("/", BASE_URL).toString();
  await page.goto(homepageUrl, { waitUntil: "networkidle", timeout: 60_000 });
  const internalLinks = await collectInternalLinks(page);
  const linkChecks = await checkLinks(BASE_URL, internalLinks);

  await context.close();
  return { viewportName, routeResults, consoleErrors, linkChecks };
}

function renderMarkdown(report) {
  const lines = [];
  lines.push("# ZERO Live Browser Checkup Report");
  lines.push(`Date: ${new Date().toISOString()}`);
  lines.push(`Base URL: ${report.baseUrl}`);
  lines.push("");
  lines.push("## Summary");
  lines.push(`- Routes tested: ${report.summary.routesTested}`);
  lines.push(`- Route pass count: ${report.summary.routePass}`);
  lines.push(`- Route fail count: ${report.summary.routeFail}`);
  lines.push(`- Console error count: ${report.summary.consoleErrors}`);
  lines.push(`- Internal link checks: ${report.summary.linkChecks}`);
  lines.push(`- Broken/internal failing links: ${report.summary.linkFailures}`);
  lines.push("");
  lines.push("## Security Headers");
  lines.push("```json");
  lines.push(JSON.stringify(report.security, null, 2));
  lines.push("```");
  lines.push("");
  lines.push("## Route Status Matrix");
  lines.push("| Viewport | Route | Status | Duration (ms) |");
  lines.push("|---|---|---:|---:|");

  for (const viewport of report.viewports) {
    for (const route of viewport.routeResults) {
      lines.push(`| ${viewport.viewportName} | ${route.route} | ${route.status || "ERR"} | ${route.durationMs} |`);
    }
  }

  lines.push("");
  lines.push("## Notes");
  if (report.summary.routeFail === 0) {
    lines.push("- All tested routes returned 2xx/3xx.");
  } else {
    lines.push("- Some routes failed. Review JSON details and screenshots.");
  }
  if (report.summary.consoleErrors > 0) {
    lines.push("- Browser console errors were detected; inspect JSON for details.");
  } else {
    lines.push("- No browser console errors captured during this run.");
  }

  return lines.join("\n");
}

async function main() {
  const runId = nowStamp();
  const outDir = path.join(process.cwd(), "test-results", `live-browser-checkup-${runId}`);
  const screenshotDir = path.join(outDir, "screenshots");
  await ensureDir(screenshotDir);

  const browser = await chromium.launch({ headless: true });

  const viewportConfigs = [
    {
      name: "desktop",
      options: {
        viewport: { width: 1440, height: 900 },
        userAgent: devices["Desktop Chrome"].userAgent
      }
    },
    {
      name: "tablet",
      options: {
        ...devices["iPad Pro 11"]
      }
    },
    {
      name: "mobile",
      options: {
        ...devices["iPhone 12"]
      }
    }
  ];

  const viewports = [];
  for (const config of viewportConfigs) {
    const result = await auditViewport(browser, outDir, config.name, config.options);
    viewports.push(result);
  }

  await browser.close();

  const allRoutes = viewports.flatMap((v) => v.routeResults);
  const allConsoleErrors = viewports.flatMap((v) => v.consoleErrors);
  const allLinkChecks = viewports.flatMap((v) => v.linkChecks);
  const linkFailures = allLinkChecks.filter((c) => c.status >= 400 || c.status === 0);

  const security = {
    zeroopsInHeaders: await checkHeaders("https://zeroops.in"),
    wwwZeroopsInHeaders: await checkHeaders("https://www.zeroops.in"),
    httpRedirects: {
      zeroopsIn: await checkHttpRedirect("zeroops.in"),
      wwwZeroopsIn: await checkHttpRedirect("www.zeroops.in")
    },
    cors: {
      allowedOrigin: await checkCors("https://zero-api-m0an.onrender.com/api/contracts", "https://zeroops.in"),
      disallowedOrigin: await checkCors("https://zero-api-m0an.onrender.com/api/contracts", "https://malicious.example")
    }
  };

  const report = {
    runId,
    baseUrl: BASE_URL,
    generatedAt: new Date().toISOString(),
    summary: {
      routesTested: allRoutes.length,
      routePass: allRoutes.filter((r) => r.status >= 200 && r.status < 400).length,
      routeFail: allRoutes.filter((r) => !(r.status >= 200 && r.status < 400)).length,
      consoleErrors: allConsoleErrors.length,
      linkChecks: allLinkChecks.length,
      linkFailures: linkFailures.length
    },
    security,
    viewports
  };

  await fs.writeFile(path.join(outDir, "report.json"), JSON.stringify(report, null, 2), "utf8");
  await fs.writeFile(path.join(outDir, "report.md"), renderMarkdown(report), "utf8");

  process.stdout.write(`${outDir}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
