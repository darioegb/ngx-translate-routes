---
id: ssr
title: Configuración SSR
sidebar_position: 2
---

# Renderizado en el Servidor (SSR)

NgxTranslateRoutes es compatible con `@angular/ssr` mediante el entry point dedicado `ngx-translate-routes/ssr`.

:::info Cambio en v3
`enableSsrRouteTranslation` y `availableLanguages` se han movido fuera de `provideNgxTranslateRoutes()`. Usa `provideNgxTranslateRoutesSsr()` en tu **shared** `app.config.ts`. Consulta la [guía de migración](../migration/v2-to-v3).
:::

## app.config.ts (shared)

`provideNgxTranslateRoutesSsr()` maneja browser y servidor internamente vía `PLATFORM_ID` — va en el config compartido, no en `app.config.server.ts`:

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

No se necesitan cambios aquí — `provideNgxTranslateRoutesSsr` en el config compartido ya gestiona el contexto servidor:

```typescript title="app.config.server.ts"
import { mergeApplicationConfig, ApplicationConfig } from '@angular/core'
import { provideServerRendering } from '@angular/platform-server'
import { appConfig } from './app.config'

const serverConfig: ApplicationConfig = {
  providers: [provideServerRendering()],
}

export const config = mergeApplicationConfig(appConfig, serverConfig)
```

## Cómo Funciona la Detección de Rutas SSR

En el servidor, Angular recibe una URL ya traducida (p.ej. `/es/sobreNosotros`). La librería:

1. Recorre `availableLanguages` buscando una coincidencia en la clave `routes`
2. Encuentra el path original de Angular (`about`)
3. Registra una ruta de redirección: `/es/sobreNosotros` → `about`
4. Angular renderiza el componente correcto

## Opciones de `provideNgxTranslateRoutesSsr`

`provideNgxTranslateRoutesSsr` acepta todas las opciones de `provideNgxTranslateRoutes` más `availableLanguages`. `enableSsrRouteTranslation` siempre es `true` al usar este provider.

| Opción | Tipo | Por defecto | Descripción |
|--------|------|-------------|-------------|
| `availableLanguages` | `string[]` | `['en']` | Idiomas disponibles (usado para detección de URL en el servidor) |

Todas las demás [opciones de configuración](../configuration) también se aceptan.

## Hidratación

`provideClientHydration()` debe incluirse en la configuración del browser para que el `TransferState` de Angular funcione correctamente durante el handoff SSR→browser.

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

## Opciones Requeridas para SSR

| Opción | Valor | Por qué |
|--------|-------|---------|
| `enableSsrRouteTranslation` | `true` | Activa el registro de rutas en el servidor |
| `availableLanguages` | `['en', 'es', ...]` | Permite detectar el idioma desde la URL traducida en el servidor |

## Cómo Funciona la Detección de Rutas SSR

En el servidor, Angular recibe una URL ya traducida (p.ej. `/es/sobreNosotros`). La librería:

1. Recorre `availableLanguages` buscando una coincidencia en la clave `routes`
2. Encuentra el path original de Angular (`about`)
3. Registra una ruta de redirección: `/es/sobreNosotros` → `about`
4. Angular renderiza el componente correcto

## app.config.server.ts

No se requieren cambios — `provideNgxTranslateRoutes` gestiona automáticamente los contextos browser y servidor mediante `PLATFORM_ID`.

## Hidratación

`provideClientHydration()` debe incluirse para que el `TransferState` usado en el handoff SSR→browser funcione correctamente.
