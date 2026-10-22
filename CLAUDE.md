# CLAUDE.md

## Identity

PDCL (Popular Diagnostic Centre Limited) — public-facing website frontend.
React 18 + Vite + Tailwind CSS + Framer Motion (JavaScript only).

## Commands

```bash
npm run dev              # Vite dev server with HMR
npm run build            # Production build (Terser minification)
npm run build:optimized  # Build with gzip/brotli compression
npm run lint             # ESLint (max warnings: 0)
npm run preview          # Preview production build
npm run deploy:s3        # Deploy to AWS S3 + CloudFront
```

## Critical Rules

- **JavaScript only** — no TypeScript files
- **No new dependencies** without explicit approval
- **Never commit `.env` files** — secrets live in Vite env vars (`VITE_*`)
- **All API calls** go through `src/services/api/apiFactory.js` — never use raw axios
- **Lazy load** all route-level components via `React.lazy()`
- **No console.log** in production — Terser strips them, but ESLint warns

## Architecture Quick Reference

```
src/
├── components/           # Page + UI components
│   ├── Branch/           # 22 branch-specific pages
│   ├── SampleCollection/ # Sample collection booking flow
│   └── ui/               # Reusable UI primitives
├── hooks/                # Custom React hooks
├── hoc/                  # Higher-order components (SectionWrapper)
├── services/api/         # API layer (apiFactory, legacyApi, akhilApi)
├── constants/            # Static data (branches, health, management)
├── assets/               # Images organized by type
├── utils/                # Utility functions
├── main.jsx              # Entry point with lazy loading
└── secrets.js            # Env var exports (VITE_*)
```

## API Backends

| API | Base URL | Auth | Purpose |
|-----|----------|------|---------|
| Legacy | `VITE_BASE_URL` | Token query param | Doctors, branches, services, reports |
| Akhil | `VITE_AKHIL_API_BASE_URL` | Bearer token (fetched via `/api/Token/GetToken`) | Branch-specific service charges |

## Deployment

- **AWS S3 + CloudFront** — primary production deployment
- **Vercel** — alternative deployment (vercel.json configured)
- Cache: 1-year immutable for hashed assets, 5-min for HTML
