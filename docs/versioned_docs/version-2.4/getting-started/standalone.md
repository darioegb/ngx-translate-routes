---
id: standalone
title: Standalone App
sidebar_position: 1
---

# Setup: Standalone App

For Angular apps using the standalone API (Angular 17+ recommended).

## Basic Setup

```typescript title="app.config.ts"
import { ApplicationConfig, importProvidersFrom } from '@angular/core'
import { provideRouter } from '@angular/router'
import { provideHttpClient, HttpClient, withFetch } from '@angular/common/http'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
// highlight-next-line
import { provideNgxTranslateRoutes } from 'ngx-translate-routes'
import { routes } from './app.routes'

export const httpLoaderFactory = (http: HttpClient) =>
  new TranslateHttpLoader(http)

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideRouter(routes),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        useDefaultLang: true,
        loader: {
          provide: TranslateLoader,
          useFactory: httpLoaderFactory,
          deps: [HttpClient],
        },
      }),
    ),
    // highlight-next-line
    provideNgxTranslateRoutes(),
  ],
}
```

## App Component

Switch the language through `TranslateService`. The library reacts to `onLangChange` automatically.

```typescript title="app.component.ts"
import { Component, inject } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

@Component({ /* ... */ })
export class AppComponent {
  private readonly translate = inject(TranslateService)

  switchLanguage(lang: string) {
    this.translate.use(lang)
  }
}
```

## With Custom Configuration

```typescript
provideNgxTranslateRoutes({
  enableRouteTranslate: true,   // default: true
  enableTitleTranslate: true,   // default: true
  enableLanguageInPath: true,   // prepend /en/ to URLs
  includeDefaultLanguageInPath: true,
})
```

See [Configuration](../configuration) for all available options.
