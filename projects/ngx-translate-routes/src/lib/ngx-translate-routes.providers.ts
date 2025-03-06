import { Provider } from '@angular/core'
import { TitleCasePipe } from '@angular/common'
import { NGX_TRANSLATE_ROUTES_CONFIG } from './ngx-translate-routes.token'
import { NgxTranslateRoutesConfig } from './ngx-translate-routes.interfaces'

export function provideNgxTranslateRoutes(
  config?: NgxTranslateRoutesConfig,
): Provider[] {
  return [
    {
      provide: NGX_TRANSLATE_ROUTES_CONFIG,
      useValue: {
        enableRouteTranslate: config?.enableRouteTranslate ?? true,
        enableTitleTranslate: config?.enableTitleTranslate ?? true,
        enableQueryParamsTranslate: config?.enableQueryParamsTranslate,
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
      },
    },
    TitleCasePipe,
  ]
}
