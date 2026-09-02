---
id: v2-to-v3
title: Migrating to v3
sidebar_position: 1
---

# Migrating from v2 to v3

## Breaking Changes

### Angular 18+ required

v3 drops support for Angular 16 and 17. Update your peer dependency:

```json
"@angular/core": ">=18.0.0"
```

### SSR via secondary entry point

`enableSsrRouteTranslation` has been removed from `provideNgxTranslateRoutes()` — passing it now throws a runtime error. SSR setup has moved to a dedicated entry point to keep the browser bundle clean.

**Before (v2):**
```typescript
import { provideNgxTranslateRoutes } from 'ngx-translate-routes'

// app.config.ts
provideNgxTranslateRoutes({
  enableSsrRouteTranslation: true,
  availableLanguages: ['en', 'es'],
})
```

**After (v3):**
```typescript
// app.config.ts (browser — no SSR options here)
import { provideNgxTranslateRoutes } from 'ngx-translate-routes'

provideNgxTranslateRoutes({ /* browser options only */ })
```

```typescript
// app.config.server.ts
import { provideNgxTranslateRoutesSsr } from 'ngx-translate-routes/ssr'

provideNgxTranslateRoutesSsr({
  availableLanguages: ['en', 'es'],
})
```

See the [SSR guide](../guides/ssr) for the full setup.

### `NgxTranslateRoutesModule` deprecated

The NgModule-based API continues to work in v3 but is deprecated. Migrate to the standalone provider:

```typescript
// Before
NgxTranslateRoutesModule.forRoot({ ... })

// After
provideNgxTranslateRoutes({ ... })
```

### `provideAppInitializer` replaces `APP_INITIALIZER` (internal)

This is an internal change — no action required unless you were directly overriding the `APP_INITIALIZER` token.
