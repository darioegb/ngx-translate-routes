---
id: query-params
title: Query Params Translation
sidebar_position: 3
---

# Query Parameter Translation

Translate the **names** (keys) of query parameters, not their values.

## Enable

```typescript
provideNgxTranslateRoutes({
  enableQueryParamsTranslate: true,
})
```

Only active when the current language differs from the default language.

## Translation File Structure

Use the `routeSuffixesWithQueryParams` convention (defaults: `route: 'root'`, `params: 'params'`):

```json title="en.json"
{
  "routes": {
    "search": {
      "root": "search",
      "params": {
        "query": "query",
        "page": "page"
      }
    }
  }
}
```

```json title="es.json"
{
  "routes": {
    "search": {
      "root": "buscar",
      "params": {
        "query": "consulta",
        "page": "pagina"
      }
    }
  }
}
```

## Result

| Language | URL |
|----------|-----|
| `en` | `/search?query=angular&page=1` |
| `es` | `/buscar?consulta=angular&pagina=1` |

## Custom Suffixes

```typescript
provideNgxTranslateRoutes({
  enableQueryParamsTranslate: true,
  routeSuffixesWithQueryParams: {
    route: 'path',    // default: 'root'
    params: 'query',  // default: 'params'
  },
})
```
