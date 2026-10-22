# Workflows

## Adding a New Feature

1. Check if a similar component/pattern already exists in the codebase
2. Create component in `src/components/` (PascalCase, functional)
3. If it needs API data, use `useApiCall` hook or create a domain-specific hook in `src/hooks/`
4. Add route in `src/main.jsx` using `React.lazy()` import
5. Export from `src/components/index.js` barrel
6. Use Tailwind utilities for styling (follow PDCL brand palette)
7. Run `npm run lint` to verify
8. Test in dev with `npm run dev`

## Adding a New Branch Page

1. Create `src/components/Branch/BranchName.jsx`
2. Follow existing branch page pattern (Hero, Doctors, Services, Contact)
3. Add branch data to `src/constants/branches.js`
4. Add lazy route in `src/main.jsx`
5. Add export in `src/components/index.js`
6. Add navigation link in `Sidemenu.jsx` and relevant nav components

## Adding a New API Endpoint

1. Determine which API backend (Legacy or Akhil)
2. If new backend: create instance in `src/services/api/` using `createApiInstance`
3. Add env vars to `.env`, `.env.production`, and `src/secrets.js`
4. Create or update service file in `src/services/`
5. Create or update custom hook in `src/hooks/` if needed

## Debugging Checklist

1. Check browser console for errors (network, JS)
2. Check network tab for API responses and status codes
3. Verify env vars are set (`VITE_*` prefix required)
4. Check API token validity
5. Test with `npm run build && npm run preview` for production-like behavior
6. Check Vite HMR if dev server seems stale — restart with `npm run dev`

## Deployment

1. Run `npm run lint` — must pass with 0 warnings
2. Run `npm run build` — verify no build errors
3. Test with `npm run preview`
4. Deploy: `npm run deploy:s3` (S3 + CloudFront)
