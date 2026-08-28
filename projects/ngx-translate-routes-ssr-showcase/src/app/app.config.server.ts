import { provideServerRendering } from '@angular/ssr';
import { mergeApplicationConfig, ApplicationConfig } from '@angular/core'
import { provideNgxTranslateRoutesSsr } from 'projects/ngx-translate-routes/ssr/public-api'
import { appConfig } from './app.config'

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideNgxTranslateRoutesSsr({
      availableLanguages: ['en', 'es'],
    }),
  ],
}

export const config = mergeApplicationConfig(appConfig, serverConfig)
