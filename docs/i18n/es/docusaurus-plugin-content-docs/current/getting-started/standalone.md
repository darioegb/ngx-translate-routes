---
id: standalone
title: Aplicación Standalone
sidebar_position: 1
---

# Configuración: Aplicación Standalone

Para aplicaciones Angular que usan la API standalone (recomendado Angular 17+).

## Configuración Básica

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

## Componente Raíz

Cambia el idioma a través de `TranslateService`. La librería reacciona al evento `onLangChange` automáticamente.

```typescript title="app.component.ts"
import { Component, inject } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

@Component({ /* ... */ })
export class AppComponent {
  private readonly translate = inject(TranslateService)

  cambiarIdioma(lang: string) {
    this.translate.use(lang)
  }
}
```

## Con Configuración Personalizada

```typescript
provideNgxTranslateRoutes({
  enableRouteTranslate: true,   // por defecto: true
  enableTitleTranslate: true,   // por defecto: true
  enableLanguageInPath: true,   // agrega /es/ a las URLs
  includeDefaultLanguageInPath: true,
})
```

Consulta la [Configuración](../configuration) para ver todas las opciones disponibles.
