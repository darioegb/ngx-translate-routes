import { NgxTranslateRoutesConfig } from './ngx-translate-routes.interfaces'

export const lastRouteKey = 'lastLocationPath'
export const millisecondsInADay = 24 * 60 * 60 * 1000

export const DEFAULT_CONFIG: Required<NgxTranslateRoutesConfig> = {
  enableRouteTranslate: true,
  enableTitleTranslate: true,
  enableQueryParamsTranslate: false,
  enableLanguageInPath: false,
  includeDefaultLanguageInPath: false,
  routePrefix: 'routes',
  routeSuffixesWithQueryParams: { route: 'root', params: 'params' },
  routesUsingStrategy: [],
  titlePrefix: 'titles',
  cacheMethod: 'localStorage',
  cookieExpirationDays: 30,
  enableSsrRouteTranslation: false,
  availableLanguages: ['en'],
  onLanguageChange: undefined as unknown as () => void,
  routeTranslationStrategy: undefined as unknown as (
    originalRoute: string,
  ) => string,
}
