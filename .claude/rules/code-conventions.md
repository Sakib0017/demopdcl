# Code Conventions

## File Naming

- **Components**: PascalCase — `DoctorSearch.jsx`, `SearchBoxBranch.jsx`
- **Hooks**: camelCase with `use` prefix — `useApiCall.js`, `useDebounce.js`
- **Utilities**: camelCase — `accessibility.js`, `motion.js`
- **Constants**: camelCase — `branches.js`, `health.js`
- **Services**: camelCase — `legacyApi.js`, `apiFactory.js`

## Export Patterns

- **Components**: `export default ComponentName`
- **Hooks**: `export const useHookName = ...`
- **API services**: `export const apiInstance = ...`
- **Utilities**: Named exports — `export const functionName = ...`
- **Constants**: Named exports from index.js barrel

## Component Structure Order

```jsx
// 1. React imports
import { useState, useEffect } from 'react';
// 2. Third-party imports
import { motion } from 'framer-motion';
// 3. Local imports (components, hooks, utils)
import { useApiCall } from '../hooks/useApiCall';
// 4. Asset imports
import logo from '../assets/Logos/logo.png';

const ComponentName = ({ prop1, prop2, ...rest }) => {
  // 5. Hooks
  // 6. State
  // 7. Effects
  // 8. Handlers
  // 9. Render helpers
  // 10. Return JSX
};

export default ComponentName;
```

## Props

- Destructure at function signature
- Use rest spread for pass-through props
- No PropTypes (disabled in ESLint)

## JavaScript Only

**No TypeScript.** All source files use `.js` or `.jsx` extensions.

## ESLint Rules

- `no-unused-vars`: warn (underscore prefix `_` ignored)
- `no-console`: warn — avoid console.log (stripped in production anyway)
- `react/prop-types`: off
- `react/display-name`: off
- `react-refresh/only-export-components`: warn
