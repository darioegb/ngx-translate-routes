---
id: configuration
title: Referencia de Configuración
sidebar_position: 4
---

# Referencia de Configuración

Todas las opciones pueden pasarse a `provideNgxTranslateRoutes(config)` y `NgxTranslateRoutesModule.forRoot(config)`.

## Opciones

| Opción | Tipo | Por defecto | Descripción |
|--------|------|-------------|-------------|
| `enableRouteTranslate` | `boolean` | `true` | Traduce los segmentos del path de la URL |
| `enableTitleTranslate` | `boolean` | `true` | Traduce `document.title` |
| `enableQueryParamsTranslate` | `boolean` | `false` | Traduce los nombres de los query params |
| `enableLanguageInPath` | `boolean` | `false` | Agrega el código de locale a la URL (`/es/ruta`) |
| `includeDefaultLanguageInPath` | `boolean` | `false` | Incluye el locale por defecto en la URL (`/en/route`) |
| `routePrefix` | `string` | `'routes'` | Clave raíz en el archivo de traducción para rutas |
| `titlePrefix` | `string` | `'titles'` | Clave raíz en el archivo de traducción para títulos |
| `cacheMethod` | `'localStorage' \| 'cookies'` | `'localStorage'` | Backend de almacenamiento |
| `cookieExpirationDays` | `number` | `30` | TTL de la cookie cuando `cacheMethod` es `'cookies'` |
| `enableSsrRouteTranslation` | `boolean` | `false` | Activa el registro de rutas en SSR |
| `availableLanguages` | `string[]` | `['en']` | Idiomas disponibles (usado para detección en SSR) |
| `onLanguageChange` | `() => void` | `undefined` | Callback al cambiar idioma y re-traducir |
| `routeTranslationStrategy` | `Function` | `undefined` | Función personalizada: `(route: string) => string` |
| `routesUsingStrategy` | `string[]` | `[]` | Segmentos donde aplica la función personalizada |

## Valores por Defecto

```typescript
import { DEFAULT_CONFIG } from 'ngx-translate-routes'
```

## Propiedades de Datos en Rutas

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `data.title` | `string` | Clave de traducción para el título |
| `data.skipTranslation` | `boolean` | Omite traducción de título y ruta |
