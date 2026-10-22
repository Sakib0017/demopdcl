# Performance

## Build Optimizations

- **Vite** with `esnext` target for modern browsers
- **Terser** minification — strips `console.log`, `console.info`, `console.warn`, and `debugger` in production
- **Tree shaking** enabled via Rollup
- **Code splitting** — automatic per-route and async component chunks
- **Asset hashing** — `assets/[name]-[hash].js` for cache busting
- **Asset inlining** — files < 4KB inlined as base64
- **Chunk size warning** at 1000KB

## Lazy Loading

**IMPORTANT:** All route-level components MUST use `React.lazy()` in `src/main.jsx`.

```jsx
const DoctorSearch = lazy(() => import('./components/DoctorSearch'));
```

- Wrap lazy components in `<Suspense>` with a fallback
- Non-route UI components do NOT need lazy loading

## Virtual Scrolling

Use `@tanstack/react-virtual` (via `useVirtual`) for long lists (doctor listings, search results).

## Search Optimization

- `useDebounce` — debounce user input before API calls
- `useSearchOptimization` — optimized search with caching
- Cancel previous requests when new search initiated (cancel tokens)

## Image Optimization

- Prefer WebP format
- Use `ImageWithFallback` component for graceful image loading
- Organize images by type in `src/assets/` subdirectories

## Deployment Performance

- **CloudFront CDN** with gzip + brotli compression
- **Cache headers**: 1-year immutable for hashed assets, 5-min for HTML
- **S3 metadata** configured in `deployment-config.json`

## Pre-optimized Dependencies

Vite pre-bundles: `react`, `react-dom`, `react-router-dom`, `framer-motion`, `react-spring`
