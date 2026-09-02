---
id: v2-to-v3
title: Migración a v3
sidebar_position: 1
---

# Migrando de v2 a v3

## Breaking Changes

### Angular 18+ requerido

v3 elimina el soporte para Angular 16 y 17. Actualiza la peer dependency:

```json
"@angular/core": ">=18.0.0"
```

### SSR a través de entry point secundario

`enableSsrRouteTranslation` ha sido eliminado de `provideNgxTranslateRoutes()` — pasarlo ahora lanza un error en tiempo de ejecución. La configuración SSR se ha movido a un entry point dedicado para mantener el bundle del navegador liviano.

**Antes (v2):**
```typescript
import { provideNgxTranslateRoutes } from 'ngx-translate-routes'

// app.config.ts
provideNgxTranslateRoutes({
  enableSsrRouteTranslation: true,
  availableLanguages: ['en', 'es'],
})
```

**Después (v3):**
```typescript
// app.config.ts (navegador — sin opciones SSR)
import { provideNgxTranslateRoutes } from 'ngx-translate-routes'

provideNgxTranslateRoutes({ /* opciones browser */ })
```

```typescript
// app.config.server.ts
import { provideNgxTranslateRoutesSsr } from 'ngx-translate-routes/ssr'

provideNgxTranslateRoutesSsr({
  availableLanguages: ['en', 'es'],
})
```

Consulta la [guía SSR](../guides/ssr) para la configuración completa.

### `NgxTranslateRoutesModule` deprecado

La API basada en NgModule sigue funcionando en v3 pero está deprecada. Migra al provider standalone:

```typescript
// Antes
NgxTranslateRoutesModule.forRoot({ ... })

// Después
provideNgxTranslateRoutes({ ... })
```

### `provideAppInitializer` reemplaza a `APP_INITIALIZER` (interno)

Este es un cambio interno — no se requiere ninguna acción a menos que hayas sobreescrito el token `APP_INITIALIZER` directamente.
