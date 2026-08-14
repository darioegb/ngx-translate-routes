---
id: ssr
title: Configuración SSR
sidebar_position: 2
---

# Renderizado en el Servidor (SSR)

NgxTranslateRoutes es compatible con Angular Universal / `@angular/ssr`.

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
