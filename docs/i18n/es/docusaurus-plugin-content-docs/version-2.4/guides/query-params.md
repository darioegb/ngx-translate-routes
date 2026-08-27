---
id: query-params
title: Traducción de Query Params
sidebar_position: 3
---

# Traducción de Parámetros de Consulta

Traduce los **nombres** (claves) de los query parameters, no sus valores.

## Activar

```typescript
provideNgxTranslateRoutes({
  enableQueryParamsTranslate: true,
})
```

Solo se activa cuando el idioma actual es diferente al idioma por defecto.

## Estructura del Archivo de Traducción

Usa la convención de `routeSuffixesWithQueryParams` (por defecto: `route: 'root'`, `params: 'params'`):

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

## Resultado

| Idioma | URL |
|--------|-----|
| `en` | `/search?query=angular&page=1` |
| `es` | `/buscar?consulta=angular&pagina=1` |

## Sufijos Personalizados

```typescript
provideNgxTranslateRoutes({
  enableQueryParamsTranslate: true,
  routeSuffixesWithQueryParams: {
    route: 'path',   // por defecto: 'root'
    params: 'query', // por defecto: 'params'
  },
})
```
