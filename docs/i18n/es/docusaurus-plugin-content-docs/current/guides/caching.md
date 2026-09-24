---
id: caching
title: Estrategia de Caché
sidebar_position: 5
---

# Estrategia de Caché

La librería mantiene un mapa de `pathOriginal → pathTraducido` para que la navegación con Atrás/Adelante del navegador y los cambios de idioma puedan restaurar la ruta correcta de Angular.

## localStorage (por defecto)

```typescript
provideNgxTranslateRoutes({
  cacheMethod: 'localStorage',
})
```

Los datos persisten entre pestañas y sesiones del navegador.

## Cookies

```typescript
provideNgxTranslateRoutes({
  cacheMethod: 'cookies',
  cookieExpirationDays: 7, // por defecto: 30
})
```

Útil cuando necesitas que el almacenamiento expire o cuando `localStorage` no está disponible (p.ej. restricciones de Safari ITP).

### Atributos de la cookie

Las cookies se escriben con `SameSite=Lax` por defecto. Cambialo con `cookieSameSite` si tu app necesita una política más estricta o más laxa:

```typescript
provideNgxTranslateRoutes({
  cacheMethod: 'cookies',
  cookieSameSite: 'Strict', // 'Lax' | 'Strict' | 'None'
})
```

El atributo `Secure` se agrega automáticamente cuando la página se sirve sobre HTTPS — no hay flag de configuración para esto, ya que nunca debería aplicarse a páginas `http:`.

:::note SSR
En el servidor, la librería usa `TransferState` de Angular independientemente de `cacheMethod`, para que el path traducido esté disponible inmediatamente tras la hidratación.
:::
