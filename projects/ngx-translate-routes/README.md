# NgxTranslateRoutes

[![pipeline status](https://gitlab.com/darioegb/ngx-translate-routes/badges/master/pipeline.svg)](https://gitlab.com/darioegb/ngx-translate-routes/-/commits/master)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=darioegb_ngx-translate-routes&metric=alert_status)](https://sonarcloud.io/dashboard?id=darioegb_ngx-translate-routes)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=darioegb_ngx-translate-routes&metric=coverage)](https://sonarcloud.io/dashboard?id=darioegb_ngx-translate-routes)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=darioegb_ngx-translate-routes&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=darioegb_ngx-translate-routes)

## Features
 - This service translate title and route path.

## Dependencies
Latest version available for each version of Angular

| ngx-translate |   Angular     |
|---------------|---------------|
| 1.3.0         |  11.x to 8.x  |
| 1.2.0         |  9.x 8.x 7.x  |
| 1.1.0         |  9.x 8.x 7.x  |
| 1.0.2         |  9.x 8.x 7.x  |
| 1.0.0         |  9.x 8.x 7.x  |
| 0.1.0         |  9.x 8.x 7.x  |

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

**step 1:** Add NgxTranslateRoutesModule to appModule, make sure you have configured ngx-translate as well

```typescript
  import { BrowserModule } from '@angular/platform-browser';
  import { HttpClientModule, HttpClient } from '@angular/common/http';
  import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
  import { TranslateHttpLoader } from '@ngx-translate/http-loader';

  import { NgxTranslateRoutesModule } from 'ngx-translate-routes';

  // part of configuration ngx translate loader function
  export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http); // make sure your assets files are in default assets/i18n/*
  }

  @NgModule({
    declarations: [
      AppComponent
    ],
    imports: [
      BrowserModule,
      HttpClientModule, // required module for ngx-translate
      // required ngx-translate module
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        useDefaultLang: true,
        loader: {
          provide: TranslateLoader,
          useFactory: (HttpLoaderFactory),
          deps: [HttpClient]
        }
      }),
      NgxTranslateRoutesModule.forRoot(),//NgxTranslateRoutesModule added
    ],
    providers: [],
    bootstrap: [AppComponent]
  })
  class MainModule {}
```

In app module when import the module can configure if we don want to to translate routes or title for default the service will translate both features. 
We can pass to forRoot the following object if dont want to translate titles.
```typescript
 NgxTranslateRoutesModule.forRoot({
      enableTitleTranslate: false
    })
```

### Configuration Object
```typescript
  NgxTranslateRoutesConfig {
    enableRouteTranslate?: boolean,
    enableTitleTranslate?: boolean
  }
```

**step  2**
**Add error message configuration in JSON file**
 Ngx-translate and others internationalizations packages manage json files for each idiom thant manage. For example is your application manage english langague you must create in assets/i18n/en.jsone all the titles and routes you need to translate in your application. Every property in the json will be named as we want to discribe route, by example:
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
You must respect titles and routes key.
If you change some of these keys, the library does not work for you to change.

## Use

After configuration you can use the service customizing your routes object as follow example 

```typescript
  // app.routing.modules.ts 
  const routes: Routes = [
    { path: 'about', component: AboutComponent, data: {title: 'titles.about'} },
    { path: 'profile', component: MyprofileComponent, data: {title: 'titles.profile'} },
    { path: 'myaccount', component: MyaccountComponent, data: {title: 'titles.myaccount'} },
    { path: 'dashboard', component: DashboardComponent, data: {title: 'Dashboard'} }
  ];
```
For translate titles we need to add in data object title value respecting the tree we create for translate titles for example title: **'titles.about'**, will be replace with about value inside json translation file, follow the json in step 2 of cofiguration it title will replace with **About Us**. If we dont add translate for some title we will follow Dashboard example only add for title the final value.  

For translate routes is litle easy we only need to create the route object inside translation follow the json in step 2 of configuration. The route key in translate file must be the same as path string.

## License

MIT

---

> GitLab [@darioegb](https://gitlab.com/darioegb) &nbsp;&middot;&nbsp;
