---
id: configuration
title: Configuration Reference
sidebar_position: 4
---

# Configuration Reference

All options can be passed to both `provideNgxTranslateRoutes(config)` and `NgxTranslateRoutesModule.forRoot(config)`.

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enableRouteTranslate` | `boolean` | `true` | Translate URL path segments |
| `enableTitleTranslate` | `boolean` | `true` | Translate `document.title` |
| `enableQueryParamsTranslate` | `boolean` | `false` | Translate query parameter names |
| `enableLanguageInPath` | `boolean` | `false` | Prepend locale code to URL (e.g. `/es/ruta`) |
| `includeDefaultLanguageInPath` | `boolean` | `false` | Include default locale in URL (e.g. `/en/route`) |
| `routePrefix` | `string` | `'routes'` | Top-level key in translation file for route paths |
| `titlePrefix` | `string` | `'titles'` | Top-level key in translation file for page titles |
| `routeSuffixesWithQueryParams` | `object` | `{ route: 'root', params: 'params' }` | Sub-keys used when query param translation is enabled |
| `routeTranslationStrategy` | `Function` | `undefined` | Override translation logic: `(route: string) => string` |
| `routesUsingStrategy` | `string[]` | `[]` | Route segments where `routeTranslationStrategy` applies |
| `cacheMethod` | `'localStorage' \| 'cookies'` | `'localStorage'` | Storage backend for translated path history |
| `cookieExpirationDays` | `number` | `30` | Cookie TTL when `cacheMethod` is `'cookies'` |
| `enableSsrRouteTranslation` | `boolean` | `false` | ⚠️ **Removed from v3** — use [`provideNgxTranslateRoutesSsr()`](guides/ssr) |
| `availableLanguages` | `string[]` | `['en']` | Languages for SSR URL detection. Also used as fallback in browser when `TranslateService.langs` is empty |
| `onLanguageChange` | `() => void` | `undefined` | Callback fired after language change and re-translation |

## Defaults

All defaults are exported as `DEFAULT_CONFIG`:

```typescript
import { DEFAULT_CONFIG } from 'ngx-translate-routes'
```

## Examples

### Minimal — translate titles and routes

```typescript
provideNgxTranslateRoutes()
// same as:
provideNgxTranslateRoutes({
  enableRouteTranslate: true,
  enableTitleTranslate: true,
})
```

### Disable route translation, keep title

```typescript
provideNgxTranslateRoutes({
  enableRouteTranslate: false,
  enableTitleTranslate: true,
})
```

### Cookie cache with 7-day expiration

```typescript
provideNgxTranslateRoutes({
  cacheMethod: 'cookies',
  cookieExpirationDays: 7,
})
```

### Custom translation key prefixes

```typescript
provideNgxTranslateRoutes({
  routePrefix: 'navigation.paths',
  titlePrefix: 'navigation.titles',
})
```

### Language change callback

```typescript
provideNgxTranslateRoutes({
  onLanguageChange: () => {
    console.log('Language changed and routes re-translated')
  },
})
```

## Route Data Properties

Configure individual routes via `data`:

| Property | Type | Description |
|----------|------|-------------|
| `data.title` | `string` | Translation key for the page title (maps to `titlePrefix.value`) |
| `data.skipTranslation` | `boolean` | Skip both title and route translation for this route |
| `title` | `string` | Angular native title — used as-is when `skipTranslation: true` |

```typescript
const routes: Routes = [
  {
    path: 'about',
    component: AboutComponent,
    data: { title: 'about' },           // → translated
  },
  {
    path: 'dashboard',
    title: 'Dashboard',
    component: DashboardComponent,
    data: { skipTranslation: true },    // → not translated
  },
]
```
