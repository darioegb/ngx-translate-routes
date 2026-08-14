---
id: v2-to-v3
title: Migrating to v3
sidebar_position: 1
---

# Migrating from v2 to v3

:::caution
v3 is not yet released. This guide describes the planned breaking changes.
:::

## Breaking Changes

### Angular 18+ required

v3 drops support for Angular 16 and 17.

Update your `package.json` peer dependency:

```json
"@angular/core": "^18.0.0"
```

### SSR via secondary entry point

SSR logic has been moved to a separate entry point to reduce browser bundle size.

**Before (v2):**
```typescript
provideNgxTranslateRoutes({
  enableSsrRouteTranslation: true,
  availableLanguages: ['en', 'es'],
})
```

**After (v3):**
```typescript
// app.config.ts (browser)
import { provideNgxTranslateRoutes } from 'ngx-translate-routes'

provideNgxTranslateRoutes({ /* ... */ })
```

```typescript
// app.config.server.ts
import { provideNgxTranslateRoutesSsr } from 'ngx-translate-routes/ssr'

provideNgxTranslateRoutesSsr({
  availableLanguages: ['en', 'es'],
})
```

### `NgxTranslateRoutesModule` deprecated

The NgModule-based setup continues to work in v3 but is deprecated. Migrate to the standalone provider:

```typescript
// Before
NgxTranslateRoutesModule.forRoot({ ... })

// After
provideNgxTranslateRoutes({ ... })
```

### `provideAppInitializer` replaces `APP_INITIALIZER`

This is an internal change — no action required unless you were overriding the `APP_INITIALIZER` token directly.
