# SEO-Friendly Doctor Profile URLs

**Date:** 2026-07-25
**Status:** Approved design, ready for implementation planning
**Scope:** Doctor profile pages in `UpdatedFrontend`

## Problem

Doctor profiles are served at `/doctordetail/2094`. The URL carries no keywords, and
the page carries no metadata: all 3,386 doctor pages share the single `<title>`
"Popular Diagnostic Centre Ltd." defined in `index.html`. There is no meta
description, canonical URL, Open Graph tag, structured data, `sitemap.xml`, or
`robots.txt` anywhere in the app.

A readable URL alone would not fix this. The URL, the per-page metadata, and the
crawl surface are one problem and are addressed together.

## Constraints

- Client-side React 18 SPA (Vite), no SSR or prerendering. Static files on S3 +
  CloudFront.
- The backend and database are not modifiable. All metadata is derived at runtime
  from existing API responses.
- JavaScript only. ESLint must pass at 0 warnings.
- No third-party test framework is installed. Node's built-in `node:test` runner is
  used instead — see Verification.

## API Facts

The two doctor endpoints return different shapes. Any code reading doctor data must
handle both.

| Field | `/api/doctors` (list) | `/api/doctor/:id` (detail) |
|---|---|---|
| `id` | present | **absent** |
| specialty | `specialists[].specialist.name` | `specialists[].specialist_name` |
| branch | `branches[].branch.name` | `branches[].name` (uppercase, e.g. `"DHANMONDI"`) |
| phone | — | `branches[].phone` (public), `mobile` (personal) |

The detail endpoint omitting `id` means the URL is the only place the ID exists on
the profile page. The ID must therefore be part of the URL.

### Dataset validation (all 3,386 doctors, 68 API pages)

| Property | Value |
|---|---|
| Total doctors | 3,386 |
| Doctors with no specialty | 0 |
| Distinct specialties | 73 |
| Specialty-slug collisions | 0 |
| **Name-slug collisions** | **252** |
| Name+specialty path collisions | 206 |
| Non-ASCII characters in names | 0 |
| Name segments over 60 chars | 1 (61 chars) |

The 252 figure counts distinct name slugs shared by two or more doctors — the number
of affected doctors is higher. Four different doctors are named "Prof. Dr. Md.
Rafiqul Islam"; four more are "Prof. Dr. Md. Mukhlesur Rahman". A slug-only URL
scheme would silently collapse them into each other. This is why the ID is retained.

Names contain only `.`, `(`, `)`, `-`, `:`, and `/` as punctuation. At least one
name embeds a scheduling note: `"Assistant Prof. Dr. Md.  Minhaj Uddin Bhuiyan
(Friday Morning)"` (note the double space).

## URL Scheme

```
/doctors/{specialty}/{name}/{id}
/doctors/cardiology/prof-dr-m-nazrul-islam/2094
```

Longest generated path is 107 characters. All 3,386 paths are unique.

### Slug rules

Applied per segment, in order:

1. Normalize the doctor object to handle both list and detail shapes.
2. Strip parenthetical content from the name — `(Friday Morning)` is scheduling
   noise, not identity.
3. Lowercase; replace each run of non-alphanumeric characters with a single `-`;
   collapse repeats; trim leading and trailing `-`.
4. Truncate the name segment at 70 characters on a word boundary.
5. Specialty segment uses `specialists[0]` only. Fall back to `general-practice`
   when absent (defensive — no current record triggers it).

The `/` in specialty names such as `Eye / Ophthalmology` must slugify to `-`
(`eye-ophthalmology`), never survive as a path separator. This is asserted by the
verification script.

### Routing (`src/main.jsx`)

```js
{ path: "/doctors/:specialty/:name/:id", element: <DoctorDetail /> },  // canonical
{ path: "/doctordetail/:doctorId",       element: <DoctorDetail /> },  // legacy
{ path: "/doctors/:specialty",           element: <SpecialtyRedirect /> },
{ path: "/doctors",                      element: <SpecialtyRedirect /> },
```

The ID is read directly from `params.id`. No parsing.

### Canonical self-correction

`DoctorDetail` serves both the canonical and legacy routes and reconciles the URL
after data loads:

1. Read the ID from `params.id` (canonical) or `params.doctorId` (legacy).
2. Fetch the doctor by ID.
3. Compute `canonical = buildDoctorPath(doctor)`.
4. If `location.pathname !== canonical`, call `navigate(canonical, { replace: true })`.

This handles three cases with one code path:

- Legacy `/doctordetail/2094` redirects to the canonical URL.
- A stale slug (doctor renamed, or a hand-edited URL) corrects itself.
- Without step 4, `/doctors/anything/anything/2094` would serve identical content at
  unlimited URLs — a duplicate-content problem that pretty URLs actively invite.

`replace: true` keeps the browser Back button working.

The redirect lives in a `useEffect` keyed on `[doctor, location.pathname]`,
comparing exact strings, firing at most once per load. This guards against a
redirect loop if `buildDoctorPath` were ever non-deterministic.

### Legacy URL handling

Phase 1 (this work): the client-side redirect above. Old links keep working and
Google eventually consolidates the signals.

Phase 2 (follow-up, not in this scope): a CloudFront Function returning a true
`301`, once the new URLs are proven stable. A JS redirect is a soft redirect and
passes link equity more weakly than a real 301.

### Specialty folder redirect

`/doctors/cardiology` redirects to `/our-doctors?specialty=cardiology`, and
`/doctors` to `/our-doctors`. Without this, 73 discoverable intermediate URLs return
soft 404s.

`DoctorSearch.jsx` does not currently read URL search params — `selectedSpecializations`
is local `useState` (line 29) — and the API filters by specialty **ID**
(`specialities=167`), not name. Making the filter apply requires:

1. Adding `useSearchParams` to `DoctorSearch`.
2. Building a slug→ID map by slugifying the names from `/api/doctor-speciality`,
   which the component already fetches (line 52).
3. Pre-selecting the react-select value on mount when the param is present.

Approximately 30 lines in `DoctorSearch.jsx`. Without this wiring the param is
silently ignored and the page renders unfiltered.

## Metadata Layer

`react-helmet-async` is added as a dependency (explicitly approved; it is the one
exception to the no-new-dependencies rule for this work). `<HelmetProvider>` wraps
`<RouterProvider>` in `src/main.jsx`.

`src/utils/doctorSeo.js` exposes pure functions with no React dependency:

```
doctorTitle(doctor)          → string
doctorDescription(doctor)    → string
doctorJsonLd(doctor, url)    → object
breadcrumbJsonLd(doctor, url)→ object
```

### Title

```
{name} - {specialty} Specialist, {branch} | Popular Diagnostic Centre
```

> Prof. Dr. M. Nazrul Islam - Cardiology Specialist, Dhanmondi | Popular Diagnostic Centre

This exceeds Google's ~60-character display limit deliberately. Keywords are
front-loaded; the truncated tail is the brand suffix, the least valuable part.
Branch names arrive uppercase from the detail endpoint and are title-cased.

### Description

```
{name}, {degrees} - {specialty} specialist at Popular Diagnostic Centre, {branch}.
View chamber schedule and book an appointment online.
```

> Prof. Dr. M. Nazrul Islam, MBBS, FCPS, FRCP (London) - Cardiology specialist at
> Popular Diagnostic Centre, Dhanmondi. View chamber schedule and book an
> appointment online. (153 chars)

Built against a character budget: assemble the fixed parts first, then fill the
remaining space with as many degree credentials as fit, cutting on a comma
boundary. Required because `degree` values run long — Dr. A. A. Shafi Majumder's is
190 characters of run-on text.

Target range is 70–160 characters.

### Open Graph and Twitter

`og:title`, `og:description`, `og:image` (doctor photo), `og:url`, `og:type=profile`,
`og:site_name`, `twitter:card=summary_large_image`.

**Known limitation:** these are injected by JavaScript. Googlebot renders JS and
reads them; Facebook, WhatsApp, LinkedIn, and X crawlers read raw HTML only and will
not. Link previews stay generic until the HTML is prerendered. The tags are shipped
anyway — they cost a dozen lines and are correct the day prerendering lands.

### JSON-LD

Two blocks, both picked up by Googlebot since it executes JavaScript.

**`Physician`:**

```json
{
  "@context": "https://schema.org",
  "@type": "Physician",
  "name": "Prof. Dr. M. Nazrul Islam",
  "medicalSpecialty": "Cardiology",
  "image": "<doctor.image>",
  "url": "<canonical>",
  "worksFor": { "@type": "MedicalOrganization", "name": "Popular Diagnostic Centre Limited" },
  "address": { "@type": "PostalAddress", "addressLocality": "Dhanmondi", "addressCountry": "BD" },
  "telephone": "<branches[0].phone>",
  "openingHoursSpecification": [ /* derived from doctor.schedule */ ]
}
```

Two requirements here are not optional:

1. **`telephone` uses `branches[0].phone`, never `doctor.mobile`.** The detail
   endpoint returns personal cell numbers (e.g. `01711563450`). Publishing 3,386
   doctors' personal mobile numbers as machine-readable structured data is a privacy
   breach. `branches[0].phone` is the public hotline.
2. **`openingHoursSpecification` requires time conversion.** The schedule stores
   `"2:00 pm"`; schema.org requires `"14:00"`. This converter can produce wrong data
   silently, so it is asserted explicitly in verification.

**`BreadcrumbList`:** Home → Doctors → {Specialty} → {Doctor}. The hierarchy is
already encoded in the URL path. Google renders these as breadcrumb trails in search
results in place of a raw URL.

### Baseline metadata in `index.html`

`index.html` currently has no `<meta name="description">` at all — not for the
homepage, not as a fallback. Static description and Open Graph tags are added there,
improving every route regardless of prerendering status.

### Site origin

Canonical URLs need an absolute origin: `https://www.populardiagnostic.com`.

Per the project's "never hardcode API URLs" rule this becomes `VITE_SITE_URL`, added
to `.env`, `.env.production`, and exported from `src/secrets.js`.

## Crawl Surface

### `scripts/generate-sitemap.mjs` (new)

Build-time Node script. Node 18+ has `fetch` built in, so no new dependency. Walks
all 68 pages of `/api/doctors`, builds each URL with the same slug logic, writes
`public/sitemap.xml`.

The project has no `public/` directory today; this creates it. Vite serves its
contents from the site root.

Contents: homepage, 22 branch pages, all static routes, and 3,386 doctor URLs.
Comfortably under the 50,000-URL single-file limit, so no sitemap index is needed.

Wired into the build non-fatally:

```json
"sitemap": "node scripts/generate-sitemap.mjs",
"build":   "node scripts/generate-sitemap.mjs || true && vite build"
```

If the API is slow or unreachable the script warns, leaves the previous
`sitemap.xml` in place, and the build proceeds. A flaky API must never block a
deploy.

### `public/robots.txt` (new)

```
User-agent: *
Allow: /
Disallow: /patient_portal

Sitemap: https://www.populardiagnostic.com/sitemap.xml
```

`/patient_portal` is the report-download area and has no reason to be indexed.

## Error Handling

| Case | Behavior |
|---|---|
| API 500 / doctor missing | Not-found state **plus `<meta name="robots" content="noindex">`** |
| `/doctors/x/y/notanumber` | Not-found plus noindex, no API call attempted |
| Doctor has no specialty | Specialty segment is `general-practice`; title drops the specialty clause |
| Doctor has no name | Name segment falls back to `doctor-{id}` |
| Redirect loop | Guarded by the `useEffect` key and exact string comparison |

The `noindex` on the error state is the load-bearing one. Static hosting cannot
return a real HTTP 404, so every bad URL returns `200 OK` with "Doctor not found" —
a soft 404. Without `noindex`, Google indexes unlimited identical error pages. This
risk is *higher* after this change than before it, because readable URLs invite
guessing.

## Verification

No third-party test framework is installed, and adding one is a new dependency.
However, `package.json` already sets `"type": "module"` and the toolchain runs
Node 25, so **Node's built-in test runner (`node:test`) is available at zero
dependency cost** and is used for unit tests. Both util modules are therefore
constrained to stay importable by plain Node: neither may import `src/secrets.js`
or touch `import.meta.env`, so the site origin is always passed in as a parameter.

Unit tests live beside their sources as `src/utils/doctorUrl.test.js` and
`src/utils/doctorSeo.test.js`, run via `npm test`. Vite does not bundle them because
nothing in the app's import graph references them.

Unit tests cover the edge cases; the script below covers the real dataset, where
3,386 records are available behind an open API.

### `scripts/verify-seo.mjs` (new)

Fetches all 68 pages once and asserts across every real doctor:

- Every full path is unique across all 3,386 → no duplicate-content collisions
- Every path segment matches `/^[a-z0-9-]+$/` → no URL-encoding surprises, and no
  `/` surviving from `Eye / Ophthalmology`
- Every `params.id` round-trips to the source doctor → no broken links
- Every description falls within 70–160 characters → no truncated or empty snippets
- Every title is non-empty and includes the specialty where data allows
- Every `schedule` entry converts to a valid 24-hour `HH:MM` → catches silently
  wrong structured data

This validates against production data rather than a handful of fixtures, at zero
dependency cost.

### Manual checklist

- `/doctordetail/2094` redirects to the canonical URL
- A wrong slug at a valid ID self-corrects
- Browser Back button behaves after a redirect
- `/doctors/cardiology` lands on `/our-doctors` with the Cardiology filter applied
- JSON-LD is present in the rendered DOM
- Google Rich Results Test passes against a live URL
- `npm run lint` at 0 warnings
- `npm run build` clean, then `npm run preview`

## Included Cleanup

`DoctorDetail.jsx:90` uses raw `axios`, which `.claude/rules/api-services.md`
explicitly forbids ("All API calls MUST go through the apiFactory pattern"). That
fetch block is being edited by this work regardless, so it migrates to `legacyApi`.
Leaving a rule violation in a file that was just refactored means it never gets
fixed.

## File Manifest

**New**

- `src/utils/doctorUrl.js` — `buildDoctorPath`, slugify helpers
- `src/utils/doctorUrl.test.js` — unit tests (`node:test`)
- `src/utils/doctorSeo.js` — title, description, JSON-LD generators
- `src/utils/doctorSeo.test.js` — unit tests (`node:test`)
- `src/components/SpecialtyRedirect.jsx` — folder-path redirects
- `scripts/generate-sitemap.mjs`
- `scripts/verify-seo.mjs`
- `public/robots.txt`
- `public/sitemap.xml` — generated, and **committed to git**. The build's non-fatal
  fallback ("leave the previous sitemap in place") only works if a previous sitemap
  exists in a fresh clone or CI checkout.

**Modified**

- `src/main.jsx` — routes, `HelmetProvider`
- `src/components/DoctorDetail.jsx` — ID source, canonical redirect, Helmet block,
  noindex on error, `legacyApi` migration
- `src/components/DoctorSearch.jsx` — `useSearchParams` specialty filter
- `src/components/DoctorCard.jsx:38` — `buildDoctorPath`
- `src/components/Search.jsx:83` — `buildDoctorPath`
- `src/components/SearchBoxBranch.jsx:75` — `buildDoctorPath`
- `src/Faw.jsx:111` — `buildDoctorPath`
- `src/components/Branch/Dhanmondi.jsx:114` — `buildDoctorPath`; drop the unused
  `?branches=&specialists=` query params, which `DoctorDetail` never reads
- `src/components/index.js` — export `SpecialtyRedirect`
- `index.html` — baseline description and Open Graph tags
- `package.json` — `react-helmet-async`, sitemap scripts
- `.env`, `.env.production`, `src/secrets.js` — `VITE_SITE_URL`

**New dependency:** `react-helmet-async` (approved)

## Explicitly Out of Scope

- **CloudFront Function for true 301 redirects** — phase 2, requires AWS access and
  distribution testing.
- **Prerendering or SSR** — the empty-HTML-shell problem. This is the single largest
  remaining SEO constraint and the reason social link previews stay generic. It
  touches the build pipeline and deployment, and needs its own design.
- **Specialty landing pages** — 73 indexable pages ("Cardiologists in Dhaka"). Likely
  higher search volume than any individual doctor's name, but a separate feature with
  its own design work. The redirect above is the interim answer.
