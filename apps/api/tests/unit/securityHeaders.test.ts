import request from "supertest";
import { describe, expect, test } from "vitest";

async function getApp() {
  process.env.MONGODB_URI ??= "mongodb://127.0.0.1:27017/zero_test";
  process.env.JWT_SECRET ??= "test-secret";
  process.env.CSP_MODE ??= "report-only";
  const { app } = await import("../../src/app.js");
  return app;
}

describe("Security headers", () => {
  test("responds with CSP and hardening headers", async () => {
    const app = await getApp();
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.headers["content-security-policy-report-only"]).toContain("default-src 'none'");
    expect(response.headers["x-content-type-options"]).toBe("nosniff");
    expect(response.headers["x-frame-options"]).toBe("DENY");
    expect(response.headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(response.headers["permissions-policy"]).toContain("geolocation=()");
  }, 15000);

  test("accepts CSP report payloads", async () => {
    const app = await getApp();
    const payload = JSON.stringify({
      "csp-report": {
        "document-uri": "https://www.zeroops.in/book",
        "violated-directive": "script-src-elem",
        "blocked-uri": "https://evil.example"
      }
    });
    const response = await request(app)
      .post("/api/csp-report")
      .set("Content-Type", "application/csp-report")
      .send(payload);

    expect(response.status).toBe(204);
  }, 15000);
});
