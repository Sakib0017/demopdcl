# About Page Variants Implementation Plan — Three Concept Pages

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the three About-page redesign concepts as three NEW, coexisting pages — `/about1` (The Ledger), `/about2` (The Instrument), `/about3` (The Gallery) — so they can be compared live; the existing `/about` stays untouched.

**Architecture:** A shared data hook (`useManagementTeam`) and shared band helpers (`utils/leadership.js`) feed three new page components (`AboutLedger.jsx`, `AboutInstrument.jsx`, `AboutGallery.jsx`), each with its own namespaced CSS block appended to `src/index.css` (`ldg-*`, `dgx-*`, `gal-*` — same pattern as the existing `lg-*` system). Each page is barrel-exported and lazy-routed via the existing `lazyLoad()` helper in `src/main.jsx`. No API, dependency, or existing-page changes.

**Tech Stack:** React 18 (JSX only), Vite, Tailwind CSS, Framer Motion, existing `legacyApi` axios instance.

**Visual reference:** Mockups of all three directions (and the current page) are in the design artifact "PDCL About — Three Redesign Directions" (https://claude.ai/code/artifact/ceab2870-c628-4955-a699-1cd08c5ca2af).

## Global Constraints

- **All three tracks get built** (this replaces the earlier pick-one plan). Tracks A/B/C are independent — any order, and each is fully working on its own. Task 0 and Task 1 come first.
- **`/about` and `About.jsx` are NOT touched.** The `lg-*` CSS block stays. Consolidation happens only after a winner is chosen (see "Post-decision follow-up" at the end).
- **Page ↔ concept mapping:** `/about1` = AboutLedger, `/about2` = AboutInstrument, `/about3` = AboutGallery. These are comparison pages: reachable by URL only, deliberately NOT added to Navbar/Sidemenu.
- **JavaScript only** — no TypeScript, files are `.jsx`/`.js`.
- **No new dependencies** — serif and mono faces use system stacks (`Georgia, "Iowan Old Style", "Times New Roman", serif` / `ui-monospace, "SF Mono", Menlo, Consolas, monospace`). Ubuntu stays via existing `@fontsource/ubuntu`.
- **Brand theme:** every page sits on a light, green-cast/white ground with PDCL greens (`#006642`, `#00984a`, `#01DF74` accents only). No dark canvases.
- **API calls only via `legacyApi`** — the shared hook wraps the exact fetch About.jsx uses today.
- **Route pattern:** components are barrel-exported from `src/components/index.js` and lazy-loaded in `src/main.jsx` via `lazyLoad("ComponentName")`, route added next to the existing `/about` entry (`src/main.jsx:124`).
- **Lint gate:** `npm run lint` must pass with 0 warnings after every task. Because `no-unused-vars` warns, each task only adds imports/helpers it actually uses — the tasks below stagger imports accordingly; follow them exactly.
- **Verification is visual:** no test framework exists in this repo. Each task verifies via ESLint + the running dev server (`npm run dev`, pages at `http://localhost:5173/about1|about2|about3`).
- **Reduced motion:** every animation must be disabled or simplified when `useReducedMotion()` returns true (JSX) or `prefers-reduced-motion: reduce` matches (CSS).
- **Git hygiene:** the user runs parallel feature work in this tree. Stage ONLY the files this plan touches. NEVER `git add -A` or `git add .`.
- **Real content only:** names/designations come from the API. Static copy (headlines, intros, fact values) is specified verbatim in the tasks below.

## Context: what the existing About page provides (for reference, not modification)

`src/components/About.jsx` renders the current `/about`: hero → executive ribbon cascade → four rank bands. Its data contract, reproduced by the shared hook in Task 1: `legacyApi.get("/api/management-team")` → `rows["Row - 1"].slice(0, 3)` as executives, rows 2–4 pooled as `rest`; members are `{ _id, name, designation, image }`. Its band logic (`BANDS`, `bandOf`) and `getInitials` fallback are extracted (copied, not moved) into `src/utils/leadership.js` so About.jsx keeps working unchanged.

---

## Task 0 (shared): Branch + preconditions

**Files:**
- No source changes. Git only.

- [ ] **Step 1: Confirm a clean slate for the files this plan touches**

Run: `git -C UpdatedFrontend status --porcelain -- src/main.jsx src/components/index.js src/index.css`
Expected: no output. If there IS output, stop and ask the user — they run parallel features in this tree.

- [ ] **Step 2: Create the branch**

```bash
git -C UpdatedFrontend checkout -b about-variants
```

- [ ] **Step 3: Start the dev server (if not already running)**

```bash
cd UpdatedFrontend && npm run dev
```

Confirm `http://localhost:5173/about` renders (baseline sanity — this page must look identical at the end).

- [ ] **Step 4: Commit the plan document**

```bash
git -C UpdatedFrontend add docs/superpowers/plans/2026-07-14-about-page-redesign.md
git -C UpdatedFrontend commit -m "docs: plan three About concept pages (/about1 /about2 /about3)"
```

---

## Task 1 (shared): Leadership utils + `useManagementTeam` hook

**Files:**
- Create: `src/utils/leadership.js`
- Create: `src/hooks/useManagementTeam.js`

**Interfaces:**
- Consumes: `legacyApi` from `src/services/api/legacyApi.js`.
- Produces: named exports `BANDS` (array of `{ key, label }`), `bandOf(designation) → "advisory"|"gm"|"heads"|"managers"`, `getInitials(name) → string`; hook `useManagementTeam() → { data: { exec: [], rest: [] }, loading: boolean, error: string|null }`. ALL three tracks import these.

- [ ] **Step 1: Create `src/utils/leadership.js`**

```js
// Band definitions and helpers shared by the About page variants.
// Copied from About.jsx (which keeps its own inline copies untouched);
// consolidate after a winning variant is promoted.
export const BANDS = [
  { key: "advisory", label: "Advisory" },
  { key: "gm", label: "General Management" },
  { key: "heads", label: "Departmental Heads" },
  { key: "managers", label: "Management" },
];

// Sort a person into a band from their designation. Deputy General Managers
// each head a department, so they sit with the other departmental heads.
export const bandOf = (designation = "") => {
  if (/advis/i.test(designation)) return "advisory";
  if (/general\s+manager/i.test(designation) && !/deputy/i.test(designation)) return "gm";
  if (/deputy\s+general\s+manager/i.test(designation) || /\bhead\b/i.test(designation)) return "heads";
  return "managers";
};

// Initials for the graceful fallback when a portrait fails to load.
export const getInitials = (name = "") =>
  name
    .replace(/\(.*?\)/g, "")
    .trim()
    .split(/\s+/)
    .filter((w) => !/^(dr\.?|mr\.?|mrs\.?|ms\.?|md\.?|late)$/i.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
```

- [ ] **Step 2: Create `src/hooks/useManagementTeam.js`**

```js
import { useState, useEffect } from "react";
import { legacyApi } from "../services/api/legacyApi";

// Fetches the management team and splits it into the three executives
// (Row - 1) and the pooled remainder (Rows 2-4) — the same contract
// About.jsx uses inline.
export const useManagementTeam = () => {
  const [data, setData] = useState({ exec: [], rest: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await legacyApi.get("/api/management-team");
        const rows = response.data?.data ?? {};
        if (!active) return;
        setData({
          exec: rows["Row - 1"]?.slice(0, 3) || [],
          rest: [
            ...(rows["Row - 2"] || []),
            ...(rows["Row - 3"] || []),
            ...(rows["Row - 4"] || []),
          ],
        });
      } catch {
        if (active) setError("We couldn't load the leadership team right now. Please try again.");
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchData();
    return () => {
      active = false;
    };
  }, []);

  return { data, loading, error };
};
```

- [ ] **Step 3: Verify**

Run: `npm run lint` — Expected: passes, 0 warnings. (The hook is exercised end-to-end by each track's first task.)

- [ ] **Step 4: Commit**

```bash
git -C UpdatedFrontend add src/utils/leadership.js src/hooks/useManagementTeam.js
git -C UpdatedFrontend commit -m "feat(about-variants): shared leadership utils and useManagementTeam hook"
```

---
---

# TRACK A — `/about1` · AboutLedger (The Ledger: heritage annual report)

Green-cast paper (brand-neutral, not warm ivory), deep green ink, serif display, hairline rules, duotone portraits, roman-numeral executive plates, band members in ruled register rows with folio numbers. Calmest motion of the three.

**Palette:** paper `#f5f8f5` · ink `#17251e` · PDCL green `#006642` · rule `#c2d1c5` · soft rule `#d8e2da` · muted `#67766c` / `#78877d` · numeral `#9fb3a5` · duotone plate `#1d5c42`.

### Task A1: Page scaffold — CSS tokens, masthead hero, route

**Files:**
- Modify: `src/index.css` (append at end of file)
- Create: `src/components/AboutLedger.jsx`
- Modify: `src/components/index.js` (barrel import + export)
- Modify: `src/main.jsx` (lazy const + route)

**Interfaces:**
- Consumes: `useManagementTeam`, `getInitials` (Task 1).
- Produces: page at `/about1`; CSS `ldg-serif`, `ldg-dropcap`, `ldg-duo`, `ldg-skeleton`; components `Rule({ double, reduce })`, `LedgerPortrait({ image, name, designation, textClass })`, `Masthead({ total, loading, reduce })` used by A2–A3.

- [ ] **Step 1: Append the `ldg-*` block to `src/index.css`**

```css
/* ============================================================
   About variant 1 — The Ledger (ldg-*)
   Heritage annual-report treatment: green-cast paper, deep
   green ink, serif display, hairline rules, duotone portraits.
   ============================================================ */
.ldg-serif {
  font-family: Georgia, "Iowan Old Style", "Times New Roman", serif;
}

.ldg-dropcap::first-letter {
  font-family: Georgia, "Iowan Old Style", "Times New Roman", serif;
  float: left;
  font-size: 3.1em;
  line-height: 0.85;
  padding: 0.05em 0.12em 0 0;
  color: #006642;
}

/* Duotone portrait plate: grayscale photo takes the hue of the
   deep-green backdrop via luminosity blending. */
.ldg-duo {
  position: relative;
  overflow: hidden;
  background: #1d5c42;
}
.ldg-duo img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  object-position: top;
  filter: grayscale(1) contrast(1.05);
  mix-blend-mode: luminosity;
}

.ldg-skeleton {
  background: linear-gradient(90deg, #e6eee8 25%, #f0f5f1 50%, #e6eee8 75%);
  background-size: 200% 100%;
  animation: ldg-shimmer 1.6s linear infinite;
}
@keyframes ldg-shimmer {
  to { background-position: -200% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .ldg-skeleton { animation: none; }
}
```

- [ ] **Step 2: Create `src/components/AboutLedger.jsx`**

```jsx
import "@fontsource/ubuntu";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useManagementTeam } from "../hooks/useManagementTeam";
import { getInitials } from "../utils/leadership";

const ROMANS = ["I.", "II.", "III."];

const Rule = ({ double = false, reduce }) => (
  <motion.div
    initial={reduce ? false : { scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
    style={{ transformOrigin: "left" }}
    className={double ? "border-t-[3px] border-double border-[#17251e]" : "h-px bg-[#c2d1c5]"}
  />
);

const LedgerPortrait = ({ image, name, designation, textClass = "text-3xl" }) => {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="ldg-duo aspect-[4/5] w-full rounded-sm">
      {imgError || !image ? (
        <div className="flex h-full w-full items-center justify-center">
          <span className={`ldg-serif ${textClass} tracking-wide text-[#e9f2ec]`}>{getInitials(name)}</span>
        </div>
      ) : (
        <img
          src={image}
          alt={`${name}, ${designation}`}
          onError={() => setImgError(true)}
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
};

const LEDGER_FACTS = (total, loading) => [
  ["1983", "Established"],
  ["24+", "Branches"],
  [loading ? "—" : String(total).padStart(2, "0"), "Leaders listed"],
  ["4", "Decades of service"],
];

const Masthead = ({ total, loading, reduce }) => (
  <header
    className="relative px-4 sm:px-6 lg:px-8"
    style={{ paddingTop: "max(4.5rem, env(safe-area-inset-top))" }}
  >
    <div className="mx-auto max-w-4xl">
      <Rule double reduce={reduce} />
      <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 font-ubuntu text-[10px] uppercase tracking-[0.22em] text-[#006642] sm:text-[11px]">
        <span>Popular Diagnostic Centre Ltd.</span>
        <span>Register of Leadership · Est. 1983</span>
      </div>
      <motion.h1
        initial={reduce ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
        className="ldg-serif mt-10 max-w-[15ch] text-4xl font-medium leading-[1.05] text-[#17251e] sm:text-6xl"
      >
        Forty years, <em className="italic text-[#006642]">kept in trust.</em>
      </motion.h1>
      <p className="ldg-dropcap mt-7 max-w-[58ch] text-[15px] leading-[1.75] text-[#3c4a42] sm:text-base">
        Since a single centre opened its doors in Dhanmondi in 1983, Popular Diagnostic Centre has
        grown into a nationwide diagnostic network. This register records the people entrusted with
        that responsibility.
      </p>
      <div className="mt-9 grid grid-cols-2 border-y border-[#c2d1c5] sm:grid-cols-4">
        {LEDGER_FACTS(total, loading).map(([value, label], i) => (
          <div
            key={label}
            className={
              "border-[#c2d1c5] px-4 py-3.5 sm:px-5" +
              (i % 2 === 0 ? " border-r" : "") +
              (i < 3 ? " sm:border-r" : "")
            }
          >
            <b className="ldg-serif block text-xl font-medium text-[#17251e] sm:text-2xl">{value}</b>
            <span className="font-ubuntu text-[9px] uppercase tracking-[0.18em] text-[#78877d] sm:text-[10px]">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  </header>
);

const AboutLedger = () => {
  const { data, loading, error } = useManagementTeam();
  const reduce = useReducedMotion();

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f8f5] px-4">
        <div className="max-w-md border-y-[3px] border-double border-[#17251e] py-10 text-center">
          <p className="ldg-serif text-lg text-[#17251e]">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="ldg-serif mt-6 border-b border-[#006642] pb-0.5 text-base italic text-[#006642] transition-opacity hover:opacity-70"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#f5f8f5] pb-12">
      <Masthead total={data.exec.length + data.rest.length} loading={loading} reduce={reduce} />
      <div style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }} />
    </div>
  );
};

AboutLedger.displayName = "AboutLedger";

export default AboutLedger;
```

- [ ] **Step 3: Wire barrel + route**

In `src/components/index.js`: below `import About from "./About";` (line 5) add:

```js
import AboutLedger from "./AboutLedger";
```

and in the export object, below the `About,` entry (line 98) add:

```js
  AboutLedger,
```

In `src/main.jsx`: below `const About = lazyLoad("About");` (line 64) add:

```js
const AboutLedger = lazyLoad("AboutLedger");
```

and below the `{ path: "/about", element: <About /> },` route (line 124) add:

```js
{ path: "/about1", element: <AboutLedger /> },
```

- [ ] **Step 4: Verify**

Run: `npm run lint` — Expected: 0 warnings.
Open `http://localhost:5173/about1` — Expected: pale green-cast paper page with navbar/footer intact; double rule draws in; serif headline "Forty years, kept in trust." with green italic; drop-cap intro; 4-cell fact row ("Leaders listed" shows 14 after data loads, "—" while loading). Confirm `http://localhost:5173/about` is unchanged.

- [ ] **Step 5: Commit**

```bash
git -C UpdatedFrontend add src/components/AboutLedger.jsx src/components/index.js src/main.jsx src/index.css
git -C UpdatedFrontend commit -m "feat(about1): ledger page scaffold — tokens, masthead hero, route"
```

### Task A2: Executive plates

**Files:**
- Modify: `src/components/AboutLedger.jsx`

**Interfaces:**
- Consumes: `LedgerPortrait`, `ROMANS` (A1); `data.exec`, `loading`, `reduce`.
- Produces: `ChapterHead({ title, chapter, count })` (reused by A3), `ExecPlate({ member, index, reduce })`, `ExecPlateSkeleton()`.

- [ ] **Step 1: Add the components (below `Masthead`)**

```jsx
const ChapterHead = ({ title, chapter, count }) => (
  <div className="mt-14 flex items-baseline justify-between gap-4 border-b-2 border-[#17251e] pb-2.5">
    <h2 className="ldg-serif text-lg font-medium text-[#17251e] sm:text-xl">{title}</h2>
    <span className="whitespace-nowrap font-ubuntu text-[9px] uppercase tracking-[0.2em] text-[#78877d] sm:text-[10px]">
      Chapter {String(chapter).padStart(2, "0")} · {String(count).padStart(2, "0")} members
    </span>
  </div>
);

const ExecPlate = ({ member, index, reduce }) => (
  <motion.div
    initial={reduce ? false : { opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
    className="grid grid-cols-[44px_120px_1fr] items-center gap-5 border-b border-[#c2d1c5] py-8 sm:grid-cols-[64px_200px_1fr] sm:gap-7"
  >
    <span className="ldg-serif text-xl italic text-[#9fb3a5] sm:text-2xl">
      {ROMANS[index] || `${index + 1}.`}
    </span>
    <LedgerPortrait {...member} />
    <div>
      <h3 className="ldg-serif text-2xl font-medium leading-tight text-[#17251e] sm:text-3xl">
        {member.name}
      </h3>
      <p className="mt-2 font-ubuntu text-[10px] uppercase tracking-[0.24em] text-[#006642] sm:text-[11px]">
        {member.designation}
      </p>
    </div>
  </motion.div>
);

const ExecPlateSkeleton = () => (
  <div className="grid grid-cols-[44px_120px_1fr] items-center gap-5 border-b border-[#c2d1c5] py-8 sm:grid-cols-[64px_200px_1fr] sm:gap-7">
    <span />
    <div className="ldg-skeleton aspect-[4/5] w-full rounded-sm" />
    <div>
      <div className="ldg-skeleton h-6 w-2/3 rounded-full" />
      <div className="ldg-skeleton mt-3 h-3 w-1/3 rounded-full" />
    </div>
  </div>
);
```

- [ ] **Step 2: Render the executive chapter** — in the main return of `AboutLedger`, insert after `<Masthead …/>`:

```jsx
<section className="px-4 sm:px-6 lg:px-8">
  <div className="mx-auto max-w-4xl">
    <ChapterHead title="Executive Leadership" chapter={1} count={loading ? 3 : data.exec.length} />
    {loading
      ? [0, 1, 2].map((i) => <ExecPlateSkeleton key={i} />)
      : data.exec.map((m, i) => <ExecPlate key={m._id || i} member={m} index={i} reduce={reduce} />)}
  </div>
</section>
```

- [ ] **Step 3: Verify** — `npm run lint` (0 warnings). Browser at `/about1`: three ruled plates — roman numeral, duotone green portrait, large serif name, letterspaced green role; skeleton plates on a hard refresh before data lands.

- [ ] **Step 4: Commit**

```bash
git -C UpdatedFrontend add src/components/AboutLedger.jsx
git -C UpdatedFrontend commit -m "feat(about1): executive plates"
```

### Task A3: Register bands + skeletons

**Files:**
- Modify: `src/components/AboutLedger.jsx`

**Interfaces:**
- Consumes: `ChapterHead`, `LedgerPortrait` (A1/A2); `BANDS`, `bandOf` (Task 1).
- Produces: `RegisterRow({ member, no, reduce })`, `RegisterRowSkeleton()`; completes the page.

- [ ] **Step 1: Extend the utils import** — change the leadership import line to:

```jsx
import { BANDS, bandOf, getInitials } from "../utils/leadership";
```

- [ ] **Step 2: Add `RegisterRow` and `RegisterRowSkeleton`**

```jsx
const RegisterRow = ({ member, no, reduce }) => (
  <motion.div
    initial={reduce ? false : { opacity: 0, y: 14 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
    className="grid grid-cols-[48px_1fr_auto] items-center gap-4 border-b border-[#d8e2da] py-3.5 sm:grid-cols-[56px_1fr_auto] sm:gap-5"
  >
    <LedgerPortrait {...member} textClass="text-base" />
    <div>
      <h3 className="ldg-serif text-base font-medium text-[#17251e] sm:text-lg">{member.name}</h3>
      <p className="mt-0.5 font-ubuntu text-[9px] uppercase tracking-[0.16em] text-[#78877d] sm:text-[10px]">
        {member.designation}
      </p>
    </div>
    <span className="font-ubuntu text-[10px] tabular-nums text-[#9fb3a5] sm:text-[11px]">
      No. {String(no).padStart(2, "0")}
    </span>
  </motion.div>
);

const RegisterRowSkeleton = () => (
  <div className="grid grid-cols-[48px_1fr_auto] items-center gap-4 border-b border-[#d8e2da] py-3.5 sm:grid-cols-[56px_1fr_auto] sm:gap-5">
    <div className="ldg-skeleton aspect-[4/5] w-full rounded-sm" />
    <div>
      <div className="ldg-skeleton h-4 w-1/2 rounded-full" />
      <div className="ldg-skeleton mt-2 h-2.5 w-1/3 rounded-full" />
    </div>
    <span />
  </div>
);
```

- [ ] **Step 3: Compute numbered chapters and render them**

Inside `AboutLedger`, after the `useReducedMotion()` line, add:

```jsx
const bands = BANDS.map((b) => ({
  ...b,
  members: data.rest.filter((m) => bandOf(m.designation) === b.key),
})).filter((b) => b.members.length > 0);

let ledgerNo = data.exec.length;
const chapters = bands.map((b, i) => {
  const start = ledgerNo + 1;
  ledgerNo += b.members.length;
  return { ...b, chapter: i + 2, start };
});
```

In the main return, insert after the executive section:

```jsx
<section className="px-4 pb-4 sm:px-6 lg:px-8">
  <div className="mx-auto max-w-4xl">
    {loading
      ? [4, 6].map((rows, i) => (
          <div key={i}>
            <div className="ldg-skeleton mt-14 h-8 w-full rounded-sm" />
            {Array.from({ length: rows }).map((_, r) => (
              <RegisterRowSkeleton key={r} />
            ))}
          </div>
        ))
      : chapters.map((c) => (
          <div key={c.key}>
            <ChapterHead title={c.label} chapter={c.chapter} count={c.members.length} />
            {c.members.map((m, i) => (
              <RegisterRow key={m._id || i} member={m} no={c.start + i} reduce={reduce} />
            ))}
          </div>
        ))}
  </div>
</section>
```

- [ ] **Step 4: Verify** — `npm run lint` (0 warnings). Browser at `/about1`: register rows with running folio numbers — Advisory starts at "No. 04" (after 3 execs) and numbering continues across chapters without gaps; headers read "Chapter 02 · 01 members" etc. Error state: temporarily change the endpoint in `useManagementTeam.js` to `/api/management-teamX`, reload `/about1` (double-ruled error card, italic "Try again"), then restore it.

- [ ] **Step 5: Commit**

```bash
git -C UpdatedFrontend add src/components/AboutLedger.jsx
git -C UpdatedFrontend commit -m "feat(about1): register bands with folio numbers"
```

### Task A4: Responsive + reduced-motion audit

**Files:**
- Modify: `src/components/AboutLedger.jsx` (fixes only, if the audit finds issues)

- [ ] **Step 1: Mobile pass** — 360×740 and 320×640: masthead wraps cleanly; fact row is 2×2 with correct internal rules; exec plates keep the 3-column grid without overflow (if 44px is too wide at 320px, drop to `grid-cols-[32px_104px_1fr]` at base); register rows never wrap the folio number; no horizontal scroll.
- [ ] **Step 2: Desktop pass** — 1440×900: line lengths ≤ ~65ch; headline max-width holds; rules span the 4xl container only.
- [ ] **Step 3: Reduced motion** — DevTools → Rendering → emulate `prefers-reduced-motion: reduce`: no rule-draw, no fade-ups (content immediately visible), no skeleton shimmer.
- [ ] **Step 4: Verify + commit any fixes**

```bash
npm run lint
git -C UpdatedFrontend add src/components/AboutLedger.jsx
git -C UpdatedFrontend commit -m "fix(about1): responsive and reduced-motion pass"
```

(Skip the commit if the audit found nothing.)

---
---

# TRACK B — `/about2` · AboutInstrument (The Instrument: clinical precision, light)

The visual language of the lab ON the brand's light theme: green-tinted white canvas with a faint green graph grid, white "specimen plate" cards with green corner ticks, monospace data labels in PDCL green, executives as connected org-chart nodes, bands as labeled report panels, green ECG divider.

**Palette:** ground `#f8fbf9` · grid `rgba(0,152,74,0.07)` · card `#ffffff` · card border `#e0eae3` · green ink `#006642` · accent `#00984a` · headline `text-gray-900` · body `text-gray-600`.

### Task B1: Page scaffold — light canvas, hero, ECG divider, route

**Files:**
- Modify: `src/index.css` (append)
- Create: `src/components/AboutInstrument.jsx`
- Modify: `src/components/index.js`, `src/main.jsx`

**Interfaces:**
- Consumes: `useManagementTeam`, `getInitials` (Task 1).
- Produces: page at `/about2`; CSS `dgx-page`, `dgx-mono`, `dgx-card`, `dgx-scan`, `dgx-dot`, `dgx-ecg-path`, `dgx-panel-card`, `dgx-skeleton`; components `EcgDivider()`, `DgxPortrait({ image, name, designation, small })` used by B2–B3.

- [ ] **Step 1: Append the `dgx-*` block to `src/index.css`**

```css
/* ============================================================
   About variant 2 — The Instrument (dgx-*)
   Clinical-precision treatment on the brand's light theme:
   green-tinted white ground, faint green graph grid, white
   specimen-plate cards, PDCL-green monospace data labels.
   ============================================================ */
.dgx-page {
  background-color: #f8fbf9;
  background-image:
    linear-gradient(rgba(0, 152, 74, 0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 152, 74, 0.07) 1px, transparent 1px);
  background-size: 44px 44px;
}
.dgx-mono {
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
}

/* Specimen plate with crosshair corner ticks */
.dgx-card {
  position: relative;
  border: 1px solid rgba(0, 152, 74, 0.28);
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 18px rgba(0, 102, 66, 0.06);
}
.dgx-card::before,
.dgx-card::after {
  content: "";
  position: absolute;
  width: 14px;
  height: 14px;
  border: 1.5px solid #00984a;
  pointer-events: none;
}
.dgx-card::before {
  top: -1px;
  left: -1px;
  border-right: none;
  border-bottom: none;
  border-radius: 10px 0 0 0;
}
.dgx-card::after {
  bottom: -1px;
  right: -1px;
  border-left: none;
  border-top: none;
  border-radius: 0 0 10px 0;
}

.dgx-scan {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0, 152, 74, 0.25);
  background: linear-gradient(to bottom right, #e7f7ee, #cfead9);
}
.dgx-scan img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  object-position: top;
}
.dgx-scan::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 152, 74, 0.1), transparent 45%);
  pointer-events: none;
}

.dgx-dot {
  box-shadow: 0 0 8px rgba(0, 152, 74, 0.6);
}

/* ECG tracer: a short bright dash cycling along the faint line */
.dgx-ecg-path {
  stroke-dasharray: 60 900;
  animation: dgx-trace 5s linear infinite;
}
@keyframes dgx-trace {
  to { stroke-dashoffset: -960; }
}

.dgx-panel-card {
  border: 1px solid #e0eae3;
  background: #ffffff;
  border-radius: 8px;
  transition: border-color 0.3s, box-shadow 0.3s;
}
.dgx-panel-card:hover {
  border-color: rgba(0, 152, 74, 0.5);
  box-shadow: 0 8px 24px rgba(0, 152, 74, 0.14);
}

.dgx-skeleton {
  background: linear-gradient(90deg, #e6eee8 25%, #f0f5f1 50%, #e6eee8 75%);
  background-size: 200% 100%;
  animation: dgx-shimmer 1.6s linear infinite;
}
@keyframes dgx-shimmer {
  to { background-position: -200% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .dgx-ecg-path { animation: none; stroke-dasharray: none; }
  .dgx-panel-card { transition: none; }
  .dgx-skeleton { animation: none; }
}
```

- [ ] **Step 2: Create `src/components/AboutInstrument.jsx`**

```jsx
import "@fontsource/ubuntu";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useManagementTeam } from "../hooks/useManagementTeam";
import { getInitials } from "../utils/leadership";

const ECG_POINTS = "0,20 240,20 260,20 272,6 284,34 296,12 308,20 560,20 572,26 584,20 800,20";

const EcgDivider = () => (
  <svg viewBox="0 0 800 40" className="mt-9 block h-10 w-full" preserveAspectRatio="none" aria-hidden="true">
    <polyline points={ECG_POINTS} fill="none" stroke="#00984a" strokeWidth="1.5" opacity="0.25" />
    <polyline points={ECG_POINTS} fill="none" stroke="#00984a" strokeWidth="1.5" className="dgx-ecg-path" />
  </svg>
);

const DgxPortrait = ({ image, name, designation, small = false }) => {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="dgx-scan aspect-[4/5] w-full rounded-md">
      {imgError || !image ? (
        <div className="flex h-full w-full items-center justify-center">
          <span className={`dgx-mono font-semibold text-[#00795c] ${small ? "text-lg" : "text-2xl"}`}>
            {getInitials(name)}
          </span>
        </div>
      ) : (
        <img
          src={image}
          alt={`${name}, ${designation}`}
          onError={() => setImgError(true)}
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
};

const InstrumentHero = ({ reduce }) => (
  <header
    className="px-4 sm:px-6 lg:px-8"
    style={{ paddingTop: "max(4.5rem, env(safe-area-inset-top))" }}
  >
    <div className="mx-auto max-w-5xl">
      <div className="dgx-mono flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-[10px] tracking-[0.2em] text-[#006642] sm:text-[11px]">
        <span>PDCL // LEADERSHIP INDEX</span>
        <span>EST. 1983 · 24+ BRANCHES</span>
      </div>
      <motion.h1
        initial={reduce ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
        className="mt-8 max-w-[18ch] font-ubuntu text-3xl font-bold leading-[1.08] tracking-tight text-gray-900 sm:text-5xl"
      >
        Precision has a{" "}
        <span className="bg-gradient-to-r from-[#00b365] to-[#006642] bg-clip-text text-transparent">
          chain of command.
        </span>
      </motion.h1>
      <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-gray-600 sm:text-[15px]">
        Every report we deliver is signed off by a structure built over four decades. This is that
        structure — mapped, connected, accountable.
      </p>
    </div>
    <EcgDivider />
  </header>
);

const AboutInstrument = () => {
  const { error } = useManagementTeam();
  const reduce = useReducedMotion();

  if (error) {
    return (
      <div className="dgx-page flex min-h-screen items-center justify-center px-4">
        <div className="dgx-card max-w-md p-8 text-center">
          <p className="dgx-mono text-[10px] tracking-[0.18em] text-[#006642]">SIGNAL LOST</p>
          <p className="mt-3 font-ubuntu text-base text-gray-800">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="dgx-mono mt-6 rounded-md border border-[#00984a]/50 px-5 py-2 text-[11px] tracking-[0.14em] text-[#006642] transition-colors hover:bg-[#00984a]/10"
          >
            RE-RUN QUERY
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dgx-page relative min-h-screen overflow-x-hidden pb-12">
      <InstrumentHero reduce={reduce} />
      <div style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }} />
    </div>
  );
};

AboutInstrument.displayName = "AboutInstrument";

export default AboutInstrument;
```

Note: the scaffold destructures only `{ error }` from the hook so ESLint stays at 0 warnings; B2 expands it to `{ data, loading, error }` when the constellation consumes them.

- [ ] **Step 3: Wire barrel + route**

In `src/components/index.js`: below `import About from "./About";` add:

```js
import AboutInstrument from "./AboutInstrument";
```

and in the export object, below the `About,` entry add:

```js
  AboutInstrument,
```

In `src/main.jsx`: below `const About = lazyLoad("About");` add:

```js
const AboutInstrument = lazyLoad("AboutInstrument");
```

and below the `{ path: "/about", element: <About /> },` route add:

```js
{ path: "/about2", element: <AboutInstrument /> },
```

- [ ] **Step 4: Verify**

`npm run lint` — 0 warnings. Open `http://localhost:5173/about2`: light green-tinted canvas with faint graph grid, green mono index labels, gray-900 headline with brand gradient on "chain of command.", ECG line with a bright green tracer sweeping repeatedly; reduced-motion emulation stops the tracer. `/about` and `/about1` unaffected.

- [ ] **Step 5: Commit**

```bash
git -C UpdatedFrontend add src/components/AboutInstrument.jsx src/components/index.js src/main.jsx src/index.css
git -C UpdatedFrontend commit -m "feat(about2): instrument page scaffold — light canvas, hero, ECG, route"
```

### Task B2: Executive constellation

**Files:**
- Modify: `src/components/AboutInstrument.jsx`

**Interfaces:**
- Consumes: `DgxPortrait` (B1); `data.exec`, `loading`, `reduce`.
- Produces: `ExecNode({ member, index, reduce })`, `NodeConnector({ reduce })`, `ExecNodeSkeleton()`.

- [ ] **Step 1: Expand the hook destructuring, then add the components (below `InstrumentHero`)**

In `AboutInstrument`, change `const { error } = useManagementTeam();` to:

```jsx
const { data, loading, error } = useManagementTeam();
```

Then add:

```jsx
const NodeConnector = ({ reduce }) => (
  <div className="relative flex justify-center">
    <motion.span
      initial={reduce ? false : { scaleY: 0 }}
      whileInView={{ scaleY: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="block h-9 w-0.5 origin-top bg-gradient-to-b from-[#00984a]/70 to-[#00984a]/20"
      aria-hidden="true"
    />
    <span className="dgx-dot absolute -bottom-1 h-2 w-2 rounded-full bg-[#00984a]" aria-hidden="true" />
  </div>
);

const ExecNode = ({ member, index, reduce }) => (
  <motion.div
    initial={reduce ? false : { opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
    className="dgx-card mx-auto grid w-full max-w-[430px] grid-cols-[80px_1fr] items-center gap-4 p-4 sm:grid-cols-[92px_1fr] sm:gap-5"
  >
    <DgxPortrait {...member} />
    <div>
      <p className="dgx-mono text-[9px] tracking-[0.18em] text-[#006642] sm:text-[10px]">
        EXEC-{String(index + 1).padStart(2, "0")} / {(member.designation || "").toUpperCase()}
      </p>
      <h3 className="mt-1.5 font-ubuntu text-base font-bold text-gray-900 sm:text-lg">{member.name}</h3>
      <p className="dgx-mono mt-2.5 flex items-center gap-2 text-[9px] tracking-[0.14em] text-[#006642] sm:text-[10px]">
        <i className="dgx-dot h-1.5 w-1.5 rounded-full bg-[#00984a]" aria-hidden="true" />
        ACTIVE
      </p>
    </div>
  </motion.div>
);

const ExecNodeSkeleton = () => (
  <div className="dgx-card mx-auto grid w-full max-w-[430px] grid-cols-[80px_1fr] items-center gap-4 p-4 sm:grid-cols-[92px_1fr] sm:gap-5">
    <div className="dgx-skeleton aspect-[4/5] w-full rounded-md" />
    <div>
      <div className="dgx-skeleton h-3 w-1/2 rounded-full" />
      <div className="dgx-skeleton mt-3 h-5 w-2/3 rounded-full" />
    </div>
  </div>
);
```

- [ ] **Step 2: Render the constellation** — in the main return, insert after `<InstrumentHero …/>`:

```jsx
<section className="px-4 pt-10 sm:px-6 lg:px-8">
  <div className="mx-auto max-w-5xl">
    {(loading ? [null, null, null] : data.exec).map((m, i) => (
      <div key={m?._id || i}>
        {i > 0 && <NodeConnector reduce={reduce} />}
        {loading || !m ? <ExecNodeSkeleton /> : <ExecNode member={m} index={i} reduce={reduce} />}
      </div>
    ))}
  </div>
</section>
```

- [ ] **Step 3: Verify** — `npm run lint` (0 warnings). Browser at `/about2`: three white specimen-plate nodes in a vertical chain, green connectors drawing in on scroll, corner ticks, `EXEC-01 / CHAIRMAN` labels in PDCL green, glowing status dots.

- [ ] **Step 4: Commit**

```bash
git -C UpdatedFrontend add src/components/AboutInstrument.jsx
git -C UpdatedFrontend commit -m "feat(about2): executive constellation"
```

### Task B3: Report panels + skeletons

**Files:**
- Modify: `src/components/AboutInstrument.jsx`

**Interfaces:**
- Consumes: `DgxPortrait`; `BANDS`, `bandOf` (Task 1); `loading`, `reduce`.
- Produces: `PanelBand({ band, index, reduce })`, `PanelBandSkeleton({ fill })`; completes the page.

- [ ] **Step 1: Extend the utils import** — change the leadership import line to:

```jsx
import { BANDS, bandOf, getInitials } from "../utils/leadership";
```

- [ ] **Step 2: Add `PanelBand` and `PanelBandSkeleton`**

```jsx
const PanelBand = ({ band, index, reduce }) => {
  const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
  const item = reduce
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 18 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0.7, 0.2, 1] } },
      };
  return (
    <section className="px-4 py-7 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="dgx-mono flex items-baseline justify-between border-b border-[#00984a]/30 pb-2.5 text-[9px] tracking-[0.18em] text-[#006642] sm:text-[11px]">
          <span>
            PANEL {String(index + 2).padStart(2, "0")} · {band.label.toUpperCase()}
          </span>
          <span>n = {String(band.members.length).padStart(2, "0")}</span>
        </div>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.12 }}
          className="mt-5 grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4"
        >
          {band.members.map((m, i) => (
            <motion.div key={m._id || i} variants={item} className="dgx-panel-card p-3">
              <DgxPortrait {...m} small />
              <h3 className="mt-2.5 font-ubuntu text-[13px] font-semibold text-gray-900">{m.name}</h3>
              <p className="mt-1 text-[10.5px] leading-relaxed text-gray-500">{m.designation}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const PanelBandSkeleton = ({ fill }) => (
  <section className="px-4 py-7 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-6xl">
      <div className="dgx-skeleton h-4 w-full rounded-full" />
      <div className="mt-5 grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: fill }).map((_, i) => (
          <div key={i} className="dgx-panel-card p-3">
            <div className="dgx-skeleton aspect-[4/5] w-full rounded-md" />
            <div className="dgx-skeleton mt-3 h-3.5 w-2/3 rounded-full" />
            <div className="dgx-skeleton mt-2 h-2.5 w-1/2 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  </section>
);
```

- [ ] **Step 3: Compute bands and render the panels**

Inside `AboutInstrument`, after the `useReducedMotion()` line, add:

```jsx
const bands = BANDS.map((b) => ({
  ...b,
  members: data.rest.filter((m) => bandOf(m.designation) === b.key),
})).filter((b) => b.members.length > 0);
```

In the main return, insert after the constellation section:

```jsx
{loading
  ? [3, 4].map((fill, i) => <PanelBandSkeleton key={i} fill={fill} />)
  : bands.map((b, i) => <PanelBand key={b.key} band={b} index={i} reduce={reduce} />)}
```

- [ ] **Step 4: Verify** — `npm run lint` (0 warnings). Browser at `/about2`: four report panels with green mono headers (`PANEL 02 · ADVISORY … n = 01`), white cards, green rim + soft glow on hover. Error state (temporarily break the endpoint in the hook, then restore): "SIGNAL LOST" card with "RE-RUN QUERY".

- [ ] **Step 5: Commit**

```bash
git -C UpdatedFrontend add src/components/AboutInstrument.jsx
git -C UpdatedFrontend commit -m "feat(about2): report panels and skeletons"
```

### Task B4: Contrast, responsive, reduced-motion audit

**Files:**
- Modify: `src/components/AboutInstrument.jsx`, `src/index.css` (fixes only)

- [ ] **Step 1: Contrast pass (WCAG AA)** — The tiny (9–11px) mono labels MUST use `#006642` (≈7.5:1 on `#f8fbf9`). Never use `#00984a` for text below 14px bold (≈3.9:1 — decorative dots, borders, and the ECG line only). Spot-check headline gray-900 and body gray-600 with DevTools contrast tooling.
- [ ] **Step 2: Mobile pass** — 360×740 and 320×640: exec nodes fit, panel grid is 2-up, mono header rows wrap without overflow, no horizontal scroll.
- [ ] **Step 3: Reduced motion** — Emulate: ECG tracer static, connectors/cards appear without animation, no shimmer.
- [ ] **Step 4: Grid seam check** — Where the gridded ground meets the white navbar and green footer: if the grid collides visually with the navbar edge, fade it with `mask-image: linear-gradient(to bottom, transparent, black 120px)` on `.dgx-page` or an overlaid white-to-transparent strip.
- [ ] **Step 5: Verify + commit fixes**

```bash
npm run lint
git -C UpdatedFrontend add src/components/AboutInstrument.jsx src/index.css
git -C UpdatedFrontend commit -m "fix(about2): contrast, responsive, reduced-motion pass"
```

(Skip the commit if nothing changed.)

---
---

# TRACK C — `/about3` · AboutGallery (The Gallery: interactive portrait wall)

Split hero with an animated portrait mosaic, filter chips that re-flow a portrait wall by band (Framer Motion layout animations), 2×2 tiles for executives, spotlight dialog with shared-element expansion and keyboard navigation.

**Palette:** ground `#fdfdfb` · PDCL green `#006642` · gradient `#00b365→#006642` · chip bg `#f3f7f3` · tile gradients (6 green/teal pairs, below).

### Task C1: Page scaffold — data model, split hero with mosaic, route

**Files:**
- Modify: `src/index.css` (append)
- Create: `src/components/AboutGallery.jsx`
- Modify: `src/components/index.js`, `src/main.jsx`

**Interfaces:**
- Consumes: `useManagementTeam`, `bandOf`, `getInitials` (Task 1).
- Produces: page at `/about3`; `allMembers` (each member gains `band: "executive"|"advisory"|"gm"|"heads"|"managers"`), `TILE_GRADIENTS`, `Tile({ member, index, big, onOpen, reduce })`, `allWord(n)` — reused by C2/C3.

- [ ] **Step 1: Append the `gal-*` block to `src/index.css`**

```css
/* ============================================================
   About variant 3 — The Gallery (gal-*)
   ============================================================ */
.gal-skeleton {
  background: linear-gradient(90deg, #eef1ec 25%, #f6f8f3 50%, #eef1ec 75%);
  background-size: 200% 100%;
  animation: gal-shimmer 1.6s linear infinite;
}
@keyframes gal-shimmer {
  to { background-position: -200% 0; }
}
@media (prefers-reduced-motion: reduce) {
  .gal-skeleton { animation: none; }
}
```

- [ ] **Step 2: Create `src/components/AboutGallery.jsx`**

```jsx
import "@fontsource/ubuntu";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useManagementTeam } from "../hooks/useManagementTeam";
import { bandOf, getInitials } from "../utils/leadership";

const TILE_GRADIENTS = [
  "from-[#0e5c43] to-[#1d8a63]",
  "from-[#14606e] to-[#2a8d8f]",
  "from-[#3c6b3f] to-[#6d9b58]",
  "from-[#205e52] to-[#3f8f74]",
  "from-[#145747] to-[#35836a]",
  "from-[#2c6660] to-[#4f948b]",
];

// Number words for the lede (14 → "Fourteen"); digits past twenty.
const allWord = (n) => {
  const words = ["Zero","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten",
    "Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen","Twenty"];
  return words[n] || String(n);
};

const Tile = ({ member, index, big = false, onOpen, reduce }) => {
  const [imgError, setImgError] = useState(false);
  return (
    <motion.button
      layout={!reduce}
      layoutId={reduce ? undefined : `tile-${member._id || member.name}`}
      type="button"
      onClick={onOpen ? (e) => onOpen(member, e.currentTarget) : undefined}
      initial={reduce ? false : { opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={reduce ? undefined : { opacity: 0, scale: 0.92 }}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
      className={`relative flex items-end overflow-hidden rounded-2xl bg-gradient-to-br p-2.5 text-left ${
        TILE_GRADIENTS[index % TILE_GRADIENTS.length]
      } ${big ? "col-span-2 row-span-2" : ""} ${
        onOpen ? "cursor-pointer" : "cursor-default"
      } focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00984a] focus-visible:ring-offset-2`}
      aria-label={`${member.name}, ${member.designation}`}
      tabIndex={onOpen ? 0 : -1}
    >
      {!imgError && member.image ? (
        <img
          src={member.image}
          alt=""
          onError={() => setImgError(true)}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      ) : (
        <span
          className={`absolute inset-0 flex items-center justify-center font-ubuntu font-extrabold text-white/85 ${
            big ? "text-3xl" : "text-xl"
          }`}
        >
          {getInitials(member.name)}
        </span>
      )}
      {big && (
        <>
          <span
            className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent"
            aria-hidden="true"
          />
          <b className="relative font-ubuntu text-xs font-bold leading-snug text-white sm:text-[13px]">
            {member.name} · {member.designation}
          </b>
        </>
      )}
    </motion.button>
  );
};

const GalleryHero = ({ members, loading, reduce }) => (
  <header
    className="px-4 sm:px-6 lg:px-8"
    style={{ paddingTop: "max(4.5rem, env(safe-area-inset-top))" }}
  >
    <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
      <div>
        <p className="font-ubuntu text-[11px] font-bold uppercase tracking-[0.2em] text-[#00984a] sm:text-xs">
          About us · Since 1983
        </p>
        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
          className="mt-3 font-ubuntu text-4xl font-extrabold leading-[1.05] tracking-tight text-[#22292a] sm:text-6xl"
        >
          The people of{" "}
          <span className="bg-gradient-to-r from-[#00b365] to-[#006642] bg-clip-text text-transparent">
            Popular.
          </span>
        </motion.h1>
        <p className="mt-4 max-w-[44ch] text-[15px] leading-relaxed text-[#5f6a66]">
          {loading ? "Our" : `${allWord(members.length)}`} leaders, one promise: accurate, accessible
          diagnostics for every patient who walks through our doors — at every one of our centres.
        </p>
        <div className="mt-6 flex flex-wrap gap-2.5">
          {["Since 1983", "24+ branches", "Nationwide network"].map((s) => (
            <span
              key={s}
              className="rounded-full border border-[#dbe5dd] bg-[#f3f7f3] px-4 py-1.5 font-ubuntu text-xs font-semibold text-[#17313f]"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2.5 [grid-auto-rows:64px] sm:[grid-auto-rows:74px]">
        {(loading ? [] : members.slice(0, 9)).map((m, i) => (
          <Tile key={m._id || i} member={m} index={i} big={i === 0} reduce={reduce} />
        ))}
        {loading &&
          Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className={`gal-skeleton rounded-2xl ${i === 0 ? "col-span-2 row-span-2" : ""}`}
            />
          ))}
      </div>
    </div>
  </header>
);

const AboutGallery = () => {
  const { data, loading, error } = useManagementTeam();
  const reduce = useReducedMotion();

  const allMembers = [
    ...data.exec.map((m) => ({ ...m, band: "executive" })),
    ...data.rest.map((m) => ({ ...m, band: bandOf(m.designation) })),
  ];

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fdfdfb] px-4">
        <div className="max-w-md rounded-3xl border border-[#dbe5dd] bg-[#f6faf7] p-8 text-center shadow-lg">
          <p className="font-ubuntu text-lg font-medium text-gray-800">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-full bg-[#006642] px-6 py-2.5 font-ubuntu font-medium text-white transition-all hover:brightness-110"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#fdfdfb] pb-12">
      <GalleryHero members={allMembers} loading={loading} reduce={reduce} />
      <div style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }} />
    </div>
  );
};

AboutGallery.displayName = "AboutGallery";

export default AboutGallery;
```

- [ ] **Step 3: Wire barrel + route**

In `src/components/index.js`: below `import About from "./About";` add:

```js
import AboutGallery from "./AboutGallery";
```

and in the export object, below the `About,` entry add:

```js
  AboutGallery,
```

In `src/main.jsx`: below `const About = lazyLoad("About");` add:

```js
const AboutGallery = lazyLoad("AboutGallery");
```

and below the `{ path: "/about", element: <About /> },` route add:

```js
{ path: "/about3", element: <AboutGallery /> },
```

- [ ] **Step 4: Verify** — `npm run lint` (0 warnings). Open `http://localhost:5173/about3`: split hero — headline left with gradient "Popular." and three stat chips; right a 4-column mosaic where the first member spans 2×2 with a name overlay; initials tiles for missing/broken portraits; skeleton tiles shimmer during load. `/about`, `/about1`, `/about2` unaffected.

- [ ] **Step 5: Commit**

```bash
git -C UpdatedFrontend add src/components/AboutGallery.jsx src/components/index.js src/main.jsx src/index.css
git -C UpdatedFrontend commit -m "feat(about3): gallery page scaffold — data model, split hero mosaic, route"
```

### Task C2: Filterable portrait wall

**Files:**
- Modify: `src/components/AboutGallery.jsx`

**Interfaces:**
- Consumes: `Tile`, `allMembers` (C1); `BANDS` (Task 1); `reduce`.
- Produces: `FILTERS` const; `filter`/`setFilter` state and the `shown` list — consumed by C3, which also makes the tiles clickable.

- [ ] **Step 1: Extend imports** — change the framer-motion import to `import { motion, AnimatePresence, useReducedMotion } from "framer-motion";` and the leadership import to `import { BANDS, bandOf, getInitials } from "../utils/leadership";`. Then add below `TILE_GRADIENTS`:

```jsx
const FILTERS = [
  { key: "all", label: "All" },
  { key: "executive", label: "Executive" },
  ...BANDS,
];
```

- [ ] **Step 2: Add state to `AboutGallery`** (after the `allMembers` computation):

```jsx
const [filter, setFilter] = useState("all");

const shown = filter === "all" ? allMembers : allMembers.filter((m) => m.band === filter);
```

- [ ] **Step 3: Render the wall** — in the main return, insert after `<GalleryHero …/>`:

```jsx
<section className="px-4 pt-14 sm:px-6 lg:px-8">
  <div className="mx-auto max-w-6xl">
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter leadership by group">
      {FILTERS.map((f) => (
        <button
          key={f.key}
          type="button"
          onClick={() => setFilter(f.key)}
          aria-pressed={filter === f.key}
          className={`rounded-full border px-4 py-2 font-ubuntu text-[13px] font-semibold transition-colors ${
            filter === f.key
              ? "border-[#006642] bg-[#006642] text-white"
              : "border-[#d7e0d9] bg-white text-[#4c5a54] hover:border-[#00984a]/50"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>

    <motion.div
      layout={!reduce}
      className="mt-6 grid grid-cols-3 gap-2.5 [grid-auto-rows:88px] sm:grid-cols-4 sm:gap-3 sm:[grid-auto-rows:104px] lg:grid-cols-6"
    >
      <AnimatePresence mode="popLayout">
        {(loading ? [] : shown).map((m, i) => (
          <Tile
            key={m._id || m.name}
            member={m}
            index={i}
            big={m.band === "executive"}
            reduce={reduce}
          />
        ))}
      </AnimatePresence>
      {loading &&
        Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className={`gal-skeleton rounded-2xl ${i < 3 ? "col-span-2 row-span-2" : ""}`} />
        ))}
    </motion.div>

    {!loading && shown.length === 0 && (
      <p className="mt-10 text-center text-sm text-[#5f6a66]">No members in this group.</p>
    )}
  </div>
</section>
```

- [ ] **Step 4: Verify** — `npm run lint` (0 warnings). Browser at `/about3`: full wall (3 exec tiles 2×2 with name overlays, others 1×1); clicking the "Departmental Heads" chip re-flows the wall with spring animation to 4 tiles; "All" restores; empty message shows for no filter matches; reduced-motion filtering swaps instantly. Tiles are not yet clickable — C3 wires that.

- [ ] **Step 5: Commit**

```bash
git -C UpdatedFrontend add src/components/AboutGallery.jsx
git -C UpdatedFrontend commit -m "feat(about3): filterable portrait wall"
```

### Task C3: Spotlight dialog

**Files:**
- Modify: `src/components/AboutGallery.jsx`

**Interfaces:**
- Consumes: `Tile`, `getInitials`, `FILTERS`, `shown`, `reduce` (C1/C2).
- Produces: spotlight state (`selected`, `lastFocusRef`) with `openSpotlight`/`closeSpotlight`/`stepSpotlight` handlers, `Spotlight({ member, list, onClose, onStep, reduce })` rendered inside `AnimatePresence`, and clickable wall tiles.

- [ ] **Step 1: Extend imports** — change the React import to `import { useState, useEffect, useRef } from "react";`. Add below `FILTERS`:

```jsx
const BAND_LABELS = Object.fromEntries(FILTERS.map((f) => [f.key, f.label]));
```

- [ ] **Step 2: Add the `Spotlight` component**

```jsx
const Spotlight = ({ member, list, onClose, onStep, reduce }) => {
  const idx = list.findIndex((m) => (m._id || m.name) === (member._id || member.name));
  const closeRef = useRef(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [member]);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onStep]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm"
    >
      <motion.div
        layoutId={reduce ? undefined : `tile-${member._id || member.name}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${member.name}, ${member.designation}`}
        className="grid w-full max-w-lg grid-cols-[120px_1fr] items-center gap-5 rounded-3xl border border-[#dbe5dd] bg-[#f6faf7] p-5 shadow-2xl sm:max-w-xl sm:grid-cols-[150px_1fr] sm:gap-6 sm:p-6"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br from-[#0e5c43] to-[#2a8d6a]">
          {!imgError && member.image ? (
            <img
              src={member.image}
              alt={`${member.name}, ${member.designation}`}
              onError={() => setImgError(true)}
              className="h-full w-full object-cover object-top"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center font-ubuntu text-3xl font-extrabold text-white">
              {getInitials(member.name)}
            </span>
          )}
        </div>
        <div>
          <span className="inline-block rounded-full bg-[#e3f1e9] px-3 py-1 font-ubuntu text-[10px] font-bold uppercase tracking-[0.16em] text-[#00794e]">
            {BAND_LABELS[member.band] || member.band}
          </span>
          <h2 className="mt-2.5 font-ubuntu text-xl font-extrabold text-[#22292a] sm:text-2xl">
            {member.name}
          </h2>
          <p className="mt-1 text-sm text-[#5f6a66]">{member.designation}</p>
          <div className="mt-4 flex items-center gap-3 font-ubuntu text-xs text-[#8a948f]">
            <button
              type="button"
              onClick={() => onStep(-1)}
              className="rounded-full border border-[#d7e0d9] px-3.5 py-1.5 font-semibold text-[#4c5a54] transition-colors hover:border-[#00984a]/60"
            >
              ← Prev
            </button>
            <span className="tabular-nums">
              {String(idx + 1).padStart(2, "0")} of {String(list.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => onStep(1)}
              className="rounded-full border border-[#d7e0d9] px-3.5 py-1.5 font-semibold text-[#4c5a54] transition-colors hover:border-[#00984a]/60"
            >
              Next →
            </button>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="ml-auto rounded-full bg-[#006642] px-3.5 py-1.5 font-semibold text-white transition-all hover:brightness-110"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
```

- [ ] **Step 3: Wire it up in `AboutGallery`**

Add the spotlight state and handlers (after the `shown` computation):

```jsx
const [selected, setSelected] = useState(null);
const lastFocusRef = useRef(null);

const openSpotlight = (member, el) => {
  lastFocusRef.current = el;
  setSelected(member);
};

const closeSpotlight = () => {
  setSelected(null);
  lastFocusRef.current?.focus();
};

const stepSpotlight = (dir) => {
  setSelected((cur) => {
    if (!cur) return cur;
    const i = shown.findIndex((m) => (m._id || m.name) === (cur._id || cur.name));
    return shown[(i + dir + shown.length) % shown.length];
  });
};
```

Make the wall tiles clickable — in the wall section from C2, add `onOpen={openSpotlight}` to the `<Tile …/>` call:

```jsx
<Tile
  key={m._id || m.name}
  member={m}
  index={i}
  big={m.band === "executive"}
  onOpen={openSpotlight}
  reduce={reduce}
/>
```

In the main return, insert after the wall section (before the closing safe-area div):

```jsx
<AnimatePresence>
  {selected && (
    <Spotlight
      member={selected}
      list={shown}
      onClose={closeSpotlight}
      onStep={stepSpotlight}
      reduce={reduce}
    />
  )}
</AnimatePresence>
```

- [ ] **Step 4: Verify** — `npm run lint` (0 warnings). Browser at `/about3`: click a tile → spotlight expands from the tile (shared element); backdrop click, Close, and Escape all dismiss AND return focus to the originating tile; ←/→ and Prev/Next walk the currently filtered list, wrapping at the ends; counter shows "09 of 14" style numbers; body doesn't scroll behind the dialog; with reduced motion the dialog fades instead of morphing.

- [ ] **Step 5: Commit**

```bash
git -C UpdatedFrontend add src/components/AboutGallery.jsx
git -C UpdatedFrontend commit -m "feat(about3): spotlight dialog with keyboard nav"
```

### Task C4: Accessibility, responsive, reduced-motion audit

**Files:**
- Modify: `src/components/AboutGallery.jsx` (fixes only)

- [ ] **Step 1: Keyboard-only pass** — Tab through the page: chips reflect `aria-pressed`, every tile focusable with a visible ring, Escape always dismisses the spotlight, focus returns on close.
- [ ] **Step 2: Screen-reader sanity** — VoiceOver quick pass: tiles announce "name, designation, button"; dialog announces name + role; filter group announces its label.
- [ ] **Step 3: Mobile pass** — 360×740: hero stacks (headline above mosaic), wall is 3-up with exec tiles 2×2 still legible, spotlight fits with the 120px portrait column, chips wrap without overflow.
- [ ] **Step 4: Reduced-motion pass** — no springs, no shared-element morph, instant filter swaps, no shimmer.
- [ ] **Step 5: Verify + commit fixes**

```bash
npm run lint
git -C UpdatedFrontend add src/components/AboutGallery.jsx
git -C UpdatedFrontend commit -m "fix(about3): a11y, responsive, reduced-motion pass"
```

(Skip the commit if nothing changed.)

---

## Final acceptance (after all three tracks)

- [ ] `npm run lint` — 0 warnings
- [ ] `/about1`, `/about2`, `/about3` all render correctly at 320px, 360px, 768px, 1440px — no horizontal scroll
- [ ] `/about` is pixel-identical to before (untouched)
- [ ] Loading skeletons, image-fallback initials, and error states match each page's visual language (test error by temporarily breaking the endpoint in `useManagementTeam.js`, then restoring)
- [ ] `prefers-reduced-motion` disables all animation on all three pages
- [ ] Full-page screenshots of all three variants captured to `docs/superpowers/plans/assets/` for the decision review
- [ ] Optional: stop the dev server, then `npm run build && npm run preview` for a production smoke test

## Post-decision follow-up (separate effort, after a winner is chosen)

Not part of this plan — plan it when the decision lands:

1. Point `/about` at the winning component (either re-route in `main.jsx` or rename the winning file to replace `About.jsx`), fold `BANDS`/`bandOf`/`getInitials`/fetch usage in any remaining pages onto the shared hook/utils.
2. Remove the two losing components, their barrel entries, `lazyLoad` consts, `/about1|2|3` routes, and their CSS namespace blocks from `src/index.css`.
3. Delete the now-unused `lg-*` ("Liquid Glass") block from `src/index.css` once nothing references it (`grep -rn "lg-" src/components/About*.jsx`).
4. `npm run lint` + full visual pass on `/about`.
5. Run a WCAG AA contrast pass on the winning variant's full palette (the per-track audits only included a contrast step in Track B).
