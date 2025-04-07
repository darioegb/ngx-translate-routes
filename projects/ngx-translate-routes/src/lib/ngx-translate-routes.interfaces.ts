export interface NgxTranslateRoutesConfig {
  enableTitleTranslate?: boolean
  enableRouteTranslate?: boolean
  enableQueryParamsTranslate?: boolean
  enableLanguageInPath?: boolean
  includeDefaultLanguageInPath?: boolean
  routePrefix?: string
  routeSuffixesWithQueryParams?: RouteSuffixesWithQueryParams
  routesUsingStrategy?: string[]
  titlePrefix?: string
  cacheMethod?: 'localStorage' | 'cookies'
  cookieExpirationDays?: number
  onLanguageChange?: () => void
  routeTranslationStrategy?: (originalRoute: string) => string
}

export interface RoutePath {
  originalPath: string
  translatedPath: string
}

export interface RouteSuffixesWithQueryParams {
  route: string
  params: string
}
