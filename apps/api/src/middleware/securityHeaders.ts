import { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";

const CSP_BASE_DIRECTIVES = [
  "default-src 'none'",
  "script-src 'self' https://cdn.jsdelivr.net https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
  "img-src 'self' https: data:",
  "font-src 'self' https://fonts.gstatic.com",
  "connect-src 'self' https://api.anthropic.com https://api.resend.com https://graph.instagram.com https://cdn.jsdelivr.net",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests"
];

const CSP_PRODUCTION_POLICY = CSP_BASE_DIRECTIVES.join("; ");
const CSP_REPORT_ONLY_POLICY = `${CSP_PRODUCTION_POLICY}; report-uri /api/csp-report`;

export const CSP_POLICY = {
  "report-only": CSP_REPORT_ONLY_POLICY,
  enforced: CSP_PRODUCTION_POLICY
} as const;

type CspMode = keyof typeof CSP_POLICY;

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "geolocation=(), microphone=(), camera=(), payment=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  Server: "ZeroOps API",
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0"
};

function normalizeCspMode(input?: string): CspMode | null {
  const normalized = String(input ?? "").trim().toLowerCase();
  if (normalized === "report-only") return "report-only";
  if (normalized === "enforced") return "enforced";
  return null;
}

export function resolveCspMode(): CspMode {
  const configured = normalizeCspMode(env.cspMode);
  if (configured) return configured;
  return process.env.NODE_ENV === "production" ? "enforced" : "report-only";
}

export function applySecurityHeaders(_req: Request, res: Response, next: NextFunction) {
  const mode = resolveCspMode();
  const headerName = mode === "report-only" ? "Content-Security-Policy-Report-Only" : "Content-Security-Policy";
  const inverseHeaderName = mode === "report-only" ? "Content-Security-Policy" : "Content-Security-Policy-Report-Only";

  res.removeHeader(inverseHeaderName);
  res.setHeader(headerName, CSP_POLICY[mode]);

  Object.entries(SECURITY_HEADERS).forEach(([header, value]) => {
    res.setHeader(header, value);
  });

  next();
}
