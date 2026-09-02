---
id: module
title: Aplicación NgModule (obsoleta)
sidebar_position: 2
---

# Configuración: Aplicación NgModule

:::warning Obsoleto
`NgxTranslateRoutesModule` está deprecado en v3. Migra a [`provideNgxTranslateRoutes()`](standalone) — consulta la [guía de migración](../migration/v2-to-v3).
:::

Para aplicaciones Angular que aún usan la arquitectura clásica de `NgModule`.

## Configuración Básica

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

## Con Configuración Personalizada

```typescript
NgxTranslateRoutesModule.forRoot({
  enableRouteTranslate: true,
  enableTitleTranslate: true,
  enableLanguageInPath: false,
})
```

:::caution
Importa `NgxTranslateRoutesModule` solo una vez en el `AppModule` raíz. Importarlo en módulos de funcionalidad lanzará un error.
:::

Consulta la [Configuración](../configuration) para ver todas las opciones disponibles.
