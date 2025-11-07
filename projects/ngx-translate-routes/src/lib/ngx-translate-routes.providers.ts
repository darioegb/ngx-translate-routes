import {
  APP_INITIALIZER,
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  PLATFORM_ID,
} from '@angular/core'
import {
  isPlatformBrowser,
  isPlatformServer,
  TitleCasePipe,
} from '@angular/common'
import { NGX_TRANSLATE_ROUTES_CONFIG } from './ngx-translate-routes.token'
import { NgxTranslateRoutesConfig } from './ngx-translate-routes.interfaces'
import { NgxTranslateRoutesService } from './ngx-translate-routes.service'

export function provideNgxTranslateRoutes(
  config?: NgxTranslateRoutesConfig,
): EnvironmentProviders {
  const providers = [
    {
      provide: NGX_TRANSLATE_ROUTES_CONFIG,
      useValue: {
        enableRouteTranslate: config?.enableRouteTranslate ?? true,
        enableTitleTranslate: config?.enableTitleTranslate ?? true,
        enableQueryParamsTranslate: config?.enableQueryParamsTranslate ?? false,
        enableLanguageInPath: config?.enableLanguageInPath ?? false,
        includeDefaultLanguageInPath:
          config?.includeDefaultLanguageInPath ?? false,
        routePrefix: config?.routePrefix ?? 'routes',
        routeSuffixesWithQueryParams: config?.routeSuffixesWithQueryParams ?? {
          route: 'root',
          params: 'params',
        },
        routesUsingStrategy: config?.routesUsingStrategy ?? [],
        titlePrefix: config?.titlePrefix ?? 'titles',
        cacheMethod: config?.cacheMethod ?? 'localStorage',
        cookieExpirationDays: config?.cookieExpirationDays ?? 30,
        onLanguageChange: config?.onLanguageChange ?? undefined,
        routeTranslationStrategy: config?.routeTranslationStrategy ?? undefined,
        enableSsrRouteTranslation: config?.enableSsrRouteTranslation ?? false,
        availableLanguages: config?.availableLanguages ?? ['en'],
      },
    },
    TitleCasePipe,
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

        return
      },
      deps: [PLATFORM_ID],
      multi: true,
    },
  ]

  return makeEnvironmentProviders(providers)
}
