import { ApplicationConfig, importProvidersFrom } from '@angular/core'
import { provideRouter } from '@angular/router'

import { provideClientHydration } from '@angular/platform-browser'
import { provideHttpClient, HttpClient, withFetch } from '@angular/common/http'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { provideNgxTranslateRoutes } from 'projects/ngx-translate-routes/src/public-api'
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
    provideNgxTranslateRoutes({
      enableLanguageInPath: true,
      includeDefaultLanguageInPath: true,
      enableSsrRouteTranslation: true,
      availableLanguages: ['en', 'es'],
    }),
  ],
}
