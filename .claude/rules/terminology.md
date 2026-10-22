# Terminology

## PDCL Domain Terms

| Term | Meaning |
|------|---------|
| **Branch** | Physical PDCL diagnostic center location (NOT a git branch) |
| **Service** | A diagnostic test or procedure offered by PDCL |
| **Doctor Profile** | Doctor listing with specialization, availability, and branch assignment |
| **Report Download** | Patient portal feature for accessing diagnostic results |
| **Sample Collection** | Home sample collection booking service |
| **Hotline** | Emergency/contact phone numbers for branches |

## Technical Terms

| Term | Meaning |
|------|---------|
| **Legacy API** | Main PDCL backend at `api.populardiagnostic.com` |
| **Akhil API** | Secondary backend for branch-specific service charges |
| **apiFactory** | Axios instance factory with interceptors |
| **SearchBoxBranch** | Branch-specific service search component |
| **SectionWrapper** | HOC for consistent section layout and animations |

## Common Gotchas

1. **Branch ≠ git branch** — in this codebase, "branch" almost always means a PDCL physical location
2. **Constants file is large** — `src/constants/branches.js` is 744+ lines of static branch data; don't try to refactor it into the database
3. **Two API backends** — Legacy (main) and Akhil (secondary). Check which one serves the data you need
4. **Token as query param** — Legacy API uses token in query params, NOT Authorization header
5. **No state management library** — state is local via hooks (useState/useEffect). No Redux, Zustand, or Context API for global state
6. **22 branch pages** — each is a separate component file, not dynamically generated. This is intentional for branch-specific customizations
7. **`src/secrets.js`** — just re-exports Vite env vars. Not actual secrets
8. **`src/Faw.jsx`** — large file (~31KB), likely icon/font-awesome configuration. Avoid modifying unless necessary
9. **Framer Motion + React Spring** — both animation libraries are used. Framer Motion is preferred for new work
10. **No test framework** — no Jest, Vitest, or testing library configured
