# NgxTranslateRoutes

![pipeline status](https://github.com/darioegb/ngx-translate-routes/actions/workflows/ci.yml/badge.svg)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=darioegb_ngx-translate-routes&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=darioegb_ngx-translate-routes)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=darioegb_ngx-translate-routes&metric=coverage)](https://sonarcloud.io/summary/new_code?id=darioegb_ngx-translate-routes)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=darioegb_ngx-translate-routes&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=darioegb_ngx-translate-routes)
![NPM Unpacked Size](https://img.shields.io/npm/unpacked-size/ngx-translate-routes?labelColor=%235C5C5C&color=%2320AA1B)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/ngx-translate-routes?labelColor=%235C5C5C&color=%2320AA1B)
![NPM Version](https://img.shields.io/npm/v/ngx-translate-routes?label=npm%20package&labelColor=%235C5C5C&color=%2320AA1B)


## Features

- This service translates titles and route paths.
- Supports language in the path for route translations.

## Dependencies

Latest version available for each version of Angular

| ngx-translate | Angular      |
| ------------- | ------------ |
| 2.3.0         | 16.x to 19.x |
| 2.2.1         | 16.x to 19.x |
| 2.2.0         | 16.x to 19.x |
| 2.1.4         | 16.x to 18.x |
| 2.1.3         | 16.x to 18.x |
| 2.1.2         | 16.x to 18.x |
| 2.1.1         | 16.x to 18.x |
| 2.1.0         | 16.x to 18.x |
| 2.0.1         | 16.x to 18.x |
| 2.0.0         | 16.x to 18.x |
| 1.4.0         | 13.x to 15.x |
| 1.3.0         | 8.x to 12.x  |
| 1.2.0         | 9.x 8.x 7.x  |
| 1.1.0         | 9.x 8.x 7.x  |
| 1.0.2         | 9.x 8.x 7.x  |
| 1.0.0         | 9.x 8.x 7.x  |
| 0.1.0         | 9.x 8.x 7.x  |

## Live Example

You can check how these library work in the next links, on live examples:
- Standalone application with SSR: https://stackblitz.com/edit/ngx-translate-routes-example-standalone
- Angular with modules: https://stackblitz.com/edit/ngx-translate-routes-example

## Install

```bash
  npm install ngx-translate-routes --save
```

`@ngx-translate` package is a required dependency

```bash
  npm install @ngx-translate/core --save
  npm install @ngx-translate/http-loader --save
```

## Setup

**Step 1:** Add `NgxTranslateRoutesModule` to your application configuration. This is the recommended approach as it works with all supported Angular versions. If you are using Angular 19 or later, you can alternatively use `provideNgxTranslateRoutes`.

### Using `NgxTranslateRoutesModule` (Recommended)

```typescript
import { ApplicationConfig, importProvidersFrom } from '@angular/core'
import { provideRouter } from '@angular/router'
import { provideClientHydration } from '@angular/platform-browser'
import { provideHttpClient, HttpClient, withFetch } from '@angular/common/http'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { NgxTranslateRoutesModule } from 'ngx-translate-routes'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'

import { routes } from './app.routes'

export const httpLoaderFactory = (http: HttpClient) =>
  new TranslateHttpLoader(http)

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideRouter(routes),
    provideClientHydration(),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        useDefaultLang: true,
        loader: {
          provide: TranslateLoader,
          useFactory: httpLoaderFactory,
          deps: [HttpClient],
        },
      }),
      NgxTranslateRoutesModule.forRoot() // NgxTranslateRoutesModule added
    ),
  ],
}
```

### Using `provideNgxTranslateRoutes` (Angular 19+ Only)

```typescript
import { ApplicationConfig, importProvidersFrom } from '@angular/core'
import { provideRouter } from '@angular/router'
import { provideClientHydration } from '@angular/platform-browser'
import { provideHttpClient, HttpClient, withFetch } from '@angular/common/http'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { provideNgxTranslateRoutes } from 'ngx-translate-routes'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'

import { routes } from './app.routes'

export const httpLoaderFactory = (http: HttpClient) =>
  new TranslateHttpLoader(http)

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideRouter(routes),
    provideClientHydration(),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        useDefaultLang: true,
        loader: {
          provide: TranslateLoader,
          useFactory: httpLoaderFactory,
          deps: [HttpClient],
        },
      }),
    ),
    provideNgxTranslateRoutes(), // provideNgxTranslateRoutes added
  ],
}
```

If you are using modules, you can configure it as follows:

```typescript
import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule, HttpClient } from '@angular/common/http'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'

import { NgxTranslateRoutesModule } from 'ngx-translate-routes'

// part of configuration ngx translate loader function
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http) // make sure your assets files are in default assets/i18n/*
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule, // required module for ngx-translate
    // required ngx-translate module
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      useDefaultLang: true,
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    NgxTranslateRoutesModule.forRoot(), //NgxTranslateRoutesModule added
  ],
  providers: [],
  bootstrap: [AppComponent],
})
class MainModule {}
```

In app module when import the module can configure if we don want to to translate routes or title for default the service will translate both features.
We can pass to forRoot the following object if dont want to translate titles.

```typescript
NgxTranslateRoutesModule.forRoot({
  enableTitleTranslate: false,
})
```

### Default configuration

By default the configuration object is:

```typescript
{
  enableRouteTranslate: true,
  enableTitleTranslate:  true,
  routePrefix: 'routes',
  titlePrefix: 'titles',
  enableQueryParamsTranslate: false,
  enableLanguageInPath: false,
  includeDefaultLanguageInPath: false,
  routeSuffixesWithQueryParams: {
    route: 'root',
    params: 'params',
  },
  cacheStrategy: 'localStorage', // default cache strategy
  cookieExpirationDays: 7, // default cookie expiration in days
}
```

### NgxTranslateRoutesConfig interface

```typescript
export interface NgxTranslateRoutesConfig {
  enableTitleTranslate?: boolean
  enableRouteTranslate?: boolean
  enableQueryParamsTranslate?: boolean
  enableLanguageInPath?: boolean
  includeDefaultLanguageInPath?: boolean
  routePrefix?: string
  routeSuffixesWithQueryParams?: RouteSuffixesWithQueryParams
  routesUsingStrategy?: string[]
  titlePrefix?: string
  onLanguageChange?: () => void
  routeTranslationStrategy?: (originalRoute: string) => string
  cacheStrategy?: 'localStorage' | 'cookie'
  cookieExpirationDays?: number
}
```

**Step 2:** Add error message configuration in JSON file. Ngx-translate and others internationalizations packages manage json files for each idiom thant manage. For example is your application manage english langague you must create in assets/i18n/en.jsone all the titles and routes you need to translate in your application. Every property in the json will be named as we want to discribe route, by example:

```javascript
  // assets/i18n/en.json
  {
    "titles": {
        "about": "About Us",
        "users": {
            "root": "Users",
            "profile": "User Profile",
            "myaccount": "List Users"
        }
    },
    "routes": {
        "about": "aboutUs",
        "myaccount": "myAccount"
    }
  }
```

## Use

After configuration you can use the service customizing your routes object as follow example

```typescript
// app.routing.modules.ts
const routes: Routes = [
  { path: 'about', component: AboutComponent, data: { title: 'about' } },
  {
    path: 'profile',
    component: MyprofileComponent,
    data: { title: 'profile' },
  },
  {
    path: 'myaccount',
    component: MyaccountComponent,
    data: { title: 'myaccount' },
  },
  { path: 'dashboard', component: DashboardComponent, title: 'Dashboard' },
]
```

For translate titles we need to add in data object title value respecting the tree we create for translate titles for example title: **'about'**, will be replace with about value inside json translation file, follow the json in step 2 of cofiguration it title will replace with **About Us**. If we dont add translate for some title we will follow Dashboard example only add title attribute with the final value.

For translate routes is litle easy we only need to create the route object inside translation follow the json in step 2 of configuration. The route key in translate file must be the same as path string.

### Dynamic Title

If you have a dynamic route similar to the following:

```typescript
// someRouteFile-routing.module.ts
{
  path: 'profile/:userId',
  component: ProfileComponent,
  data: {
    title: 'users.profile',
  }
}
```

In the translation file you should respect the same name as the dynamic variable of the routes and the service will generate the translation of the dynamic title by replacing this variable with the corresponding value.

```javascript
// assets/i18n/en.json
{
  "titles": {
    "users": {
      "profile": "User Profile {{userId}}",
    }
  },
  // others translations
}
```

### Query params translation

Skip this configuration if you only wish to translate the path of the route with query parameters without translating the parameters themselves.

```typescript
// app.modules.ts

@NgModule({
  imports: [
    //  Others configurations
    NgxTranslateRoutesModule.forRoot({
      enableQueryParamsTranslate: true,
      // Optional setting
      routeSuffixesWithQueryParams: {
        route: 'customRoot',
        params: 'customParams',
      },
    }),
  ],
})
export class AppModule {}
```

```javascript
  // assets/i18n/en.json
  {
    "routes": {
      //  translations
      "example": {
        "customRoot": "example",
        "customParams": {
          "param1": "paramOne"
        }
      }
    }
  }
```

In this example, the library will now perform translations for the query parameters. If you want to skip the query parameter translations, the library will by default translate the path alone while keeping the original name of the query parameters. This allows users to organize their translation keys according to their own preferences or existing structures.

### Customizing Route & Title paths

```typescript
// app.modules.ts

@NgModule({
  imports: [
    //  Others configurations
    NgxTranslateRoutesModule.forRoot({
      routePrefix: 'customRoutes',
      titlePrefix: 'customTitles',
    }),
  ],
})
export class AppModule {}
```

```javascript
  // assets/i18n/en.json
  {
    "customTitles": {
      // translations
    },
    "customRoutes": {
      //  translations
    }
  }
```

In this example, the library will now use customRoutes as the prefix for route translations and customTitles as the prefix for title translations. This allows users to organize their translation keys according to their own preferences or existing structures.

### Customizing route translation strategy

```typescript
@NgModule({
  imports: [
    NgxTranslateRoutesModule.forRoot({
      routeTranslationStrategy: (path: string) => `new-${path}`,
      routesUsingStrategy: ['products'],
    }),
  ],
})
export class AppModule {}
```

In this example, only the products routes will use the routeTranslationStrategy. For other routes, the default translation will be used.

### Customizing language change events

```typescript
@NgModule({
  imports: [
    NgxTranslateRoutesModule.forRoot({
      onLanguageChange: () => {
        console.log(
          'The application language has changed. Perform additional actions here.',
        )
        // For example, you could reload translated data or notify components.
      },
    }),
  ],
})
export class AppModule {}
```

With this in mind, you can provide your own function to handle events when the language changes in your application. This allows them to execute custom actions in response to the language change, such as updating data, notifying components, reloading the page, etc.

### Customizing cache strategy

You can choose between `localStorage` and `cookie` for caching the translations. If you choose `cookie`, you can also set the expiration time for the cookies.

```typescript
@NgModule({
  imports: [
    NgxTranslateRoutesModule.forRoot({
      cacheStrategy: 'cookie',
      cookieExpirationDays: 30, // cookies will expire in 30 days
    }),
  ],
})
export class AppModule {}
```

In this example, the library will use cookies to cache the translations, and the cookies will expire in 30 days.

## Language in Path

The library now supports adding the language as part of the route path. To enable this feature, configure the `NgxTranslateRoutesModule` as follows:

```typescript
@NgModule({
  imports: [
    NgxTranslateRoutesModule.forRoot({
      enableLanguageInPath: true, // Enable language in the path
      includeDefaultLanguageInPath: true, // Include default language in the path
    }),
  ],
})
export class AppModule {}
```

### Example JSON Configuration

```javascript
// assets/i18n/en.json
{
  "routes": {
    "about": "aboutUs",
    "contact": "contactUs"
  }
}

// assets/i18n/es.json
{
  "routes": {
    "about": "sobreNosotros",
    "contact": "contacto"
  }
}
```

With this configuration:
- Routes will include the language in the path, e.g., `/en/aboutUs` or `/es/sobreNosotros`.
- If `includeDefaultLanguageInPath` is set to `true`, the default language (e.g., `en`) will also appear in the path, such as `/en/aboutUs`. If this flag is not set, the default language will not be included in the path (e.g., `/aboutUs`).

## Test

To test the library, you can use the following showcase projects:

- **Ngx-translate-routes-showcase**: This project demonstrates the usage of the library in a standard Angular application.
- **Ngx-translate-routes-ssr-showcase**: This project demonstrates the usage of the library in an Angular application with server-side rendering (SSR).

### Running the Projects

1. Clone the repository and navigate to the project directory.
2. Install the dependencies by running:
  ```bash
  npm install
  ```
3. To run the standard showcase project, navigate to the `ngx-translate-routes-showcase` directory and execute:
  ```bash
  ng serve
  ```
4. To run the SSR showcase project, navigate to the `ngx-translate-routes-ssr-showcase` directory and execute:
  ```bash
  npm run dev:ssr
  ```

These commands will start the respective projects, and you can view them in your browser at `http://localhost:4200`.


## License

MIT

---

> Github [@darioegb](https://github.com/darioegb) &nbsp;&middot;&nbsp;
