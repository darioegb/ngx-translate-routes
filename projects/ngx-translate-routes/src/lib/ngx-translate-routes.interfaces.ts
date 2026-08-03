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
  enableSsrRouteTranslation?: boolean
  availableLanguages?: string[]
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

export interface PreloadedRoute {
  originalPath: string
  translatedPaths: Record<string, string>
  component: unknown
  data?: Record<string, unknown>
  children?: PreloadedRoute[]
}
