export interface NgxTranslateRoutesConfig {
  enableTitleTranslate?: boolean
  enableRouteTranslate?: boolean
  routePrefix?: string
  titlePrefix?: string
  onLanguageChange?: () => void
  routeTranslationStrategy?: (originalRoute: string) => string
  routesUsingStrategy?: string[]
}

export interface RoutePath {
  path: string
  translatedPath: string
}
