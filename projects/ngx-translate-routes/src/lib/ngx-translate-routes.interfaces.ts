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
  /** @deprecated Use the `ngx-translate-routes/ssr` entry point instead. Throws at runtime in v3. */
  enableSsrRouteTranslation?: boolean
  /** @deprecated Use the `ngx-translate-routes/ssr` entry point instead. Throws at runtime in v3. */
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
