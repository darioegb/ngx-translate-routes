---
id: module
title: NgModule App
sidebar_position: 2
---

# Setup: NgModule App

For Angular apps using the classic `NgModule` architecture.

## Basic Setup

```typescript title="app.module.ts"
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { HttpClient, provideHttpClient } from '@angular/common/http'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
// highlight-next-line
import { NgxTranslateRoutesModule } from 'ngx-translate-routes'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'

export const httpLoaderFactory = (http: HttpClient) =>
  new TranslateHttpLoader(http)

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      useDefaultLang: true,
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    // highlight-next-line
    NgxTranslateRoutesModule.forRoot(),
  ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

## With Custom Configuration

```typescript
NgxTranslateRoutesModule.forRoot({
  enableRouteTranslate: true,
  enableTitleTranslate: true,
  enableLanguageInPath: false,
})
```

:::caution
Import `NgxTranslateRoutesModule` only once in your root `AppModule`. Importing it in feature modules will throw an error.
:::

See [Configuration](../configuration) for all available options.
