---
id: custom-strategy
title: Estrategia de Traducción Personalizada
sidebar_position: 4
---

# Estrategia de Traducción Personalizada

Sobreescribe la lógica de traducción por defecto para rutas específicas.

## Caso de Uso

Útil cuando ciertos segmentos de ruta no deben buscarse en el archivo de traducción — por ejemplo, segmentos derivados de datos de una API o que siguen un patrón fijo.

## Configuración

```typescript
provideNgxTranslateRoutes({
  routeTranslationStrategy: (rutaOriginal: string) => {
    // Devuelve el string traducido para el segmento de ruta
    return miDiccionario[rutaOriginal] ?? rutaOriginal
  },
  routesUsingStrategy: ['dashboard', 'admin'],
})
```

`routesUsingStrategy` es la lista de segmentos de path donde se invoca la función personalizada en lugar de buscar en el archivo de traducción.

## Ejemplo — Etiquetas Dinámicas desde API

```typescript
const etiquetasRuta: Record<string, string> = {
  dashboard: 'panel',
  settings: 'configuracion',
}

provideNgxTranslateRoutes({
  routeTranslationStrategy: (ruta) => etiquetasRuta[ruta] ?? ruta,
  routesUsingStrategy: Object.keys(etiquetasRuta),
})
```

:::tip
Los segmentos **no** listados en `routesUsingStrategy` continúan usando la búsqueda estándar en el archivo de traducción.
:::
