# Architecture

## Directory Rules

- **Components** → `src/components/` (PascalCase filenames)
- **Branch pages** → `src/components/Branch/` (one file per PDCL branch)
- **UI primitives** → `src/components/ui/` (reusable, no business logic)
- **Hooks** → `src/hooks/` (camelCase, prefixed with `use`)
- **API services** → `src/services/api/`
- **Constants** → `src/constants/` (static data, large files)
- **Assets** → `src/assets/` (organized by type subdirectories)

## Component Pattern

All components are **functional** with hooks. No class components.

```
Imports → Props destructuring → Hooks → Handlers → Return JSX
```

- Default export for page/UI components
- Named exports for utility functions, hooks, and API services
- Components barrel-exported from `src/components/index.js`

## API Service Pattern

**IMPORTANT:** All HTTP calls go through `apiFactory.js`. Never import axios directly in components.

```jsx
// CORRECT — use apiFactory instance
import { legacyApi } from '../services/api/legacyApi';
const response = await legacyApi.get('/endpoint');

// WRONG — raw axios
import axios from 'axios';
```

- `apiFactory.js` — creates configured axios instances with interceptors
- `legacyApi.js` — main PDCL backend (token via query param)
- `akhilApi.js` — secondary API for branch service charges (basic auth)
- Response normalization via `normalizeResponse()`

## Hook Pattern

- `useApiCall` — generic API hook with loading/error/retry states
- `useHealthcareApi` — specialized healthcare API hook
- `useDoctorSearch`, `useServiceSearch` — domain-specific search hooks
- `useDebounce`, `useScrollPosition` — utility hooks
- Single responsibility per hook

## Route Pattern

- Root layout: `Layout.jsx` wraps Nav, Navbar, Footer, Sidemenu
- All route components lazy-loaded in `main.jsx`
- `ScrollToTop` component for navigation transitions
- `ErrorBoundary` wraps the app for graceful error handling

## Branch System

Each PDCL branch (22 total) has a dedicated page component in `src/components/Branch/` with:
- Hero video section
- Doctor listings with pagination
- Service search (`SearchBoxBranch`)
- Branch contact info

Branch data lives in `src/constants/branches.js`.
