# API Services

## Critical Rule

**All API calls MUST go through the apiFactory pattern.** Never import axios directly in components or hooks.

## API Factory (`src/services/api/apiFactory.js`)

- `createApiInstance(baseURL, config)` — creates configured axios instance with:
  - 15-second timeout
  - Response interceptor for consistent error handling
  - JSON content type header
- `normalizeResponse({success, data, pagination, error, errorCode, apiType})` — standardizes all API responses

## Legacy API (`src/services/api/legacyApi.js`)

- Base URL: `VITE_BASE_URL` (https://api.populardiagnostic.com)
- Auth: `VITE_API_TOKEN` appended as query parameter via request interceptor
- Endpoints: doctors, branches, services, reports, hotlines

## Akhil API (`src/services/api/akhilApi.js`)

- Base URL: `VITE_AKHIL_API_BASE_URL`
- Auth: **Bearer token** — fetched via `/api/Token/GetToken` using `VITE_AKHIL_API_USERNAME` / `VITE_AKHIL_API_PASSWORD`, then cached and sent as `Authorization: Bearer <token>` header
- Purpose: Branch-specific service charges

## Environment Variables

All env vars use `VITE_` prefix (Vite requirement). Exported from `src/secrets.js`:

```
VITE_BASE_URL           — Legacy API base URL
VITE_API_TOKEN          — Legacy API auth token
VITE_AKHIL_API_BASE_URL — Akhil API base URL
VITE_AKHIL_API_USERNAME — Akhil API username
VITE_AKHIL_API_PASSWORD — Akhil API password
```

**NEVER hardcode API URLs, tokens, or credentials.** Always use env vars.

## Error Handling

- API factory interceptors handle error logging
- `useApiCall` hook provides: `data`, `loading`, `error`, `retryCount`, `fetchData`, `retry`, `reset`
- Auto-retry on 5xx errors and 429 (rate limit) with exponential backoff
- Cancel tokens prevent stale responses on component unmount

## Adding New API Endpoints

1. Add the API instance in `src/services/api/` using `createApiInstance`
2. Add env vars to `.env` and `.env.production`
3. Export from `src/secrets.js`
4. Use in hooks/components via the service, not raw axios
