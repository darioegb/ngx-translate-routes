import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  PLATFORM_ID,
  provideAppInitializer,
} from '@angular/core'
import { isPlatformBrowser, isPlatformServer } from '@angular/common'
import {
  NGX_TRANSLATE_ROUTES_CONFIG,
  NgxTranslateRoutesConfig,
  NgxTranslateRoutesService,
  DEFAULT_CONFIG,
} from 'ngx-translate-routes'

export interface NgxTranslateRoutesSsrConfig extends NgxTranslateRoutesConfig {
  /** Languages available for SSR route translation. */
  availableLanguages?: string[]
}

export function provideNgxTranslateRoutesSsr(
  config?: NgxTranslateRoutesSsrConfig,
): EnvironmentProviders {
  const mergedConfig: Required<NgxTranslateRoutesConfig> = {
    ...DEFAULT_CONFIG,
    ...config,
    enableSsrRouteTranslation: true,
  }

  return makeEnvironmentProviders([
    {
      provide: NGX_TRANSLATE_ROUTES_CONFIG,
      useValue: mergedConfig,
    },
    provideAppInitializer(async () => {
      const platformId = inject(PLATFORM_ID)
      const service = inject(NgxTranslateRoutesService)

      if (isPlatformBrowser(platformId)) {
        service.init()
      } else if (isPlatformServer(platformId)) {
        await service.initForSsr()
        service.init()
      }
    }),
  ])
}
