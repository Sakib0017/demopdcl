# Deployment

The app is host-agnostic: the same `npm run build` output in `dist/` runs on
Cloudflare Pages, Vercel, or S3 + CloudFront. Switching hosts is a DNS change,
not a code change.

Each host needs the same four behaviours, configured in its own dialect. The
config files coexist without conflict — each host ignores the others' files.

| Behaviour | Cloudflare Pages | Vercel | S3 + CloudFront |
|---|---|---|---|
| SPA deep-link fallback | `public/_redirects` | `rewrites` in `vercel.json` | `customErrorResponses` in `cloudfront-config.json` |
| Immutable asset cache | `public/_headers` | `headers` in `vercel.json` | `deploy-s3.sh` + `deployment-config.json` |
| Revalidated HTML | host default | host default | `deploy-s3.sh` (`max-age=300`) |
| `noindex` on non-production hosts | `public/_headers`, matched on `*.pages.dev` | `vercel.json`, matched on `*.vercel.app` | n/a — no free hostname |

Build settings are identical everywhere: build command `npm run build`, output
directory `dist`, Node from `.nvmrc`.

## The two rules that keep this working

**1. `noindex` must be scoped to the host, never applied globally.**

Both Pages and Vercel hand you a free hostname that serves the same content as
production. Left alone, those compete with the real domain as duplicate
content, so both configs suppress them. But the rule has to match on
*hostname*, not path — a blanket `X-Robots-Tag: noindex` on `/(.*)` follows the
site to production and quietly deindexes it. The failure is invisible: the site
looks perfect and simply stops ranking.

**2. Canonical host lives in one place.**

`VITE_SITE_URL` is the single source for canonical tags (`src/main.jsx`),
`og:url` (`src/components/Layout.jsx`), doctor JSON-LD
(`src/components/DoctorDetail.jsx`), and every entry in the generated
`sitemap.xml` (`scripts/generate-sitemap.mjs`). It is currently
`https://www.populardiagnostic.com`.

Changing hosts must not change this value. Whichever platform serves the site,
it serves it on `www.populardiagnostic.com`; anything else redirects there with
a 301 that preserves the path. If `VITE_SITE_URL` ever disagrees with the
hostname actually being served, the site tells Google its real address is
somewhere that may not answer.

## Lockfile

`package-lock.json` only. A second lockfile changes which package manager the
host auto-detects — a stale `yarn.lock` made Cloudflare pick Yarn 4, whose CI
install is immutable, and the build failed before it started. Use `npm`.

## Per-host notes

**Cloudflare Pages** — `_redirects` and `_headers` live in `public/` and Vite
copies them into `dist/` verbatim. The custom domain must be a zone on the same
Cloudflare account as the Pages project; a cross-account CNAME fails with
error 1014 and there is no Pages-side workaround.

**Vercel** — the `/api/(.*)` rewrite is a guard so the catch-all never swallows
serverless functions. There are none today.

**S3 + CloudFront** — `./deploy-s3.sh BUCKET [DISTRIBUTION_ID]`. Note that
`node deploy.js` regenerates `cloudfront-config.json`, so changes to
CloudFront settings belong in `deploy.js`, not in the generated file.

## Checklist when switching hosts

1. Build settings: `npm run build` → `dist`.
2. Confirm deep links resolve — load `/our-doctors` and a doctor profile
   directly, not by clicking through from `/`. This is what catches a missing
   SPA fallback.
3. Confirm the production hostname does **not** send `X-Robots-Tag: noindex`:
   `curl -sI https://www.populardiagnostic.com/ | grep -i x-robots-tag`
   should return nothing.
4. Confirm the non-production hostname **does** send it.
5. Resubmit `sitemap.xml` in Search Console.
