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
  /** `SameSite` attribute applied to cookies when `cacheMethod` is `'cookies'`. Defaults to `'Lax'`. */
  cookieSameSite?: 'Lax' | 'Strict' | 'None'
  /** @deprecated Use the `ngx-translate-routes/ssr` entry point instead. Throws at runtime in v3 when passed to `provideNgxTranslateRoutes()`. */
  enableSsrRouteTranslation?: boolean
  availableLanguages?: string[]
  onLanguageChange?: () => void
  routeTranslationStrategy?: (originalRoute: string) => string
  /** Called when route translation fails instead of logging to `console.error`. */
  onError?: (error: unknown) => void
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
