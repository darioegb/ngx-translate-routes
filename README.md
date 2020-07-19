# NgxTranslateRoutes

## Features
 - This service translate title and route path.

## Dependencies
Latest version available for each version of Angular

| ngx-translate | Angular     |
|-------------------|-------------|
| 0.1.0             | 9.x 8.x 7.x |

## Live Example
You can check how these library work in the next link, on live example:
https://stackblitz.com/edit/ngx-translate-example

## Install

```bash
  npm install ngx-translate --save
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
      NgxTranslateRoutesModule //NgxTranslateRoutesModule added
    ],
    providers: [],
    bootstrap: [AppComponent]
  })
  class MainModule {}
```

**step  2**
**Add error message configuration in JSON file**
 Ngx-translate and others internationalizations packages manage json files for each idiom thant manage. For example is your application manage english langague you must create in assets/i18n/en.json, in the file you will have all the titles you need to translate in your application. Every property in the json will be named as we want to discribe route, by example:
```javascript
  // assets/i18n/en.json
  {
    "titles": {
        "home": "Home",
        "auth": {
          "login": "Login",
          "register": "Register"
        }
    }
  }
```
You must respect titles key name and the structure.
If you change some of these keys, the library does not work for you to change.

## Use


## Test

Ngx-translate-routes-showcase is the testing project. Use ng s to run it.

## License

MIT

---

> GitLab [@darioegb](https://gitlab.com/darioegb) &nbsp;&middot;&nbsp;
