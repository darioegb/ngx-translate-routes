---
id: custom-strategy
title: Custom Translation Strategy
sidebar_position: 4
---

# Custom Translation Strategy

Override the default translation logic for specific routes.

## Use Case

Useful when certain route segments shouldn't be looked up in the translation file — for example, segments derived from API data or that follow a fixed pattern.

## Setup

```typescript
provideNgxTranslateRoutes({
  routeTranslationStrategy: (originalRoute: string) => {
    // Return the translated string for the route segment
    return myCustomDictionary[originalRoute] ?? originalRoute
  },
  routesUsingStrategy: ['dashboard', 'admin'],
})
```

`routesUsingStrategy` is the list of route path segments where the custom function is invoked instead of the translation file lookup.

## Example — API-driven labels

```typescript
const routeLabels: Record<string, string> = {
  dashboard: 'panel',
  settings: 'configuracion',
}

provideNgxTranslateRoutes({
  routeTranslationStrategy: (route) => routeLabels[route] ?? route,
  routesUsingStrategy: Object.keys(routeLabels),
})
```

:::tip
Segments **not** listed in `routesUsingStrategy` continue to use the standard translation file lookup.
:::
