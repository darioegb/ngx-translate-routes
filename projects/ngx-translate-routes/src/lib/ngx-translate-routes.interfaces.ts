export interface NgxTranslateRoutesConfig {
  enableTitleTranslate?: boolean
  enableRouteTranslate?: boolean
  enableQueryParamsTranslate?: boolean
  routePrefix?: string
  routeSuffixesWithQueryParams?: RouteSuffixesWithQueryParams
  routesUsingStrategy?: string[]
  titlePrefix?: string
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
