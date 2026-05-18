import { Router } from "express";

export const securityRouter = Router();

securityRouter.post("/csp-report", (req, res) => {
  const body = req.body as unknown;
  const normalizedBody =
    Array.isArray(body) && body.length > 0 && typeof body[0] === "object" && body[0] !== null
      ? (body[0] as Record<string, unknown>)
      : ((body ?? {}) as Record<string, unknown>);
  const report =
    (normalizedBody["csp-report"] as Record<string, unknown> | undefined) ??
    (normalizedBody["body"] as Record<string, unknown> | undefined);

  if (report && typeof report === "object") {
    console.warn("[Security][CSP Violation]", {
      documentURI: report["document-uri"] ?? null,
      violatedDirective: report["violated-directive"] ?? null,
      blockedURI: report["blocked-uri"] ?? null,
      sourceFile: report["source-file"] ?? null,
      lineNumber: report["line-number"] ?? null,
      originalPolicy: report["original-policy"] ?? null
    });
  } else {
    console.warn("[Security][CSP Violation] Invalid report payload received.", {
      contentType: req.get("content-type") ?? null
    });
  }

  return res.status(204).send();
});
