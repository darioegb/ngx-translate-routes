# NgxTranslateRoutes

![pipeline status](https://github.com/darioegb/ngx-translate-routes/actions/workflows/ci.yml/badge.svg)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=darioegb_ngx-translate-routes&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=darioegb_ngx-translate-routes)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=darioegb_ngx-translate-routes&metric=coverage)](https://sonarcloud.io/summary/new_code?id=darioegb_ngx-translate-routes)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=darioegb_ngx-translate-routes&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=darioegb_ngx-translate-routes)

## Features

- This service translate title and route path.

## Dependencies

Latest version available for each version of Angular

| ngx-translate | Angular      |
| ------------- | ------------ |
| 2.1.0         | 14.x to 18.x |
| 2.0.1         | 14.x to 18.x |
| 2.0.0         | 14.x to 18.x |
| 1.4.0         | 13.x to 9.x  |
| 1.3.0         | 11.x to 8.x  |
| 1.2.0         | 9.x 8.x 7.x  |
| 1.1.0         | 9.x 8.x 7.x  |
| 1.0.2         | 9.x 8.x 7.x  |
| 1.0.0         | 9.x 8.x 7.x  |
| 0.1.0         | 9.x 8.x 7.x  |

## Live Example

You can check how these library work in the next link, on live example:
https://stackblitz.com/edit/ngx-translate-routes-example

## Install

```bash
  npm install ngx-translate-routes --save
```

`@ngx-translate` package is a required dependency

```bash
  npm install @ngx-translate/core --save
  npm install @ngx-translate/http-loader --save
```

Follows this link for more information about ngx-translate:
https://github.com/ngx-translate/core

## Setup

**Step 1:** Add NgxTranslateRoutesModule to appModule, make sure you have configured ngx-translate as well

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
  routeSuffixesWithQueryParams: {
    route: 'root',
    params: 'params',
  }
}
```

### NgxTranslateRoutesConfig interface

```typescript
export interface NgxTranslateRoutesConfig {
  enableTitleTranslate?: boolean
  enableRouteTranslate?: boolean
  enableQueryParamsTranslate?: boolean
  routePrefix?: string
  routeSuffixesWithQueryParams?: RouteSuffixesWithQueryParams
  routesUsingStrategy?: string[]
  titlePrefix?: string
  onLanguageChange?: () => void
  routeTranslationStrategy?: (originalRoute: string) => string
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

## Test

Ngx-translate-routes-showcase is the testing project. Use ng s to run it.

## License

MIT

---

> Github [@darioegb](https://github.com/darioegb) &nbsp;&middot;&nbsp;
