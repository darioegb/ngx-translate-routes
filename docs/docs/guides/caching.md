---
id: caching
title: Caching Strategy
sidebar_position: 5
---

# Caching Strategy

The library keeps a map of `originalPath → translatedPath` so that browser Back/Forward navigation and language changes can restore the correct Angular route.

## localStorage (default)

```typescript
provideNgxTranslateRoutes({
  cacheMethod: 'localStorage',
})
```

Data persists across tabs and browser sessions.

## Cookies

```typescript
provideNgxTranslateRoutes({
  cacheMethod: 'cookies',
  cookieExpirationDays: 7, // default: 30
})
```

Useful when you need the storage to expire or when `localStorage` is unavailable (e.g. Safari ITP restrictions).

### Cookie attributes

Cookies are written with `SameSite=Lax` by default. Override it with `cookieSameSite` if your app needs a stricter or looser policy:

```typescript
provideNgxTranslateRoutes({
  cacheMethod: 'cookies',
  cookieSameSite: 'Strict', // 'Lax' | 'Strict' | 'None'
})
```

The `Secure` attribute is added automatically whenever the page is served over HTTPS — there's no config flag for it, since it should never apply to `http:` pages.

:::note SSR
On the server side the library uses Angular `TransferState` regardless of `cacheMethod`, so the translated path is available immediately after hydration.
:::
