---
id: ssr
title: SSR Setup
sidebar_position: 2
---

# Server-Side Rendering (SSR)

NgxTranslateRoutes supports Angular Universal / `@angular/ssr` via the dedicated `ngx-translate-routes/ssr` entry point.

:::info v3 change
`enableSsrRouteTranslation` and `availableLanguages` have moved out of `provideNgxTranslateRoutes()`. Use `provideNgxTranslateRoutesSsr()` in your server config instead. See the [migration guide](../migration/v2-to-v3).
:::

## app.config.ts (browser)

No SSR options here — the browser config stays lean:

```typescript title="app.config.ts"
import { ApplicationConfig } from '@angular/core'
import { provideRouter } from '@angular/router'
import { provideHttpClient, HttpClient, withFetch } from '@angular/common/http'
import { provideClientHydration } from '@angular/platform-browser'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { importProvidersFrom } from '@angular/core'
import { provideNgxTranslateRoutes } from 'ngx-translate-routes'
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
    // highlight-next-line
    provideNgxTranslateRoutes({ enableLanguageInPath: true }),
  ],
}
```

## app.config.server.ts

Import from `ngx-translate-routes/ssr` and pass your language list:

```typescript title="app.config.server.ts"
import { mergeApplicationConfig, ApplicationConfig } from '@angular/core'
import { provideServerRendering } from '@angular/platform-server'
// highlight-next-line
import { provideNgxTranslateRoutesSsr } from 'ngx-translate-routes/ssr'
import { appConfig } from './app.config'

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    // highlight-start
    provideNgxTranslateRoutesSsr({
      availableLanguages: ['en', 'es'],
    }),
    // highlight-end
  ],
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
