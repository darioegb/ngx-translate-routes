import {
  APP_INITIALIZER,
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  PLATFORM_ID,
} from '@angular/core'
import { isPlatformBrowser, isPlatformServer } from '@angular/common'
import { NGX_TRANSLATE_ROUTES_CONFIG } from './ngx-translate-routes.token'
import { NgxTranslateRoutesConfig } from './ngx-translate-routes.interfaces'
import { NgxTranslateRoutesService } from './ngx-translate-routes.service'
import { DEFAULT_CONFIG } from './ngx-translate-routes.constants'

export function provideNgxTranslateRoutes(
  config?: NgxTranslateRoutesConfig,
): EnvironmentProviders {
  const providers = [
    {
      provide: NGX_TRANSLATE_ROUTES_CONFIG,
      useValue: { ...DEFAULT_CONFIG, ...config },
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => async () => {
        const platformId = inject(PLATFORM_ID)
        const translateRoutesService = inject(NgxTranslateRoutesService)

        if (isPlatformBrowser(platformId)) {
          translateRoutesService.init()
        } else if (isPlatformServer(platformId)) {
          await translateRoutesService.initForSsr()
          translateRoutesService.init()
        }
      },
      multi: true,
    },
  ]

  return makeEnvironmentProviders(providers)
}
