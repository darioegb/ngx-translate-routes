---
id: intro
slug: /
title: Introducción
sidebar_position: 1
---

import LiveDemo from '@site/src/components/LiveDemo'

# NgxTranslateRoutes

[![CI](https://github.com/darioegb/ngx-translate-routes/actions/workflows/ci.yml/badge.svg)](https://github.com/darioegb/ngx-translate-routes/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/ngx-translate-routes?label=npm%20package&labelColor=%235C5C5C&color=%2320AA1B)](https://www.npmjs.com/package/ngx-translate-routes)

**NgxTranslateRoutes** es una librería para Angular que traduce automáticamente las rutas de URL y los títulos de página usando [@ngx-translate/core](https://github.com/ngx-translate/core).

## Características

- ✅ **Traducción de rutas** — reemplaza los segmentos de URL con sus traducciones
- ✅ **Traducción de títulos** — actualiza `document.title` desde tus archivos de traducción
- ✅ **Idioma en la URL** — agrega el locale activo a las URLs (`/es/mi-ruta`)
- ✅ **Soporte SSR** — compatible con `@angular/ssr`
- ✅ **Traducción de query params** — traduce los nombres de parámetros de consulta
- ✅ **Estrategias personalizadas** — sobreescribe la lógica de traducción por ruta
- ✅ **Múltiples estrategias de caché** — localStorage o cookies
- ✅ **Standalone** — soporte de primera clase; la API NgModule está deprecada en v3

## Ejemplos en Vivo

Probá la librería acá mismo - es la misma app de showcase que vive en el repo:

<LiveDemo />

También podés abrir estos ejemplos listos para usar:

| Ejemplo                       | Enlace                                                                                     |
| ----------------------------- | ------------------------------------------------------------------------------------------ |
| Aplicación Standalone con SSR | [Abrir en Stackblitz](https://stackblitz.com/edit/ngx-translate-routes-example-standalone) |
| Aplicación con NgModule       | [Abrir en Stackblitz](https://stackblitz.com/edit/ngx-translate-routes-example)            |

## Cómo Funciona

La librería se conecta a los eventos del router de Angular. En cada `NavigationEnd`, lee el `data.title` de la ruta activa y los segmentos del path, los busca en tus archivos de traducción de `@ngx-translate`, y actualiza tanto la URL como el título del documento — sin disparar una nueva navegación.

```
El usuario navega a /about
    └─▶ NavigationEnd se dispara
         └─▶ NgxTranslateRoutes lee data.title = 'about'
              ├─▶ Traduce el título  → 'Sobre Nosotros'  (document.title)
              └─▶ Traduce la ruta    → '/sobreNosotros'  (location.replaceState)
```

## Compatibilidad

Última versión disponible para cada versión de Angular

| ngx-translate-routes | Angular     |
| -------------------- | ----------- |
| 3.1.1                | 18.x a 22.x |
| 3.1.0                | 18.x a 22.x |
| 3.0.0                | 18.x a 22.x |
| 2.4.0                | 16.x a 21.x |
| 2.3.6                | 16.x a 21.x |
| 2.3.5                | 16.x a 21.x |
| 2.3.4                | 16.x a 21.x |
| 2.3.3                | 16.x a 21.x |
| 2.3.2                | 16.x a 19.x |
| 2.3.1                | 16.x a 19.x |
| 2.3.0                | 16.x a 19.x |
| 2.2.1                | 16.x a 19.x |
| 2.2.0                | 16.x a 19.x |
| 2.1.4                | 16.x a 18.x |
| 2.1.3                | 16.x a 18.x |
| 2.1.2                | 16.x a 18.x |
| 2.1.1                | 16.x a 18.x |
| 2.1.0                | 16.x a 18.x |
| 2.0.1                | 16.x a 18.x |
| 2.0.0                | 16.x a 18.x |
| 1.4.0                | 13.x a 15.x |
| 1.3.0                | 8.x a 12.x  |
| 1.2.0                | 9.x 8.x 7.x |
| 1.1.0                | 9.x 8.x 7.x |
| 1.0.2                | 9.x 8.x 7.x |
| 1.0.0                | 9.x 8.x 7.x |
| 0.1.0                | 9.x 8.x 7.x |
