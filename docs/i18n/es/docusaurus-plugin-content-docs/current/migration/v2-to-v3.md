---
id: v2-to-v3
title: Migración a v3
sidebar_position: 1
---

# Migrando de v2 a v3

:::caution
v3 aún no ha sido lanzada. Esta guía describe los breaking changes planificados.
:::

## Breaking Changes

### Angular 18+ requerido

v3 elimina el soporte para Angular 16 y 17.

Actualiza la peer dependency en tu `package.json`:

```json
"@angular/core": "^18.0.0"
```

### SSR a través de entry point secundario

La lógica SSR se ha movido a un entry point separado para reducir el tamaño del bundle en el navegador.

**Antes (v2):**
```typescript
provideNgxTranslateRoutes({
  enableSsrRouteTranslation: true,
  availableLanguages: ['en', 'es'],
})
```

**Después (v3):**
```typescript
// app.config.ts (navegador)
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

### `NgxTranslateRoutesModule` deprecado

La configuración basada en NgModule sigue funcionando en v3 pero está deprecada. Migra al provider standalone:

```typescript
// Antes
NgxTranslateRoutesModule.forRoot({ ... })

// Después
provideNgxTranslateRoutes({ ... })
```

### `provideAppInitializer` reemplaza a `APP_INITIALIZER`

Este es un cambio interno — no se requiere ninguna acción a menos que hayas sobreescrito el token `APP_INITIALIZER` directamente.
