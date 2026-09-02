---
id: ssr
title: SSR Setup
sidebar_position: 2
---

# Server-Side Rendering (SSR)

NgxTranslateRoutes supports Angular Universal / `@angular/ssr`.

## app.config.ts

```typescript
import { provideClientHydration } from '@angular/platform-browser'
import { provideNgxTranslateRoutes } from 'ngx-translate-routes'

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideRouter(routes),
    provideClientHydration(),
    importProvidersFrom(
      TranslateModule.forRoot({ /* ... */ }),
    ),
    // highlight-start
    provideNgxTranslateRoutes({
      enableLanguageInPath: true,
      includeDefaultLanguageInPath: true,
      enableSsrRouteTranslation: true,
      availableLanguages: ['en', 'es'],
    }),
    // highlight-end
  ],
}
```

## Required Options for SSR

| Option | Value | Why |
|--------|-------|-----|
| `enableSsrRouteTranslation` | `true` | Activates SSR route registration on the server |
| `availableLanguages` | `['en', 'es', ...]` | Lets the library detect the language from the translated URL on the server |

## How SSR Route Detection Works

On the server, Angular receives an already-translated URL (e.g. `/es/sobreNosotros`). The library:

1. Scans `availableLanguages` looking for a translation match in the `routes` key
2. Finds the original Angular path (`about`)
3. Registers a redirect route: `/es/sobreNosotros` → `about`
4. Angular renders the correct component

## app.config.server.ts

No changes needed — `provideNgxTranslateRoutes` handles both browser and server contexts automatically via `PLATFORM_ID`.

## Hydration

`provideClientHydration()` must be included so that the `TransferState` used for SSR→browser route handoff works correctly.
