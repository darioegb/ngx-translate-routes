---
id: installation
title: Instalación
sidebar_position: 2
---

# Instalación

## Requisitos

- Angular **16+** (las apps standalone requieren Angular 17+)
- `@ngx-translate/core` **14+**

## Instalar

```bash
npm install ngx-translate-routes @ngx-translate/core @ngx-translate/http-loader
```

```bash
pnpm add ngx-translate-routes @ngx-translate/core @ngx-translate/http-loader
```

## Estructura de Archivos de Traducción

Crea los archivos en `src/assets/i18n/en.json` y `src/assets/i18n/es.json`.

La librería usa por defecto dos claves principales: `routes` y `titles`.

```json title="src/assets/i18n/en.json"
{
  "titles": {
    "about": "About Us",
    "myaccount": "My Account"
  },
  "routes": {
    "about": { "root": "about" },
    "myaccount": "myAccount"
  }
}
```

```json title="src/assets/i18n/es.json"
{
  "titles": {
    "about": "Sobre Nosotros",
    "myaccount": "Mi Cuenta"
  },
  "routes": {
    "about": { "root": "sobreNosotros" },
    "myaccount": "miCuenta"
  }
}
```

## Configuración de Rutas

Agrega la propiedad `data.title` a cada ruta que quieras traducir:

```typescript title="app.routes.ts"
export const routes: Routes = [
  {
    path: 'about',
    component: AboutComponent,
    data: { title: 'about' },
  },
  {
    path: 'dashboard',
    title: 'Dashboard',
    component: DashboardComponent,
    data: { skipTranslation: true },  // sin traducción
  },
]
```
