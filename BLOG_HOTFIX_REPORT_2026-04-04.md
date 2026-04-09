# Blog 500 Hotfix Report

Date: 2026-04-04
Fix type: Blog 500 hotfix
Root cause identified: `apps/web/lib/blog-store.ts` let `resolveStoragePath()` throw on the read path when `blog-posts.json` was not present in the Vercel serverless bundle. The fallback attempted to create a local `data/` directory, which is not safe in the production runtime and caused `/blog` and `/blog/[slug]` to 500.
Fix applied (STEP 2 sub-step used): STEP 2D equivalent runtime guard in `apps/web/lib/blog-store.ts` by moving `resolveStoragePath()` inside the existing `readStoredPosts()` try/catch so blog pages fail soft to static blog content instead of throwing.

Production results:
- [x] `/blog` -> 200
- [x] `/blog/digital-marketing-funnel-for-service-businesses` -> 200
- [x] `/blog/seo-content-plan-for-local-service-brands` -> 200
- [x] `/blog/how-to-score-leads-and-prioritize-sales-followups` -> 200
- [x] `/` -> 200
- [x] `/api/debug` -> 404 (security gate intact)

Security regressions introduced: NONE
Other pages broken: NONE

Signed off: Nishanth Raj S | ZeroOps | 2026-04-04
