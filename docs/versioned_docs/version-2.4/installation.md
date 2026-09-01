---
id: installation
title: Installation
sidebar_position: 2
---

# Installation

## Requirements

- Angular **16+** (standalone apps require Angular 17+)
- `@ngx-translate/core` **14+**

## Install

```bash
npm install ngx-translate-routes @ngx-translate/core @ngx-translate/http-loader
```

```bash
pnpm add ngx-translate-routes @ngx-translate/core @ngx-translate/http-loader
```

## Translation File Structure

Create translation files at `src/assets/i18n/en.json` and `src/assets/i18n/es.json` (or any locale you support).

The library expects two top-level keys by default: `routes` and `titles`.

```json title="src/assets/i18n/en.json"
{
  "titles": {
    "about": "About Us",
    "myaccount": "My Account",
    "users": {
      "root": "Users",
      "profile": "User Profile"
    }
  },
  "routes": {
    "about": {
      "root": "about"
    },
    "myaccount": "myAccount",
    "users": "users"
  }
}
```

```json title="src/assets/i18n/es.json"
{
  "titles": {
    "about": "Sobre Nosotros",
    "myaccount": "Mi Cuenta",
    "users": {
      "root": "Usuarios",
      "profile": "Perfil de Usuario"
    }
  },
  "routes": {
    "about": {
      "root": "sobreNosotros"
    },
    "myaccount": "miCuenta",
    "users": "usuarios"
  }
}
```

:::tip Route keys
For routes with child segments, use an object with a `root` key for the parent segment. The default language usually maps keys to their original Angular route path.
:::

## Route Configuration

Add a `data.title` property to every route you want to translate. This key maps to `titles.<value>` in your translation file.

```typescript title="app.routes.ts"
export const routes: Routes = [
  {
    path: 'about',
    component: AboutComponent,
    data: { title: 'about' },
  },
  {
    path: 'myAccount',
    component: MyAccountComponent,
    data: { title: 'myaccount' },
  },
  // Skip translation for specific routes
  {
    path: 'dashboard',
    title: 'Dashboard',
    component: DashboardComponent,
    data: { skipTranslation: true },
  },
]
```
