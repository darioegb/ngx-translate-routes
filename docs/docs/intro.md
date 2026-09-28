---
id: intro
slug: /
title: Introduction
sidebar_position: 1
---

# NgxTranslateRoutes

[![CI](https://github.com/darioegb/ngx-translate-routes/actions/workflows/ci.yml/badge.svg)](https://github.com/darioegb/ngx-translate-routes/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/ngx-translate-routes?label=npm%20package&labelColor=%235C5C5C&color=%2320AA1B)](https://www.npmjs.com/package/ngx-translate-routes)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=darioegb_ngx-translate-routes&metric=coverage)](https://sonarcloud.io/summary/new_code?id=darioegb_ngx-translate-routes)

**NgxTranslateRoutes** is an Angular library that automatically translates route paths and page titles using [@ngx-translate/core](https://github.com/ngx-translate/core).

## Features

- ✅ **Route translation** — automatically replaces URL segments with translated values
- ✅ **Title translation** — sets `document.title` from your translation files
- ✅ **Language in path** — prepends the active locale to URLs (`/es/mi-ruta`)
- ✅ **SSR support** — works with `@angular/ssr`
- ✅ **Query param translation** — optionally translates query parameter names
- ✅ **Custom strategies** — override translation logic per route
- ✅ **Multiple cache strategies** — localStorage or cookies
- ✅ **Standalone** — first-class support; NgModule API is deprecated in v3

## Live Examples

| Example                 | Link                                                                                      |
| ----------------------- | ----------------------------------------------------------------------------------------- |
| Standalone app with SSR | [Open in Stackblitz](https://stackblitz.com/edit/ngx-translate-routes-example-standalone) |
| NgModule app            | [Open in Stackblitz](https://stackblitz.com/edit/ngx-translate-routes-example)            |

## How It Works

The library hooks into Angular's router events. On each `NavigationEnd`, it reads the active route's `data.title` and path segments, looks them up in your `@ngx-translate` translation files, and updates both the URL and the document title — without triggering a new navigation.

```
User navigates to /about
    └─▶ NavigationEnd fires
         └─▶ NgxTranslateRoutes reads data.title = 'about'
              ├─▶ Translates title  → 'Sobre Nosotros'  (document.title)
              └─▶ Translates path   → '/sobreNosotros'  (location.replaceState)
```

## Compatibility

Latest version available for each version of Angular

| ngx-translate-routes | Angular      |
| -------------------- | ------------ |
| 3.1.1                | 18.x to 22.x |
| 3.1.0                | 18.x to 22.x |
| 3.0.0                | 18.x to 22.x |
| 2.4.0                | 16.x to 21.x |
| 2.3.6                | 16.x to 21.x |
| 2.3.5                | 16.x to 21.x |
| 2.3.4                | 16.x to 21.x |
| 2.3.3                | 16.x to 21.x |
| 2.3.2                | 16.x to 19.x |
| 2.3.1                | 16.x to 19.x |
| 2.3.0                | 16.x to 19.x |
| 2.2.1                | 16.x to 19.x |
| 2.2.0                | 16.x to 19.x |
| 2.1.4                | 16.x to 18.x |
| 2.1.3                | 16.x to 18.x |
| 2.1.2                | 16.x to 18.x |
| 2.1.1                | 16.x to 18.x |
| 2.1.0                | 16.x to 18.x |
| 2.0.1                | 16.x to 18.x |
| 2.0.0                | 16.x to 18.x |
| 1.4.0                | 13.x to 15.x |
| 1.3.0                | 8.x to 12.x  |
| 1.2.0                | 9.x 8.x 7.x  |
| 1.1.0                | 9.x 8.x 7.x  |
| 1.0.2                | 9.x 8.x 7.x  |
| 1.0.0                | 9.x 8.x 7.x  |
| 0.1.0                | 9.x 8.x 7.x  |
