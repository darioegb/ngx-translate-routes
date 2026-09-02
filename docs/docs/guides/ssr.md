---
id: ssr
title: SSR Setup
sidebar_position: 2
---

# Server-Side Rendering (SSR)

NgxTranslateRoutes supports `@angular/ssr` via the dedicated `ngx-translate-routes/ssr` entry point.

:::info v3 change
`enableSsrRouteTranslation` and `availableLanguages` have moved out of `provideNgxTranslateRoutes()`. Use `provideNgxTranslateRoutesSsr()` in your **shared** `app.config.ts` instead. See the [migration guide](../migration/v2-to-v3).
:::

## app.config.ts (shared)

`provideNgxTranslateRoutesSsr()` handles both browser and server contexts internally via `PLATFORM_ID` — place it in the shared config, not in `app.config.server.ts`:

```typescript title="app.config.ts"
import { ApplicationConfig } from '@angular/core'
import { provideRouter } from '@angular/router'
import { provideHttpClient, HttpClient, withFetch } from '@angular/common/http'
import { provideClientHydration } from '@angular/platform-browser'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { importProvidersFrom } from '@angular/core'
// highlight-next-line
import { provideNgxTranslateRoutesSsr } from 'ngx-translate-routes/ssr'
import { routes } from './app.routes'

export const httpLoaderFactory = (http: HttpClient) =>
  new TranslateHttpLoader(http)

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideRouter(routes),
    provideClientHydration(),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useFactory: httpLoaderFactory,
          deps: [HttpClient],
        },
      }),
    ),
    // highlight-start
    provideNgxTranslateRoutesSsr({
      enableLanguageInPath: true,
      availableLanguages: ['en', 'es'],
    }),
    // highlight-end
  ],
}
```

## app.config.server.ts

No changes needed here — `provideNgxTranslateRoutesSsr` in the shared config already handles the server context:

```typescript title="app.config.server.ts"
import { mergeApplicationConfig, ApplicationConfig } from '@angular/core'
import { provideServerRendering } from '@angular/platform-server'
import { appConfig } from './app.config'

const serverConfig: ApplicationConfig = {
  providers: [provideServerRendering()],
}

export const config = mergeApplicationConfig(appConfig, serverConfig)
```

## How SSR Route Detection Works

On the server, Angular receives an already-translated URL (e.g. `/es/sobreNosotros`). The library:

1. Scans `availableLanguages` looking for a translation match in the `routes` key
2. Finds the original Angular path (`about`)
3. Registers a redirect route: `/es/sobreNosotros` → `about`
4. Angular renders the correct component

## `provideNgxTranslateRoutesSsr` options

`provideNgxTranslateRoutesSsr` accepts all the same options as `provideNgxTranslateRoutes` plus `availableLanguages`. `enableSsrRouteTranslation` is always `true` when using this provider.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `availableLanguages` | `string[]` | `['en']` | Languages the app supports (used for server-side URL detection) |

All other [configuration options](../configuration) are also accepted.

## Hydration

`provideClientHydration()` must be included in the browser config so that Angular's `TransferState` works correctly during SSR→browser handoff.
