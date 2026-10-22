# SEO-Friendly Doctor Profile URLs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move doctor profiles from `/doctordetail/2094` to `/doctors/cardiology/prof-dr-m-nazrul-islam/2094` and give every doctor page unique metadata, structured data, and a crawlable sitemap.

**Architecture:** Two dependency-free pure-function modules (`doctorUrl.js`, `doctorSeo.js`) generate all URLs and metadata from existing API responses. `DoctorDetail` serves both the new and legacy routes and rewrites the URL to canonical after data loads. `react-helmet-async` injects per-page tags. A build-time Node script emits `sitemap.xml`.

**Tech Stack:** React 18, Vite 5, React Router 6, `react-helmet-async` (new), Node built-in test runner (`node:test`).

## Global Constraints

- **JavaScript only** — no TypeScript files. Source files are `.js` / `.jsx`.
- **No new dependencies** beyond `react-helmet-async`, which is explicitly approved for this work.
- **All API calls go through `src/services/api/legacyApi.js`** — never raw `axios` in components.
- **ESLint must introduce no new problems.** `npm run lint` has a **pre-existing
  baseline of 218 problems (26 errors, 192 warnings)** on this repo, measured at
  merge-base `221723b`. `CLAUDE.md` claims "max warnings: 0" — that is aspirational,
  not the current state. Do not attempt to fix the pre-existing 218; just ensure
  none of the files you add or modify appear in the lint output.
  **One documented exception:** each route component added to `src/main.jsx` adds one
  `react-refresh/only-export-components` warning, because every `const X =
  lazyLoad("X")` line trips that rule — 50 already do. This plan adds one such line
  (`SpecialtyRedirect`), taking the total to **219**. That is expected and accepted:
  the alternative is either an `eslint-disable` its 50 sibling lines do not carry, or
  abandoning the project's own "lazy load all route-level components" rule. Treat 219
  as the working baseline from Task 5 onward.
- **All route-level components lazy-loaded** via `React.lazy()` in `src/main.jsx`.
- **No `console.log`** in committed source.
- `package.json` already has `"type": "module"`, so `node --test` can import `src/utils/*.js` directly.
- **Node 22.9 or newer** is required — the build script uses `--env-file-if-exists`.
  Verified on Node v25.8.0. On Node 25, `node --test <dir>` is broken; the test script
  must use a quoted glob.
- **`src/utils/doctorUrl.js` and `src/utils/doctorSeo.js` MUST NOT import `src/secrets.js`** or reference `import.meta.env`. They must stay importable by plain Node for tests and the sitemap script. The site origin is always passed in as a parameter.
- **Site origin:** `https://www.populardiagnostic.com`
- **Never publish `doctor.mobile`** in structured data — it is a personal cell number. Use `doctor.branches[0].phone`.
- **Staging:** this repository has parallel feature work. Every commit stages explicit file paths. Never `git add -A` or `git add .`.

---

## File Structure

| File | Responsibility |
|---|---|
| `src/utils/doctorUrl.js` | Slugify, normalize both API shapes, build canonical doctor paths |
| `src/utils/doctorUrl.test.js` | Unit tests for the above |
| `src/utils/doctorSeo.js` | Title, description, `Physician` + `BreadcrumbList` JSON-LD |
| `src/utils/doctorSeo.test.js` | Unit tests for the above |
| `scripts/verify-seo.mjs` | Assert both modules against all 3,386 live doctor records |
| `scripts/generate-sitemap.mjs` | Emit `public/sitemap.xml` at build time |
| `src/components/SpecialtyRedirect.jsx` | Redirect `/doctors` and `/doctors/:specialty` to the search page |
| `src/components/DoctorDetail.jsx` | Serve both routes, canonical redirect, Helmet block |
| `src/components/DoctorSearch.jsx` | Read `?specialty=` and pre-select the filter |
| `public/robots.txt` | Crawl directives + sitemap pointer |

---

## Task 1: URL Builder Utility

**Files:**
- Create: `src/utils/doctorUrl.js`
- Test: `src/utils/doctorUrl.test.js`
- Modify: `package.json` (add `test` script)

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `slugify(value: string) => string`
  - `truncateSlug(slug: string, max?: number) => string`
  - `titleCase(value: string) => string`
  - `primarySpecialty(doctor: object) => string`
  - `primaryBranch(doctor: object) => string`
  - `buildDoctorPath(doctor: object, id?: number|string) => string`

**Critical detail:** `buildDoctorPath` takes an explicit second `id` argument because the `/api/doctor/:id` detail endpoint **does not return an `id` field**. List-shaped data can rely on `doctor.id`; the detail page must pass the route param.

- [ ] **Step 1: Add the test script to `package.json`**

In the `"scripts"` block, add:

```json
"test": "node --test \"src/utils/*.test.js\""
```

The glob must be quoted, and it must be a glob rather than a directory: on Node 25,
`node --test src/utils/` tries to load the directory as a module and fails with
`MODULE_NOT_FOUND`.

- [ ] **Step 2: Write the failing test**

Create `src/utils/doctorUrl.test.js`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import {
  slugify,
  truncateSlug,
  titleCase,
  primarySpecialty,
  primaryBranch,
  buildDoctorPath,
} from "./doctorUrl.js";

const listDoctor = {
  id: 2094,
  name: "Prof. Dr. M. Nazrul Islam",
  specialists: [{ specialist: { name: "Cardiology" } }],
  branches: [{ branch: { name: "Dhanmondi" } }],
};

const detailDoctor = {
  name: "Prof. Dr. M. Nazrul Islam",
  specialists: [{ specialist_id: 167, specialist_name: "Cardiology" }],
  branches: [{ branch_id: 1, name: "DHANMONDI", phone: "09666 787801" }],
};

test("slugify lowercases and hyphenates", () => {
  assert.equal(slugify("Prof. Dr. M. Nazrul Islam"), "prof-dr-m-nazrul-islam");
});

test("slugify converts a slash to a hyphen, never a path separator", () => {
  assert.equal(slugify("Eye / Ophthalmology"), "eye-ophthalmology");
  assert.equal(slugify("Child/Paediatrics"), "child-paediatrics");
});

test("slugify strips parenthetical scheduling notes", () => {
  assert.equal(
    slugify("Assistant Prof. Dr. Md.  Minhaj Uddin Bhuiyan (Friday Morning)"),
    "assistant-prof-dr-md-minhaj-uddin-bhuiyan"
  );
});

test("slugify handles ampersands and commas", () => {
  assert.equal(slugify("ENT, Head & Neck Surgery"), "ent-head-neck-surgery");
});

test("slugify returns empty string for empty input", () => {
  assert.equal(slugify(""), "");
  assert.equal(slugify(null), "");
  assert.equal(slugify(undefined), "");
});

test("truncateSlug keeps a segment that ends exactly on a boundary", () => {
  assert.equal(truncateSlug("aaa-bbb-ccc-ddd", 11), "aaa-bbb-ccc");
});

test("truncateSlug drops a word the cut would split", () => {
  assert.equal(truncateSlug("aaa-bbb-ccccccc", 12), "aaa-bbb");
});

test("truncateSlug leaves short slugs untouched", () => {
  assert.equal(truncateSlug("short-slug", 70), "short-slug");
});

test("titleCase normalizes an uppercase branch name", () => {
  assert.equal(titleCase("DHANMONDI"), "Dhanmondi");
  assert.equal(titleCase("english road"), "English Road");
});

test("primarySpecialty reads the list API shape", () => {
  assert.equal(primarySpecialty(listDoctor), "Cardiology");
});

test("primarySpecialty reads the detail API shape", () => {
  assert.equal(primarySpecialty(detailDoctor), "Cardiology");
});

test("primaryBranch reads both API shapes", () => {
  assert.equal(primaryBranch(listDoctor), "Dhanmondi");
  assert.equal(primaryBranch(detailDoctor), "DHANMONDI");
});

test("buildDoctorPath builds the canonical four-segment path", () => {
  assert.equal(
    buildDoctorPath(listDoctor),
    "/doctors/cardiology/prof-dr-m-nazrul-islam/2094"
  );
});

test("buildDoctorPath accepts an explicit id for detail-shaped data", () => {
  assert.equal(
    buildDoctorPath(detailDoctor, 2094),
    "/doctors/cardiology/prof-dr-m-nazrul-islam/2094"
  );
});

test("buildDoctorPath falls back to general-practice with no specialty", () => {
  assert.equal(
    buildDoctorPath({ id: 7, name: "Dr. A B", specialists: [] }),
    "/doctors/general-practice/dr-a-b/7"
  );
});

test("buildDoctorPath falls back to doctor-{id} with no name", () => {
  assert.equal(
    buildDoctorPath({ id: 9, name: "", specialists: [] }),
    "/doctors/general-practice/doctor-9/9"
  );
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — `Cannot find module '.../src/utils/doctorUrl.js'`

- [ ] **Step 4: Write the implementation**

Create `src/utils/doctorUrl.js`:

```js
// Pure URL helpers for doctor profile pages.
// MUST NOT import secrets.js or use import.meta.env — this module is imported
// by plain Node in tests and in scripts/generate-sitemap.mjs.

const SPECIALTY_FALLBACK = "general-practice";
const MAX_NAME_SEGMENT = 70;

export const slugify = (value) => {
  if (!value) return "";
  return String(value)
    .replace(/\([^)]*\)/g, " ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const truncateSlug = (slug, max = MAX_NAME_SEGMENT) => {
  if (!slug || slug.length <= max) return slug || "";
  // The cut already lands on a boundary — keep the full allowance.
  if (slug[max] === "-") return slug.slice(0, max);
  const cut = slug.slice(0, max);
  const lastDash = cut.lastIndexOf("-");
  const trimmed = lastDash > 0 ? cut.slice(0, lastDash) : cut;
  return trimmed.replace(/-+$/g, "");
};

export const titleCase = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/\b[a-z]/g, (char) => char.toUpperCase());

// The list endpoint nests specialty under `specialist.name`; the detail
// endpoint flattens it to `specialist_name`. Handle both.
export const primarySpecialty = (doctor) => {
  const first = doctor?.specialists?.[0];
  if (!first) return "";
  return first.specialist?.name || first.specialist_name || "";
};

// The list endpoint nests branch under `branch.name`; the detail endpoint
// flattens it to `name` and returns it uppercased.
export const primaryBranch = (doctor) => {
  const first = doctor?.branches?.[0];
  if (!first) return "";
  return first.branch?.name || first.name || "";
};

export const buildDoctorPath = (doctor, id = doctor?.id) => {
  const specialty = slugify(primarySpecialty(doctor)) || SPECIALTY_FALLBACK;
  const name = truncateSlug(slugify(doctor?.name)) || `doctor-${id}`;
  return `/doctors/${specialty}/${name}/${id}`;
};
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test`
Expected: PASS — 16 tests passing

- [ ] **Step 6: Run lint**

Run: `npm run lint`
Expected: no new problems — the total must stay at the 218-problem baseline (26 errors, 192 warnings), all pre-existing

- [ ] **Step 7: Commit**

```bash
git add src/utils/doctorUrl.js src/utils/doctorUrl.test.js package.json
git commit -m "feat: add doctor URL slug builder with tests"
```

---

## Task 2: Title and Description Generators

**Files:**
- Create: `src/utils/doctorSeo.js`
- Test: `src/utils/doctorSeo.test.js`

**Interfaces:**
- Consumes: `primarySpecialty`, `primaryBranch`, `titleCase` from `./doctorUrl.js`
- Produces:
  - `clampText(text: string, max: number) => string`
  - `doctorTitle(doctor: object) => string`
  - `doctorDescription(doctor: object) => string`
  - Exported constants `DESC_MAX = 160`, `DESC_MIN = 70`

- [ ] **Step 1: Write the failing test**

Create `src/utils/doctorSeo.test.js`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import {
  clampText,
  doctorTitle,
  doctorDescription,
  DESC_MAX,
  DESC_MIN,
} from "./doctorSeo.js";

const doctor = {
  name: "Prof. Dr. M. Nazrul Islam",
  degree: "MBBS, FCPS, FRCP (London), FACC, FESC.",
  specialists: [{ specialist_name: "Cardiology" }],
  branches: [{ name: "DHANMONDI" }],
};

// Real record with a 190-character run-on degree field.
const longDegreeDoctor = {
  name: "Prof. Dr. A. A. Shafi Majumder",
  degree:
    "MBBS, D.Card, MD (Card), FACC, FSGC, FRCP. Research Fellow, NCVC 9Japam), " +
    "WHO Fellow in Cardiology,USA Director & Professor of Cardiology (Retd) " +
    "National Institute of Cardiovascular Diseases, Dhaka.",
  specialists: [{ specialist_name: "Cardiology" }],
  branches: [{ name: "DHANMONDI" }],
};

test("clampText leaves short text untouched", () => {
  assert.equal(clampText("hello", 20), "hello");
});

test("clampText never exceeds the maximum", () => {
  const out = clampText("a".repeat(50) + " " + "b".repeat(50), 40);
  assert.ok(out.length <= 40, `got ${out.length}`);
});

test("doctorTitle front-loads name and specialty before the brand", () => {
  assert.equal(
    doctorTitle(doctor),
    "Prof. Dr. M. Nazrul Islam - Cardiology Specialist, Dhanmondi | Popular Diagnostic Centre"
  );
});

test("doctorTitle drops the specialty clause when absent", () => {
  assert.equal(
    doctorTitle({ name: "Dr. X", specialists: [], branches: [{ name: "MIRPUR" }] }),
    "Dr. X - Mirpur | Popular Diagnostic Centre"
  );
});

test("doctorDescription includes name, degrees, specialty and branch", () => {
  const out = doctorDescription(doctor);
  assert.ok(out.startsWith("Prof. Dr. M. Nazrul Islam, MBBS"), out);
  assert.ok(out.includes("Cardiology specialist"), out);
  assert.ok(out.includes("Dhanmondi"), out);
});

test("doctorDescription stays within the SERP budget", () => {
  const out = doctorDescription(doctor);
  assert.ok(out.length <= DESC_MAX, `too long: ${out.length}`);
  assert.ok(out.length >= DESC_MIN, `too short: ${out.length}`);
});

test("doctorDescription truncates a 190-character degree field", () => {
  const out = doctorDescription(longDegreeDoctor);
  assert.ok(out.length <= DESC_MAX, `too long: ${out.length}`);
  assert.ok(out.includes("Cardiology specialist"), out);
});

test("doctorDescription keeps only whole credentials", () => {
  const out = doctorDescription(longDegreeDoctor);
  const degreePart = out.slice(longDegreeDoctor.name.length + 2, out.indexOf(" - "));
  const originals = longDegreeDoctor.degree.split(",").map((part) => part.trim());
  for (const kept of degreePart.split(",").map((part) => part.trim())) {
    assert.ok(originals.includes(kept), `"${kept}" is not a whole credential`);
  }
});

test("doctorDescription works with no degree field", () => {
  const out = doctorDescription({
    name: "Dr. Y",
    specialists: [{ specialist_name: "Neurology" }],
    branches: [{ name: "UTTARA" }],
  });
  assert.ok(out.length <= DESC_MAX);
  assert.ok(out.includes("Neurology specialist"), out);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — `Cannot find module '.../src/utils/doctorSeo.js'`

- [ ] **Step 3: Write the implementation**

Create `src/utils/doctorSeo.js`:

```js
// Pure SEO metadata generators for doctor profile pages.
// MUST NOT import secrets.js or use import.meta.env — the site origin is
// always passed in as a parameter so plain Node can import this module.

import { primaryBranch, primarySpecialty, titleCase } from "./doctorUrl.js";

const ORG = "Popular Diagnostic Centre";
export const DESC_MAX = 160;
export const DESC_MIN = 70;

export const clampText = (text, max) => {
  const value = String(text || "");
  if (value.length <= max) return value;
  const cut = value.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const base = lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut;
  return `${base.replace(/[\s,.-]+$/, "")}…`;
};

// Every generator in this file needs the same three derived values, and
// Task 3 adds two more callers. Resolve them in one place.
export const resolveDoctorMeta = (doctor) => ({
  name: doctor?.name?.trim() || "Doctor",
  specialty: primarySpecialty(doctor),
  branch: titleCase(primaryBranch(doctor)),
});

export const doctorTitle = (doctor) => {
  const { name, specialty, branch } = resolveDoctorMeta(doctor);
  const middle = [specialty ? `${specialty} Specialist` : null, branch || null]
    .filter(Boolean)
    .join(", ");
  return middle ? `${name} - ${middle} | ${ORG}` : `${name} | ${ORG}`;
};

// Fit as many comma-separated credentials as the remaining budget allows,
// always cutting on a comma boundary. Degree fields run up to 190 characters.
const fitDegrees = (degree, budget) => {
  if (!degree || budget <= 0) return "";
  const parts = String(degree)
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  const kept = [];
  let length = 0;
  for (const part of parts) {
    const addition = kept.length ? part.length + 2 : part.length;
    if (length + addition > budget) break;
    kept.push(part);
    length += addition;
  }
  return kept.join(", ");
};

export const doctorDescription = (doctor) => {
  const { name, specialty, branch } = resolveDoctorMeta(doctor);
  const role = specialty ? `${specialty} specialist` : "Consultant";
  const where = branch ? `${ORG}, ${branch}` : ORG;
  const tail = `${role} at ${where}. View chamber schedule and book an appointment online.`;

  const base = `${name} - ${tail}`;
  const degrees = fitDegrees(doctor?.degree, DESC_MAX - base.length - 2);
  const full = degrees ? `${name}, ${degrees} - ${tail}` : base;
  return clampText(full, DESC_MAX);
};
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`
Expected: PASS — all Task 1 and Task 2 tests green

- [ ] **Step 5: Run lint**

Run: `npm run lint`
Expected: no new problems beyond the baseline (218 before Task 5, 219 after)

- [ ] **Step 6: Commit**

```bash
git add src/utils/doctorSeo.js src/utils/doctorSeo.test.js
git commit -m "feat: add doctor title and meta description generators"
```

---

## Task 3: Structured Data Generators

**Files:**
- Modify: `src/utils/doctorSeo.js`
- Test: `src/utils/doctorSeo.test.js`

**Interfaces:**
- Consumes: `slugify` from `./doctorUrl.js`; `resolveDoctorMeta` from this same
  module (added in Task 2 — reuse it, do not recompute name/specialty/branch)
- Produces:
  - `to24Hour(value: string) => string|null`
  - `openingHours(schedule: Array) => Array`
  - `doctorJsonLd(doctor: object, url: string) => object`
  - `breadcrumbJsonLd(doctor: object, origin: string, path: string) => object`

- [ ] **Step 1: Append the failing tests**

Append to `src/utils/doctorSeo.test.js`:

```js
import {
  to24Hour,
  openingHours,
  doctorJsonLd,
  breadcrumbJsonLd,
} from "./doctorSeo.js";

const scheduled = {
  name: "Prof. Dr. M. Nazrul Islam",
  image: "https://old.populardiagnostic.com/x.jpeg",
  mobile: "01711563450",
  specialists: [{ specialist_name: "Cardiology" }],
  branches: [{ name: "DHANMONDI", phone: "09666 787801" }],
  schedule: [{ day: "Sunday", start_time: "2:00 pm", end_time: "5:00 pm" }],
};

test("to24Hour converts afternoon times", () => {
  assert.equal(to24Hour("2:00 pm"), "14:00");
  assert.equal(to24Hour("5:30 pm"), "17:30");
});

test("to24Hour converts morning times", () => {
  assert.equal(to24Hour("9:00 am"), "09:00");
  assert.equal(to24Hour("11:45 am"), "11:45");
});

test("to24Hour handles the noon and midnight edge cases", () => {
  assert.equal(to24Hour("12:00 pm"), "12:00");
  assert.equal(to24Hour("12:30 am"), "00:30");
});

test("to24Hour returns null for unparseable input", () => {
  assert.equal(to24Hour("closed"), null);
  assert.equal(to24Hour(""), null);
  assert.equal(to24Hour(null), null);
});

test("openingHours maps a schedule to schema.org shape", () => {
  assert.deepEqual(openingHours(scheduled.schedule), [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "https://schema.org/Sunday",
      opens: "14:00",
      closes: "17:00",
    },
  ]);
});

test("openingHours drops entries with unparseable times", () => {
  assert.deepEqual(
    openingHours([{ day: "Monday", start_time: "n/a", end_time: "5:00 pm" }]),
    []
  );
});

test("doctorJsonLd uses the branch phone, never the personal mobile", () => {
  const ld = doctorJsonLd(scheduled, "https://www.populardiagnostic.com/x");
  assert.equal(ld.telephone, "09666 787801");
  assert.notEqual(ld.telephone, scheduled.mobile);
  assert.ok(!JSON.stringify(ld).includes("01711563450"));
});

test("doctorJsonLd emits a Physician node with specialty and address", () => {
  const ld = doctorJsonLd(scheduled, "https://www.populardiagnostic.com/x");
  assert.equal(ld["@type"], "Physician");
  assert.equal(ld.medicalSpecialty, "Cardiology");
  assert.equal(ld.address.addressLocality, "Dhanmondi");
  assert.equal(ld.address.addressCountry, "BD");
  assert.equal(ld.worksFor.name, "Popular Diagnostic Centre Limited");
});

test("doctorJsonLd omits telephone when no branch phone exists", () => {
  const ld = doctorJsonLd(
    { name: "Dr. Z", mobile: "0170000000", branches: [{ name: "SAVAR" }] },
    "https://www.populardiagnostic.com/y"
  );
  assert.equal("telephone" in ld, false);
});

test("breadcrumbJsonLd builds a four-level trail", () => {
  const ld = breadcrumbJsonLd(
    scheduled,
    "https://www.populardiagnostic.com",
    "/doctors/cardiology/prof-dr-m-nazrul-islam/2094"
  );
  assert.equal(ld["@type"], "BreadcrumbList");
  assert.equal(ld.itemListElement.length, 4);
  assert.equal(ld.itemListElement[2].name, "Cardiology");
  assert.equal(
    ld.itemListElement[2].item,
    "https://www.populardiagnostic.com/doctors/cardiology"
  );
  assert.equal(ld.itemListElement[3].position, 4);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — `to24Hour is not a function` (or an import error)

- [ ] **Step 3: Write the implementation**

In `src/utils/doctorSeo.js`, change the import line to add `slugify`:

```js
import { primaryBranch, primarySpecialty, slugify, titleCase } from "./doctorUrl.js";
```

Add below the existing exports:

```js
const ORG_FULL = "Popular Diagnostic Centre Limited";
const SPECIALTY_FALLBACK = "general-practice";

// Schedules store "2:00 pm"; schema.org requires "14:00".
export const to24Hour = (value) => {
  const match = /^\s*(\d{1,2}):(\d{2})\s*([ap])\.?m\.?\s*$/i.exec(String(value || ""));
  if (!match) return null;
  const hour = (Number(match[1]) % 12) + (match[3].toLowerCase() === "p" ? 12 : 0);
  return `${String(hour).padStart(2, "0")}:${match[2]}`;
};

export const openingHours = (schedule) =>
  (schedule || [])
    .map((slot) => {
      const opens = to24Hour(slot?.start_time);
      const closes = to24Hour(slot?.end_time);
      if (!opens || !closes || !slot?.day) return null;
      return {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${slot.day}`,
        opens,
        closes,
      };
    })
    .filter(Boolean);

export const doctorJsonLd = (doctor, url) => {
  const { name, specialty, branch } = resolveDoctorMeta(doctor);
  // Never doctor.mobile — that is a personal cell number.
  const telephone = doctor?.branches?.[0]?.phone || "";
  const hours = openingHours(doctor?.schedule);

  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    name,
    url,
    ...(doctor?.image ? { image: doctor.image } : {}),
    ...(specialty ? { medicalSpecialty: specialty } : {}),
    worksFor: { "@type": "MedicalOrganization", name: ORG_FULL },
    ...(branch
      ? {
          address: {
            "@type": "PostalAddress",
            addressLocality: branch,
            addressCountry: "BD",
          },
        }
      : {}),
    ...(telephone ? { telephone } : {}),
    ...(hours.length ? { openingHoursSpecification: hours } : {}),
  };
};

// react-helmet-async assigns <script> children via innerHTML, not textContent
// (lib/index.esm.js:473-520), and JSON.stringify escapes neither "<" nor "/".
// A doctor field containing "</script" would close the tag and break the head.
export const jsonLdScript = (value) =>
  JSON.stringify(value).replace(/</g, "\\u003c");

export const breadcrumbJsonLd = (doctor, origin, path) => {
  const { name, specialty } = resolveDoctorMeta(doctor);
  const specialtySlug = slugify(specialty) || SPECIALTY_FALLBACK;
  const trail = [
    { name: "Home", item: `${origin}/` },
    { name: "Doctors", item: `${origin}/our-doctors` },
    ...(specialty
      ? [{ name: specialty, item: `${origin}/doctors/${specialtySlug}` }]
      : []),
    { name, item: `${origin}${path}` },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: entry.item,
    })),
  };
};
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`
Expected: PASS — all tests across both util files green

- [ ] **Step 5: Run lint**

Run: `npm run lint`
Expected: no new problems beyond the baseline (218 before Task 5, 219 after)

- [ ] **Step 6: Commit**

```bash
git add src/utils/doctorSeo.js src/utils/doctorSeo.test.js
git commit -m "feat: add Physician and BreadcrumbList JSON-LD generators"
```

---

## Task 4: Verification Against Live Data

**Files:**
- Create: `scripts/verify-seo.mjs`
- Modify: `package.json` (add `verify:seo` script)

**Interfaces:**
- Consumes: `buildDoctorPath` from `../src/utils/doctorUrl.js`; `doctorTitle`, `doctorDescription`, `to24Hour`, `DESC_MAX`, `DESC_MIN` from `../src/utils/doctorSeo.js`
- Produces: nothing consumed by later tasks. Exits non-zero on any assertion failure.

This is the safety net the unit tests cannot provide: it runs the generators over all 3,386 real records. Known baseline from design-time analysis — 252 name slugs are shared by two or more doctors, so **path uniqueness depends entirely on the trailing ID**.

- [ ] **Step 1: Write the script**

Create `scripts/verify-seo.mjs`:

```js
#!/usr/bin/env node
// Validates the slug and metadata generators against every live doctor record.
// Run: npm run verify:seo

import { buildDoctorPath } from "../src/utils/doctorUrl.js";
import {
  doctorTitle,
  doctorDescription,
  to24Hour,
  DESC_MAX,
  DESC_MIN,
} from "../src/utils/doctorSeo.js";

const BASE_URL = process.env.VITE_BASE_URL || "https://api.populardiagnostic.com";
const TOKEN = process.env.VITE_API_TOKEN;

if (!TOKEN) {
  console.error("VITE_API_TOKEN is required. Try: node --env-file=.env scripts/verify-seo.mjs");
  process.exit(1);
}

const fetchPage = async (page) => {
  const res = await fetch(`${BASE_URL}/api/doctors?token=${TOKEN}&page=${page}`);
  if (!res.ok) throw new Error(`page ${page}: HTTP ${res.status}`);
  return res.json();
};

const failures = [];
const fail = (id, message) => failures.push(`  [${id}] ${message}`);
let minDescription = Number.POSITIVE_INFINITY;
let maxDescription = 0;

const first = await fetchPage(1);
const lastPage = first.data.last_page;
const expectedTotal = first.data.total;
const doctors = [...first.data.data];

// Without this, a renamed/missing last_page makes `2 <= undefined` false, the
// loop never runs, and the script "passes" having checked only page 1.
if (!Number.isInteger(lastPage) || lastPage < 1) {
  throw new Error(`unusable last_page from API: ${JSON.stringify(lastPage)}`);
}

for (let page = 2; page <= lastPage; page += 1) {
  const body = await fetchPage(page);
  doctors.push(...body.data.data);
}

// The API reports its own total — assert we collected all of it rather than
// trusting a hardcoded floor. Catches silent under-collection exactly.
if (Number.isInteger(expectedTotal) && doctors.length !== expectedTotal) {
  throw new Error(`collected ${doctors.length} doctors, API reports ${expectedTotal}`);
}

console.log(`Fetched ${doctors.length} doctors across ${lastPage} pages.`);

const seenPaths = new Map();
const SEGMENT = /^[a-z0-9-]+$/;

for (const doctor of doctors) {
  // Check the id independently. The round-trip test below cannot catch a
  // missing id: buildDoctorPath renders `undefined` into the path, and
  // String(undefined) === "undefined" makes the comparison pass.
  if (doctor.id == null || !/^[0-9]+$/.test(String(doctor.id))) {
    fail(doctor.id, `missing or non-numeric id: ${JSON.stringify(doctor.id)}`);
  }

  const path = buildDoctorPath(doctor);
  const segments = path.split("/").slice(1);

  if (segments.length !== 4 || segments[0] !== "doctors") {
    fail(doctor.id, `malformed path: ${path}`);
  }
  for (const segment of segments.slice(1, 3)) {
    if (!SEGMENT.test(segment)) fail(doctor.id, `unsafe segment "${segment}" in ${path}`);
  }
  if (String(segments[3]) !== String(doctor.id)) {
    fail(doctor.id, `id does not round-trip: ${path}`);
  }
  if (seenPaths.has(path)) {
    fail(doctor.id, `duplicate path with doctor ${seenPaths.get(path)}: ${path}`);
  }
  seenPaths.set(path, doctor.id);

  const title = doctorTitle(doctor);
  if (!title.trim()) fail(doctor.id, "empty title");

  const description = doctorDescription(doctor);
  minDescription = Math.min(minDescription, description.length);
  maxDescription = Math.max(maxDescription, description.length);
  if (description.length > DESC_MAX) {
    fail(doctor.id, `description ${description.length} chars (max ${DESC_MAX})`);
  }
  if (description.length < DESC_MIN) {
    fail(doctor.id, `description ${description.length} chars (min ${DESC_MIN})`);
  }

  for (const slot of doctor.schedule || []) {
    if (slot.start_time && !to24Hour(slot.start_time)) {
      fail(doctor.id, `unparseable start_time "${slot.start_time}"`);
    }
    if (slot.end_time && !to24Hour(slot.end_time)) {
      fail(doctor.id, `unparseable end_time "${slot.end_time}"`);
    }
  }
}

console.log(`Unique paths: ${seenPaths.size} / ${doctors.length}`);
console.log(`Description lengths: ${minDescription}-${maxDescription} (limit ${DESC_MAX})`);

if (failures.length) {
  console.error(`\nFAILED with ${failures.length} problem(s):`);
  console.error(failures.slice(0, 40).join("\n"));
  if (failures.length > 40) console.error(`  ...and ${failures.length - 40} more`);
  process.exit(1);
}

console.log("\nAll SEO assertions passed.");
```

- [ ] **Step 2: Add the script to `package.json`**

In `"scripts"`, add:

```json
"verify:seo": "node --env-file=.env scripts/verify-seo.mjs"
```

- [ ] **Step 3: Run it**

Run: `npm run verify:seo`
Expected output ends with:

```
Fetched 3385 doctors across 68 pages.
Unique paths: 3385 / 3385
Description lengths: 127-160 (limit 160)

All SEO assertions passed.
```

**The doctor count is live data and drifts.** It read 3386 when this plan was written
and 3385 a few hours later — one record was removed from the client's database. Do not
treat the exact number as an expected value. What must hold is that **unique paths
equals the doctor count**, and that the collected count matches the API's own `total`
field (the script asserts this itself).

These numbers were confirmed against live data while this plan was written. Two checks:

- If `Unique paths` is below the doctor count, the ID is not reaching the final
  segment — stop and fix Task 1 before continuing. 252 name slugs are shared by two
  or more doctors, so the ID is the only thing keeping paths distinct.
- A maximum description length of exactly 160 is expected, not a bug: `clampText` is
  doing its job on the longest records.

- [ ] **Step 4: Commit**

```bash
git add scripts/verify-seo.mjs package.json
git commit -m "test: verify slug and metadata generators against all live doctors"
```

---

## Task 5: Routes, Provider, and Site Origin

**Files:**
- Modify: `src/main.jsx`
- Modify: `src/secrets.js`
- Modify: `.env`, `.env.production`
- Modify: `package.json` (dependency)

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `SITE_URL` exported from `src/secrets.js`; routes `/doctors/:specialty/:name/:id`, `/doctors/:specialty`, `/doctors`.

- [ ] **Step 1: Install the dependency**

Run: `npm install react-helmet-async`

- [ ] **Step 2: Add `VITE_SITE_URL` to both env files**

Append to `.env` **and** `.env.production`:

```
VITE_SITE_URL=https://www.populardiagnostic.com
```

**Both files are already tracked by git.** `.gitignore` lists `.env`, but the file was
committed before that rule existed, so it remains tracked and `.gitignore` has no
effect on it. Commit both — `VITE_SITE_URL` is a public URL, not a secret, and adding
it changes nothing about the repository's existing exposure.

> **Pre-existing security issue, out of scope for this plan:** `.env` and
> `.env.production` are both tracked and contain `VITE_API_TOKEN`,
> `VITE_AKHIL_API_USERNAME`, and `VITE_AKHIL_API_PASSWORD` in git history. This
> predates this branch and contradicts `CLAUDE.md`'s "Never commit `.env` files" rule.
> Remediation — rotating the credentials and purging history — is a separate decision
> for the repository owner. Do not attempt it as part of this task.

- [ ] **Step 3: Export it from `src/secrets.js`**

Add after the `API_TOKEN` line:

```js
const SITE_URL = import.meta.env.VITE_SITE_URL;
```

and add `SITE_URL` to the `export { ... }` block.

- [ ] **Step 4: Wire up the provider and routes in `src/main.jsx`**

Add to the imports at the top:

```js
import { HelmetProvider } from "react-helmet-async";
```

Add beside the other lazy-loaded components:

```js
const SpecialtyRedirect = lazyLoad("SpecialtyRedirect");
```

Replace the existing doctor detail route line:

```js
{ path: "/doctordetail/:doctorId", element: <DoctorDetail /> },
```

with:

```js
{ path: "/doctors/:specialty/:name/:id", element: <DoctorDetail /> },
{ path: "/doctordetail/:doctorId", element: <DoctorDetail /> },
{ path: "/doctors/:specialty", element: <SpecialtyRedirect /> },
{ path: "/doctors", element: <SpecialtyRedirect /> },
```

Wrap the router in the provider — replace:

```jsx
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
```

with:

```jsx
  <React.StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </React.StrictMode>
```

- [ ] **Step 5: Create a placeholder `SpecialtyRedirect` so the build resolves**

Create `src/components/SpecialtyRedirect.jsx`:

```jsx
import { Navigate } from "react-router-dom";

// Fully implemented in Task 9.
const SpecialtyRedirect = () => <Navigate to="/our-doctors" replace />;

export default SpecialtyRedirect;
```

Add to `src/components/index.js` — an import beside the others:

```js
import SpecialtyRedirect from "./SpecialtyRedirect";
```

and `SpecialtyRedirect,` inside the export block.

- [ ] **Step 6: Verify the build**

Run: `npm run lint && npm run build`
Expected: no new lint problems beyond the baseline (219 from Task 5 onward); build succeeds

- [ ] **Step 7: Commit**

```bash
git add src/main.jsx src/secrets.js src/components/SpecialtyRedirect.jsx src/components/index.js .env .env.production package.json package-lock.json
git commit -m "feat: add doctor routes, HelmetProvider, and VITE_SITE_URL"
```

---

## Task 6: DoctorDetail Canonical Redirect

**Files:**
- Modify: `src/components/DoctorDetail.jsx:1-130`

**Interfaces:**
- Consumes: `buildDoctorPath` from `../utils/doctorUrl.js`; `legacyApi` from `../services/api/legacyApi.js`
- Produces: a `doctorId` value and a `canonicalPath` value used by Task 7's Helmet block.

Two changes land together because they touch the same fetch block: the ID now comes from either route, and the raw `axios` call migrates to `legacyApi` (required by `.claude/rules/api-services.md`).

`legacyApi` appends the token automatically via a request interceptor, so the `?token=` query parameter must be removed from the URLs.

- [ ] **Step 1: Replace the imports**

Remove:

```js
import axios from "axios";
```

and:

```js
import { API_TOKEN, BASE_URL } from "../secrets";
```

Add:

```js
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { legacyApi } from "../services/api/legacyApi";
import { buildDoctorPath } from "../utils/doctorUrl";
```

(The existing `useParams, Link` import line is replaced by the one above.)

- [ ] **Step 2: Derive the ID from either route**

Replace:

```js
  const { doctorId } = useParams();
```

with:

```js
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  // Canonical route supplies `id`; the legacy /doctordetail/:doctorId route
  // supplies `doctorId`. The detail API response has no id field of its own.
  const doctorId = params.id || params.doctorId;
```

- [ ] **Step 3: Migrate the fetch calls to `legacyApi`**

Replace:

```js
        const doctorResponse = await axios.get(
          `${BASE_URL}/api/doctor/${doctorId}?token=${API_TOKEN}`
        );
```

with:

```js
        const doctorResponse = await legacyApi.get(`/api/doctor/${doctorId}`);
```

Replace:

```js
            const similarResponse = await axios.get(
              `${BASE_URL}/api/doctor-suggestions?token=${API_TOKEN}&branches=${branchIds}&specialities=${specialistIds}`
            );
```

with:

```js
            const similarResponse = await legacyApi.get("/api/doctor-suggestions", {
              params: { branches: branchIds, specialities: specialistIds },
            });
```

- [ ] **Step 4: Add the canonical redirect effect**

Insert immediately after the existing `useEffect` that fetches data, before `isDoctorOnLeave`:

```js
  const canonicalPath = doctor ? buildDoctorPath(doctor, doctorId) : null;

  // Rewrite legacy URLs and stale slugs to the canonical path. Without this,
  // /doctors/any/thing/2094 would serve identical content at unlimited URLs.
  useEffect(() => {
    if (!canonicalPath) return;
    if (location.pathname === canonicalPath) return;
    navigate(canonicalPath, { replace: true });
  }, [canonicalPath, location.pathname, navigate]);
```

- [ ] **Step 5: Verify manually in the dev server**

Run: `npm run dev`

Check each of these:
- Visit `http://localhost:5173/doctordetail/2094` → URL becomes `/doctors/cardiology/prof-dr-m-nazrul-islam/2094`, page renders
- Visit `http://localhost:5173/doctors/wrong/wrong/2094` → URL corrects to the canonical path
- Visit the canonical URL directly → no redirect, no flicker
- Press Back after a redirect → returns to the previous page, not into a redirect loop
- The "Similar Doctors" sidebar still populates

- [ ] **Step 6: Run lint**

Run: `npm run lint`
Expected: no new problems beyond the baseline (218 before Task 5, 219 after)

- [ ] **Step 7: Commit**

```bash
git add src/components/DoctorDetail.jsx
git commit -m "feat: canonical URL redirect on doctor detail, migrate to legacyApi"
```

---

## Task 7: DoctorDetail Metadata

**Files:**
- Modify: `src/components/DoctorDetail.jsx`

**Interfaces:**
- Consumes: `canonicalPath` from Task 6; `doctorTitle`, `doctorDescription`, `doctorJsonLd`, `breadcrumbJsonLd` from `../utils/doctorSeo.js`; `SITE_URL` from `../secrets`
- Produces: rendered `<Helmet>` output.

- [ ] **Step 1: Add the imports**

```js
import { Helmet } from "react-helmet-async";
import {
  doctorTitle,
  doctorDescription,
  doctorJsonLd,
  breadcrumbJsonLd,
  jsonLdScript,
} from "../utils/doctorSeo";
import { SITE_URL } from "../secrets";
```

- [ ] **Step 2: Add `noindex` to the loading, error, and not-found states**

Replace:

```js
  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }
```

with:

```js
  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  // Static hosting cannot return a real 404, so every bad URL returns 200 OK.
  // Without noindex, Google indexes unlimited identical error pages.
  const notFoundHead = (
    <Helmet>
      <title>Doctor Not Found | Popular Diagnostic Centre</title>
      <meta name="robots" content="noindex, follow" />
    </Helmet>
  );
```

Replace:

```js
  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (!doctor) {
    return <div className="text-center py-10">Doctor not found</div>;
  }
```

with:

```js
  if (error) {
    return (
      <>
        {notFoundHead}
        <div className="text-center py-10 text-red-500">{error}</div>
      </>
    );
  }

  if (!doctor) {
    return (
      <>
        {notFoundHead}
        <div className="text-center py-10">Doctor not found</div>
      </>
    );
  }
```

- [ ] **Step 3: Add the Helmet block to the success render**

Immediately after the opening `<div className="doctor-detail bg-gray-100 min-h-screen">`, insert:

```jsx
      <Helmet>
        <title>{doctorTitle(doctor)}</title>
        <meta name="description" content={doctorDescription(doctor)} />
        <link rel="canonical" href={`${SITE_URL}${canonicalPath}`} />

        <meta property="og:type" content="profile" />
        <meta property="og:site_name" content="Popular Diagnostic Centre" />
        <meta property="og:title" content={doctorTitle(doctor)} />
        <meta property="og:description" content={doctorDescription(doctor)} />
        <meta property="og:url" content={`${SITE_URL}${canonicalPath}`} />
        {doctor.image && <meta property="og:image" content={doctor.image} />}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={doctorTitle(doctor)} />
        <meta name="twitter:description" content={doctorDescription(doctor)} />
        {doctor.image && <meta name="twitter:image" content={doctor.image} />}

        <script type="application/ld+json">
          {jsonLdScript(doctorJsonLd(doctor, `${SITE_URL}${canonicalPath}`))}
        </script>
        <script type="application/ld+json">
          {jsonLdScript(breadcrumbJsonLd(doctor, SITE_URL, canonicalPath))}
        </script>
      </Helmet>
```

- [ ] **Step 4: Verify in the browser**

Run: `npm run dev`, open a doctor page, then in DevTools console:

```js
document.title
document.querySelector('meta[name="description"]').content
document.querySelector('link[rel="canonical"]').href
[...document.querySelectorAll('script[type="application/ld+json"]')].map(s => JSON.parse(s.textContent)["@type"])
```

Expected: a doctor-specific title; a description of 70–160 characters; a canonical URL of `https://www.populardiagnostic.com/doctors/...`; and `["Physician", "BreadcrumbList"]`.

Then confirm the personal number is absent:

```js
document.body.innerHTML.includes(doctorMobileNumber)  // check the JSON-LD specifically
```

Visit `/doctors/x/y/999999999` and confirm `<meta name="robots" content="noindex, follow">` is present.

- [ ] **Step 5: Run lint**

Run: `npm run lint`
Expected: no new problems beyond the baseline (218 before Task 5, 219 after)

- [ ] **Step 6: Commit**

```bash
git add src/components/DoctorDetail.jsx
git commit -m "feat: add per-doctor title, meta, OG tags, and JSON-LD"
```

---

## Task 8: Update Doctor Link Call Sites

**Files:**
- Modify: `src/components/DoctorCard.jsx:38`
- Modify: `src/components/Search.jsx:83`
- Modify: `src/components/SearchBoxBranch.jsx:75`
- Modify: `src/Faw.jsx:111`
- Modify: `src/components/Branch/Dhanmondi.jsx:114`
- Modify: `src/components/DoctorDetail.jsx:242`

**Interfaces:**
- Consumes: `buildDoctorPath` from `../utils/doctorUrl.js` (`./utils/doctorUrl` in `Faw.jsx`, `../../utils/doctorUrl` in `Dhanmondi.jsx`)
- Produces: nothing.

All six sites receive list-shaped doctor objects that include `id`, so the single-argument form works.

- [ ] **Step 1: `src/components/DoctorCard.jsx`**

Add the import:

```js
import { buildDoctorPath } from "../utils/doctorUrl";
```

Replace:

```jsx
      to={`/doctordetail/${doctor.id}`}
```

with:

```jsx
      to={buildDoctorPath(doctor)}
```

- [ ] **Step 2: `src/components/Search.jsx`**

Add the import:

```js
import { buildDoctorPath } from "../utils/doctorUrl";
```

Replace:

```jsx
    <Link to={`/doctordetail/${doctor.id}`} className="block">
```

with:

```jsx
    <Link to={buildDoctorPath(doctor)} className="block">
```

- [ ] **Step 3: `src/components/SearchBoxBranch.jsx`**

Add the import:

```js
import { buildDoctorPath } from "../utils/doctorUrl";
```

Replace:

```jsx
    <Link to={`/doctordetail/${doctor.id}`} className="w-full">
```

with:

```jsx
    <Link to={buildDoctorPath(doctor)} className="w-full">
```

- [ ] **Step 4: `src/Faw.jsx`**

Add the import (note the different relative path — this file is in `src/`, not `src/components/`):

```js
import { buildDoctorPath } from "./utils/doctorUrl";
```

Replace:

```jsx
    <Link to={`/doctordetail/${doctor.id}`} className="block">
```

with:

```jsx
    <Link to={buildDoctorPath(doctor)} className="block">
```

- [ ] **Step 5: `src/components/Branch/Dhanmondi.jsx`**

Add the import (two levels up):

```js
import { buildDoctorPath } from "../../utils/doctorUrl";
```

Replace:

```jsx
                  to={`/doctordetail/${doctor.id}?branches=${branchIds}&specialists=${specialistIds}`}
```

with:

```jsx
                  to={buildDoctorPath(doctor)}
```

The `branchIds` and `specialistIds` variables directly above become unused — `DoctorDetail` never read those query parameters. Delete both `const` declarations so ESLint stays at 0 warnings.

- [ ] **Step 6: `src/components/DoctorDetail.jsx` similar-doctors grid**

Replace:

```jsx
                      <Link to={`/doctordetail/${doc.id}`} className="block">
```

with:

```jsx
                      <Link to={buildDoctorPath(doc)} className="block">
```

- [ ] **Step 7: Confirm no legacy link templates remain**

Run:

```bash
grep -rn "doctordetail/\${" src
```

Expected: no output. The only remaining `doctordetail` reference in `src` should be the legacy route registration in `src/main.jsx`.

- [ ] **Step 8: Verify in the browser**

Run: `npm run dev`

- Homepage doctor search → click a result → lands on a canonical URL with no redirect flicker
- `/our-doctors` → click a card → canonical URL
- `/dhanmondi` → click a doctor card → canonical URL
- A doctor page's "Similar Doctors" → canonical URL

- [ ] **Step 9: Run lint and build**

Run: `npm run lint && npm run build`
Expected: no new lint problems beyond the baseline (219 from Task 5 onward); build succeeds

- [ ] **Step 10: Commit**

```bash
git add src/components/DoctorCard.jsx src/components/Search.jsx src/components/SearchBoxBranch.jsx src/Faw.jsx src/components/Branch/Dhanmondi.jsx src/components/DoctorDetail.jsx
git commit -m "feat: point all doctor links at canonical SEO URLs"
```

---

## Task 9: Specialty Folder Redirect

**Files:**
- Modify: `src/components/SpecialtyRedirect.jsx`
- Modify: `src/components/DoctorSearch.jsx`

**Interfaces:**
- Consumes: `slugify` from `../utils/doctorUrl.js`
- Produces: nothing.

`/doctors/cardiology` and `/doctors` would otherwise hit the not-found state — 73 discoverable URLs returning soft 404s.

`DoctorSearch` holds `selectedSpecializations` in local state and filters by specialty **ID** (`specialities=167`), not by name. It already fetches `/api/doctor-speciality`, which returns `{ id, name }` — slugifying those names yields the slug-to-ID map.

**`/api/doctor-speciality` is paginated and must be fully paged through.** It reports
81 specialties, `per_page: 50`, `last_page: 2`, and `DoctorSearch` fetches only page 1.
Measured against live data: 73 distinct specialty slugs appear in doctor URLs, and
**24 of them are absent from page 1** — so a third of the `/doctors/{specialty}` URLs
this task exists to fix would resolve to no ID and land unfiltered (83 doctors, ~2%;
worst case `/doctors/infertility-gynae`, 17 doctors). All 24 are on page 2. Paging also
repairs a pre-existing bug: the specialty dropdown has been missing 31 of 81 options
for every user, not only for crawlers.

- [ ] **Step 1: Implement the redirect**

Replace the entire contents of `src/components/SpecialtyRedirect.jsx`:

```jsx
import { Navigate, useParams } from "react-router-dom";

// /doctors            -> /our-doctors
// /doctors/cardiology -> /our-doctors?specialty=cardiology
const SpecialtyRedirect = () => {
  const { specialty } = useParams();
  const to = specialty
    ? `/our-doctors?specialty=${encodeURIComponent(specialty)}`
    : "/our-doctors";
  return <Navigate to={to} replace />;
};

export default SpecialtyRedirect;
```

- [ ] **Step 2: Read the query parameter in `DoctorSearch`**

Add the imports:

```js
import { useSearchParams } from "react-router-dom";
import { slugify } from "../utils/doctorUrl";
```

Add beside the other hooks, immediately after the `isInitialMount` ref:

```js
  const [searchParams] = useSearchParams();
  const specialtyParam = searchParams.get("specialty");
  const hasAppliedSpecialtyParam = useRef(false);
```

- [ ] **Step 3: Pre-select the filter once specializations load**

Insert after the `specializationOptions` `useMemo`:

```js
  // A visitor arriving from /doctors/cardiology should land on filtered
  // results. Runs once, after the specialization list resolves.
  useEffect(() => {
    if (hasAppliedSpecialtyParam.current) return;
    if (!specialtyParam || specializationOptions.length === 0) return;

    const match = specializationOptions.find(
      (option) => slugify(option.label) === specialtyParam
    );
    hasAppliedSpecialtyParam.current = true;
    if (match) setSelectedSpecializations([match]);
  }, [specialtyParam, specializationOptions]);
```

- [ ] **Step 4: Verify in the browser**

Run: `npm run dev`

- `http://localhost:5173/doctors/cardiology` → lands on `/our-doctors?specialty=cardiology`, the Specializations select shows "Cardiology", and results are filtered
- `http://localhost:5173/doctors` → lands on `/our-doctors`, no filter applied
- `http://localhost:5173/doctors/not-a-real-specialty` → lands on `/our-doctors` unfiltered, no crash
- `http://localhost:5173/doctors/eye-ophthalmology` → matches "Eye / Ophthalmology" and filters correctly

- [ ] **Step 5: Run lint**

Run: `npm run lint`
Expected: no new problems beyond the baseline (218 before Task 5, 219 after)

- [ ] **Step 6: Commit**

```bash
git add src/components/SpecialtyRedirect.jsx src/components/DoctorSearch.jsx
git commit -m "feat: redirect specialty folder paths to filtered doctor search"
```

---

## Task 10: Sitemap and Robots

**Files:**
- Create: `scripts/generate-sitemap.mjs`
- Create: `public/robots.txt`
- Create: `public/sitemap.xml` (generated, committed)
- Modify: `package.json`

**Interfaces:**
- Consumes: `buildDoctorPath` from `../src/utils/doctorUrl.js`
- Produces: nothing.

The project has no `public/` directory yet; Vite serves its contents from the site root. `.gitignore` covers `node_modules/`, `dist/`, and `.env` only, so `public/` is tracked by default — which is required, because the build's fallback depends on a previous `sitemap.xml` existing in a fresh checkout.

- [ ] **Step 1: Create `public/robots.txt`**

```
User-agent: *
Allow: /
Disallow: /patient_portal

Sitemap: https://www.populardiagnostic.com/sitemap.xml
```

- [ ] **Step 2: Write the generator**

Create `scripts/generate-sitemap.mjs`:

```js
#!/usr/bin/env node
// Emits public/sitemap.xml from the live doctor list.
// Failure is non-fatal: a flaky API must never block a deploy.

import { writeFile, mkdir } from "node:fs/promises";
import { buildDoctorPath } from "../src/utils/doctorUrl.js";

const SITE_URL = process.env.VITE_SITE_URL || "https://www.populardiagnostic.com";
const BASE_URL = process.env.VITE_BASE_URL || "https://api.populardiagnostic.com";
const TOKEN = process.env.VITE_API_TOKEN;

const STATIC_PATHS = [
  "/", "/our-doctors", "/our-branches", "/sample-collection", "/about",
  "/tech", "/goals", "/director", "/chairman", "/dmd", "/hotlines",
  "/notice", "/video", "/contact-us", "/health", "/gallery",
  "/terms&conditions", "/privacy&policy", "/refund",
  "/shantinagar", "/shyamoli", "/mirpur", "/uttarasector4", "/bogura",
  "/rangpur", "/badda", "/barishal", "/chattogram", "/dhanmondi",
  "/dinajpur", "/englishRoad", "/gazipur", "/jatrabari", "/khulna",
  "/kushtia", "/mymensingh", "/narayangonj", "/noakhali", "/rajshahi",
  "/savar", "/uttarasector13",
];

const escapeXml = (value) =>
  String(value).replace(/[<>&'"]/g, (char) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[char])
  );

const urlEntry = (path, changefreq, priority) =>
  `  <url>\n` +
  `    <loc>${escapeXml(SITE_URL + path)}</loc>\n` +
  `    <changefreq>${changefreq}</changefreq>\n` +
  `    <priority>${priority}</priority>\n` +
  `  </url>`;

const main = async () => {
  if (!TOKEN) throw new Error("VITE_API_TOKEN is not set");

  const fetchPage = async (page) => {
    const res = await fetch(`${BASE_URL}/api/doctors?token=${TOKEN}&page=${page}`);
    if (!res.ok) throw new Error(`page ${page}: HTTP ${res.status}`);
    return res.json();
  };

  const first = await fetchPage(1);
  const lastPage = first.data.last_page;
  const expectedTotal = first.data.total;
  const doctors = [...first.data.data];

  // Same guard as scripts/verify-seo.mjs, and it matters more here: an
  // unreadable last_page makes `2 <= undefined` false, the loop never runs, and
  // this script would overwrite the committed 3,400-URL sitemap with a ~50-URL
  // one — silently de-indexing the site. Throwing is safe: the try/catch below
  // converts it to a warning, and the existing sitemap is left untouched.
  if (!Number.isInteger(lastPage) || lastPage < 1) {
    throw new Error(`unusable last_page from API: ${JSON.stringify(lastPage)}`);
  }

  for (let page = 2; page <= lastPage; page += 1) {
    const body = await fetchPage(page);
    doctors.push(...body.data.data);
  }

  if (Number.isInteger(expectedTotal) && doctors.length !== expectedTotal) {
    throw new Error(`collected ${doctors.length} doctors, API reports ${expectedTotal}`);
  }

  const entries = [
    ...STATIC_PATHS.map((path) =>
      urlEntry(path, "weekly", path === "/" ? "1.0" : "0.8")
    ),
    ...doctors.map((doctor) => urlEntry(buildDoctorPath(doctor), "weekly", "0.7")),
  ];

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${entries.join("\n")}\n</urlset>\n`;

  await mkdir("public", { recursive: true });
  await writeFile("public/sitemap.xml", xml, "utf8");
  console.log(`Wrote public/sitemap.xml with ${entries.length} URLs.`);
};

try {
  await main();
} catch (error) {
  console.warn(`Sitemap generation skipped: ${error.message}`);
  console.warn("Keeping the existing public/sitemap.xml.");
}
```

The script exits 0 even on failure, so it cannot break a deploy.

- [ ] **Step 3: Wire it into `package.json`**

Change the `build` script and add `sitemap`:

```json
"sitemap": "node --env-file=.env scripts/generate-sitemap.mjs",
"build": "node --env-file-if-exists=.env scripts/generate-sitemap.mjs && vite build"
```

**`engines.node` must be raised from `"20.x"` to `">=20.12.0"` as part of this step.**
`--env-file-if-exists` landed in Node 20.12; on 20.0–20.11 Node rejects the unknown
flag and exits before the script's own error handling can run, so `&&` blocks
`vite build` — the precise failure this flag was chosen to avoid. The existing
`"20.x"` range permits those versions.

The `build` variant uses `--env-file-if-exists` because `.env` is gitignored and will
be absent in a fresh CI checkout — plain `--env-file` would abort Node before the
script's own error handling could run, and `&&` would then block the build. With
`--env-file-if-exists`, a missing `.env` surfaces as a missing token *inside* the
script, which the `try/catch` converts to a warning and a zero exit. `&&` is
therefore safe and cross-platform.

The standalone `sitemap` script keeps plain `--env-file` — when run by hand, a
missing `.env` should be a hard error.

- [ ] **Step 4: Generate and inspect**

Run: `npm run sitemap`

Expected: `Wrote public/sitemap.xml with 3427 URLs.` (3,386 doctors + 41 static paths)

Then verify it is well-formed and correctly shaped:

```bash
head -12 public/sitemap.xml
grep -c "<loc>" public/sitemap.xml
grep -c "doctordetail" public/sitemap.xml || echo "no legacy URLs (correct)"
python3 -c "import xml.dom.minidom;xml.dom.minidom.parse('public/sitemap.xml');print('valid XML')"
```

- [ ] **Step 5: Confirm both files are served**

Run: `npm run build && npm run preview`

Open `http://localhost:4173/robots.txt` and `http://localhost:4173/sitemap.xml` — both must return content, not the SPA shell.

- [ ] **Step 6: Commit**

```bash
git add scripts/generate-sitemap.mjs public/robots.txt public/sitemap.xml package.json
git commit -m "feat: generate sitemap.xml and add robots.txt"
```

---

## Task 11: Baseline Metadata and Final Verification

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: nothing.
- Produces: nothing.

`index.html` has no `<meta name="description">` at all. These static tags are the fallback for every route and the only tags social crawlers can currently see.

> **No static `<link rel="canonical">` here — deliberately.** `react-helmet-async`
> removes only tags it created: `updateTags` queries
> `headElement.querySelectorAll(`${type}[data-rh]`)`
> (`node_modules/react-helmet-async/lib/index.esm.js:473`), so tags already present in
> `index.html` are never replaced, only supplemented. A static canonical would therefore
> coexist with `DoctorDetail`'s per-doctor canonical, giving every doctor page two
> conflicting `rel=canonical` links — and Google discards canonicalization hints
> entirely when it sees more than one. That would defeat the purpose of this project.
> `<title>` is the one exception: `updateTitle` assigns `document.title` directly, so
> Helmet does override the static title.
>
> The duplicate `<meta name="description">` on doctor pages is accepted: multiple
> descriptions are untidy but carry no penalty, and the static one is the only
> description social crawlers (which never execute JS) can see.
>
> **No static `og:url` either, for a sharper reason.** The same non-replacement
> behavior means a static `og:url` would be the *only* one a social crawler ever sees
> on a doctor page — and Facebook uses `og:url` as the link object's canonical
> identity, so every shared doctor card would resolve back to the site root. Omitting
> it makes crawlers fall back to the URL they actually fetched, which is the doctor's
> own page. Omission is strictly better than a wrong value here.
>
> **Known limitation, recorded honestly:** `og:title`, `og:description`, `og:type`,
> `og:site_name`, and `twitter:card` are still duplicated between `index.html` and
> `DoctorDetail`'s Helmet block. Social crawlers see only the static, generic set, so
> doctor-page link previews stay generic until the HTML is prerendered. That is the
> pre-existing SSR limitation in Post-Merge Follow-Up #2, not something `index.html`
> can solve — but it should not be described as "no duplication".

- [ ] **Step 1: Add baseline tags to `index.html`**

Immediately before the existing `<title>` line, insert:

```html
    <meta name="description" content="Popular Diagnostic Centre Limited — Bangladesh's trusted diagnostic and healthcare network. Find specialist doctors, chamber schedules, diagnostic services, and book appointments across 22 branches." />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Popular Diagnostic Centre" />
    <meta property="og:title" content="Popular Diagnostic Centre Ltd." />
    <meta property="og:description" content="Find specialist doctors, chamber schedules, and diagnostic services across 22 branches in Bangladesh." />
    <meta name="twitter:card" content="summary_large_image" />
```

- [ ] **Step 2: Run the full test suite**

Run: `npm test`
Expected: all unit tests pass

- [ ] **Step 3: Re-run live verification**

Run: `npm run verify:seo`
Expected: `Unique paths: 3386 / 3386` and `All SEO assertions passed.`

- [ ] **Step 4: Run lint and build**

Run: `npm run lint && npm run build`
Expected: no new lint problems beyond the baseline (219 from Task 5 onward); build succeeds

- [ ] **Step 5: Final manual pass**

Run: `npm run preview`

- [ ] `/doctordetail/2094` redirects to the canonical URL
- [ ] `/doctors/wrong/wrong/2094` self-corrects
- [ ] Back button works after a redirect (no loop)
- [ ] `/doctors/cardiology` lands on filtered search results
- [ ] `/doctors` lands on unfiltered search results
- [ ] Two different doctor pages have different `<title>` and `<meta name="description">`
- [ ] `/doctors/x/y/999999999` renders not-found with `robots: noindex, follow`
- [ ] `/robots.txt` and `/sitemap.xml` both serve
- [ ] No doctor's `mobile` value appears in any JSON-LD block

- [ ] **Step 6: Validate structured data externally**

Paste the rendered HTML of one doctor page into the
[Rich Results Test](https://search.google.com/test/rich-results).
Expected: `Physician` and `BreadcrumbList` both detected with no errors.

- [ ] **Step 7: Commit**

```bash
git add index.html
git commit -m "feat: add baseline site metadata to index.html"
```

---

## Post-Merge Follow-Ups

Not part of this plan. Recorded so they are not lost:

1. **CloudFront Function for true 301 redirects** on `/doctordetail/*`. The JS redirect is a soft redirect and passes link equity more weakly. Add once the new URLs are proven stable.
2. **Prerendering or SSR.** The HTML shell is still empty, so social crawlers see none of the metadata added here and Google is doing all the work through JS rendering. This is the largest remaining SEO constraint.
3. **Specialty landing pages** for all 73 specialties. `/doctors/cardiology` currently redirects; a real page targeting "cardiologist in Dhaka" would likely outrank any individual doctor page.
4. **Resubmit the sitemap** in Google Search Console after deploy, and monitor Coverage for soft-404 reports on the new URL pattern.

---

# Addendum — Heading Structure, Expanded Schema, and FAQ

Added 2026-07-25 after the original 11 tasks merged, at the user's request:
H1 `Dr. [Name]`, H2 `[Specialty] & [Subspecialty] in [City]`, and schema
`Physician + Person + MedicalOrganization + Breadcrumb + FAQ`.

## Data findings that shape these tasks

| Finding | Measured |
|---|---|
| Doctors with a second specialty | **213 of 3,386 (6%)** — the `&` clause is the exception |
| Names with no `Dr` token | **58** — of which **27 are genuinely non-physician** (Nutritionist 19, Dietician 4, Food & Nutrition 3, Physiotherapy 1) |
| API branch names | **27**, of which `branches.js` resolves only **21** → 507 doctors (15%) get no city |
| Existing `<h1>` count on a doctor page | **2** — `doctor.name` (line 301) and `experience_summery` (line 412) |

Unmapped branch names and their causes: `Barisal` (spelled `Barishal`), `Cumilla`
(spelled `Comilla`), `Uttara Jashim Uddin (Sector-04)`, `Uttara Garib E Newaz (Sector-13)`
(**contains a non-breaking space, U+00A0**), `Uttara (U-2)`, and `Kurigram` (absent from
`branches.js` entirely).

## Binding constraint for these tasks

**`src/constants/branches.js` MUST NOT be imported by `doctorUrl.js` or `doctorSeo.js`.**
It imports from `src/assets`, a directory import that plain Node cannot resolve — importing
it would break `npm test` and `scripts/generate-sitemap.mjs`, both of which import the utils
outside Vite. The branch→city map must be a standalone literal in the utils.

---

## Task 12: Heading structure

**Files:** Create `src/utils/branchCity.js`; modify `src/utils/doctorSeo.js`,
`src/utils/doctorSeo.test.js`, `src/components/DoctorDetail.jsx`.

**Produces:** `cityForBranch(branchName) => string`, `displayName(doctor) => string`,
`doctorHeadline(doctor) => string`

1. **`src/utils/branchCity.js`** — a standalone map covering **all 27** API branch names,
   normalizing on lowercase-alphanumeric so the non-breaking space and `(Sector-13)` style
   suffixes fold away. No imports.
2. **`displayName(doctor)`** — returns the name with `Dr. ` prepended **only when** the name
   contains no professional title token (`dr`, `prof`, `professor`, `assoc`, `asso`, `assis`,
   `asst`, `asstt`, `assistant`, `consultant`, `nutritionist`, `dietician`) **and** the primary
   specialty is not in `NON_PHYSICIAN_SPECIALTIES` = `Nutritionist`, `Dietician`,
   `Food & Nutrition`, `Physiotherapy Department`. Otherwise returns the name unchanged.
3. **`doctorHeadline(doctor)`** — `{specialty} & {subspecialty} in {city}`, degrading to
   `{specialty} in {city}` (94% of records), then `{specialty}`, then `Specialist`.
4. **`DoctorDetail.jsx`** — `<h1>{displayName(doctor)}</h1>`; the `<h3>` at line 304 becomes
   `<h2>{doctorHeadline(doctor)}</h2>` keeping its existing classes; the second `<h1>` at
   line 412 (`experience_summery`) becomes a `<p>` — prose is not a heading, and two H1s
   dilute the page's primary signal.

## Task 13: Expanded structured data

**Files:** modify `src/utils/doctorSeo.js`, `src/utils/doctorSeo.test.js`,
`src/components/DoctorDetail.jsx`.

Replace the two separate JSON-LD blocks with **one `@graph`** containing four `@id`-linked
nodes, so the entities reference each other rather than duplicating:

- `MedicalOrganization` — `@id: {origin}/#organization`, the PDCL entity itself
- `Physician` — `@id: {url}#physician`, `worksFor: {"@id": ".../#organization"}`
- `Person` — `@id: {url}#person`, `jobTitle` from the specialty, `worksFor` the organization
- `BreadcrumbList` — unchanged content, folded into the graph

`telephone` still comes from `branches[0].phone`, never `doctor.mobile`. All output still
passes through `jsonLdScript()`.

## Task 14: FAQ section and FAQPage markup

**Files:** modify `src/utils/doctorSeo.js`, `src/utils/doctorSeo.test.js`,
`src/components/DoctorDetail.jsx`.

`FAQPage` markup requires the Q&A to be **visibly rendered on the page** — marking up
questions that do not appear is a structured-data policy violation. So this task ships a
visible FAQ section first, and marks up exactly what it renders.

`doctorFaq(doctor)` returns `[{question, answer}]` built only from data already present:
chamber schedule, branch and address, specialty, and the appointment hotline. Entries whose
source data is missing are omitted rather than rendered with placeholder text — so the
markup and the DOM always agree.

The component renders the list visibly, and `faqJsonLd` marks up **the same array**.
