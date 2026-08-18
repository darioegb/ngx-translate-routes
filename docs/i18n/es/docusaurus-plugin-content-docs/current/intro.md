---
id: intro
slug: /
title: Introducción
sidebar_position: 1
---

# NgxTranslateRoutes

[![CI](https://github.com/darioegb/ngx-translate-routes/actions/workflows/ci.yml/badge.svg)](https://github.com/darioegb/ngx-translate-routes/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/ngx-translate-routes?label=npm%20package&labelColor=%235C5C5C&color=%2320AA1B)](https://www.npmjs.com/package/ngx-translate-routes)

**NgxTranslateRoutes** es una librería para Angular que traduce automáticamente las rutas de URL y los títulos de página usando [@ngx-translate/core](https://github.com/ngx-translate/core).

## Características

- ✅ **Traducción de rutas** — reemplaza los segmentos de URL con sus traducciones
- ✅ **Traducción de títulos** — actualiza `document.title` desde tus archivos de traducción
- ✅ **Idioma en la URL** — agrega el locale activo a las URLs (`/es/mi-ruta`)
- ✅ **Soporte SSR** — compatible con Angular Universal / `@angular/ssr`
- ✅ **Traducción de query params** — traduce los nombres de parámetros de consulta
- ✅ **Estrategias personalizadas** — sobreescribe la lógica de traducción por ruta
- ✅ **Múltiples estrategias de caché** — localStorage o cookies
- ✅ **Standalone y NgModule** — funciona con ambos estilos de aplicación

## Ejemplos en Vivo

| Ejemplo | Enlace |
|---------|--------|
| Aplicación Standalone con SSR | [Abrir en Stackblitz](https://stackblitz.com/edit/ngx-translate-routes-example-standalone) |
| Aplicación con NgModule | [Abrir en Stackblitz](https://stackblitz.com/edit/ngx-translate-routes-example) |

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

| ngx-translate-routes | Angular |
|---|---|
| 2.4.x | 16.x – 21.x |
| 2.3.x | 16.x – 21.x |
| 2.0.x – 2.2.x | 16.x – 19.x |
| 1.4.0 | 13.x – 15.x |
| 1.3.0 | 8.x – 12.x |
