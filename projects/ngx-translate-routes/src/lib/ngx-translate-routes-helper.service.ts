import { Injectable, inject } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { Location, DOCUMENT } from '@angular/common'
import { firstValueFrom } from 'rxjs'
import { RoutePath } from './ngx-translate-routes.interfaces'
import { NGX_TRANSLATE_ROUTES_CONFIG } from './ngx-translate-routes.token'
import { lastRouteKey } from './ngx-translate-routes.constants'
import { NgxTranslateRoutesStateService } from './ngx-translate-routes-state.service'

@Injectable({
  providedIn: 'root',
})
export class NgxTranslateRoutesHelperService {
  private readonly translate = inject(TranslateService)
  private readonly title = inject(Title)
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly config = inject(NGX_TRANSLATE_ROUTES_CONFIG)
  private readonly location = inject(Location)
  private readonly router = inject(Router)
  private readonly stateService = inject(NgxTranslateRoutesStateService)
  private readonly document = inject(DOCUMENT)

  private _cachedRoutes: typeof this.router.config | null = null
  private readonly _translationCache = new Map<string, Promise<string>>()
  private readonly _computedConfig = {
    routePrefixDot: `${this.config.routePrefix}.`,
    titlePrefixDot: `${this.config.titlePrefix}.`,
  }
  private readonly _langRegex = /^\/([a-z]{2})(-[A-Z]{2})?(\/|$)/

  private get routesWithoutWildcard() {
    /* istanbul ignore next */
    if (!this._cachedRoutes) {
      this._cachedRoutes = this.router.config.filter(
        (route) => route.path && route.path !== '**',
      )
    }
    return this._cachedRoutes
  }

  private getAvailableLanguages(): string[] {
    let languages = this.translate.langs?.length
      ? this.translate.langs
      : Object.keys(this.translate.store.translations).filter(
          (lang) => lang !== 'undefined',
        )

    /* istanbul ignore next */
    if (!languages.length) {
      languages = this.config.availableLanguages || ['en']
    }

    return languages
  }

  clearTranslationCache(): void {
    this._translationCache.clear()
  }

  private parseUrlSegments(url: string): string[] {
    return url
      .split('?')[0]
      .replace(/^\/[a-z]{2}\//, '/')
      .split('/')
      .filter((s) => s.length > 0)
  }

  async translateTitle(): Promise<void> {
    const { skipTranslation, routeTitle, params } = this.getDeepestChildRoute()
    let appTitle: string

    /* istanbul ignore next */
    if (skipTranslation) {
      appTitle = routeTitle!
    } else if (routeTitle) {
      await this.ensureCorrectLanguage()

      const cacheKey = `${this.translate.currentLang}:${this._computedConfig.titlePrefixDot}${routeTitle}`

      if (!this._translationCache.has(cacheKey)) {
        const translationPromise = firstValueFrom(
          this.translate.get(
            `${this._computedConfig.titlePrefixDot}${routeTitle}`,
            params,
          ),
        )
        this._translationCache.set(cacheKey, translationPromise)
      }

      appTitle = await this._translationCache.get(cacheKey)!
    } else {
      /* istanbul ignore next */
      appTitle = this.title.getTitle()
    }
    this.title.setTitle(appTitle)
  }

  private async ensureCorrectLanguage(): Promise<void> {
    const currentUrl = this.stateService.isServerSide()
      ? this.document.location?.pathname || ''
      : window.location.pathname
    const langMatch = currentUrl.match(this._langRegex)

    let detectedLang: string | undefined

    /* istanbul ignore if */
    if (langMatch) {
      detectedLang = langMatch[1]
      /* istanbul ignore else - SSR-specific branch difficult to test in browser environment */
    } else if (
      this.stateService.isServerSide() &&
      !this.config.enableLanguageInPath
    ) {
      detectedLang = await this.detectLanguageFromUrl(currentUrl)
    }

    /* istanbul ignore if - Language change handling is tested in integration tests */
    if (
      detectedLang &&
      this.getAvailableLanguages().includes(detectedLang) &&
      this.translate.currentLang !== detectedLang
    ) {
      this.translate.use(detectedLang)
      await firstValueFrom(this.translate.getTranslation(detectedLang))
      this._translationCache.clear()
    }
  }

  /* istanbul ignore next - Complex SSR language detection with nested loops - difficult to test all branches in browser environment */
  private async detectLanguageFromUrl(
    url: string,
  ): Promise<string | undefined> {
    const urlSegments = this.parseUrlSegments(url)
    if (!urlSegments.length) return undefined

    const routePrefix = this.config.routePrefix || 'routes'
    const languages = this.getAvailableLanguages().filter(
      (lang) => lang !== this.translate.defaultLang,
    )
    const [firstSegment, secondSegment] = urlSegments

    const missingLangs = languages.filter(
      (lang) => !this.translate.store.translations[lang]?.[routePrefix],
    )
    if (missingLangs.length) {
      await Promise.all(
        missingLangs.map((lang) =>
          firstValueFrom(this.translate.getTranslation(lang)),
        ),
      )
    }

    for (const lang of languages) {
      const translations =
        this.translate.store.translations[lang]?.[routePrefix]
      if (!translations) continue

      for (const key in translations) {
        const value = translations[key]

        if (value === firstSegment) return lang

        if (value && typeof value === 'object') {
          const obj = value as Record<string, unknown>

          if (obj['root'] === firstSegment) {
            if (urlSegments.length === 1 || !secondSegment) return lang

            for (const childKey in obj) {
              if (
                childKey !== 'root' &&
                childKey !== 'params' &&
                obj[childKey] === secondSegment
              ) {
                return lang
              }
            }
          }
        }
      }
    }

    return undefined
  }

  /* istanbul ignore next - Complex SSR translation detection - difficult to test all branches in browser environment */
  async detectLanguageFromTranslatedUrl(
    url: string,
  ): Promise<{ originalPath: string; language: string } | null> {
    const lang = await this.detectLanguageFromUrl(url)
    if (!lang) return null

    const urlSegments = this.parseUrlSegments(url)
    const routePrefix = this.config.routePrefix || 'routes'
    const translations =
      this.translate.store.translations[lang]?.[routePrefix] || {}
    const [firstSegment, secondSegment] = urlSegments

    for (const key in translations) {
      const value = translations[key]

      if (value === firstSegment) {
        return { originalPath: key, language: lang }
      }

      if (value && typeof value === 'object') {
        const obj = value as Record<string, unknown>

        if (obj['root'] === firstSegment) {
          if (urlSegments.length === 1) {
            return { originalPath: key, language: lang }
          }

          for (const childKey in obj) {
            if (
              childKey !== 'root' &&
              childKey !== 'params' &&
              obj[childKey] === secondSegment
            ) {
              const remainingPath = urlSegments.slice(2).join('/')
              return {
                originalPath: remainingPath
                  ? `${key}/${childKey}/${remainingPath}`
                  : `${key}/${childKey}`,
                language: lang,
              }
            }
          }
        }
      }
    }

    return null
  }

  async translateRoute(): Promise<void> {
    try {
      const { skipTranslation } = this.getDeepestChildRoute()
      if (skipTranslation) return

      const isSSR = this.stateService.isServerSide()
      /* istanbul ignore next */
      if (isSSR && !this.config.enableSsrRouteTranslation) return

      const result = await this.processRouteTranslation()
      /* istanbul ignore next */
      if (!result) return

      /* istanbul ignore next */
      if (isSSR) {
        this.stateService.setItem(lastRouteKey, [
          { originalPath: result.originalPath, translatedPath: result.newPath },
        ])
      } else {
        this.updateLocationIfChanged(result.routeUrl, result.queryParams)
      }
    } catch (error) {
      /* istanbul ignore next */
      console.error('Error translating route:', error)
    }
  }

  private async processRouteTranslation(): Promise<{
    routeUrl: string
    queryParams: Params
    originalPath: string
    newPath: string
  } | null> {
    const urlTree = this.router.parseUrl(this.router.url)
    const subPaths = urlTree?.root?.children['primary']?.segments?.map(
      (segment) => segment.path,
    )

    /* istanbul ignore next */
    if (!subPaths?.length) return null

    const { routeTranslationStrategy, routesUsingStrategy } = this.config
    const queryParams = urlTree?.queryParams ?? {}
    const needsQueryTranslation = this.shouldTranslateQueryParams(queryParams)

    const translatedPaths = await Promise.all(
      subPaths.map(async (subPath) => {
        /* istanbul ignore next */
        if (
          routeTranslationStrategy &&
          routesUsingStrategy?.includes(subPath)
        ) {
          return routeTranslationStrategy(subPath)
        }
        const pathKey = needsQueryTranslation
          ? `${subPath}.${this.config.routeSuffixesWithQueryParams?.route}`
          : subPath
        return this.getTranslatedPath(pathKey)
      }),
    )

    let routeUrl = translatedPaths.reduce((acc, translatedPath, index) => {
      const segment =
        typeof translatedPath === 'string'
          ? translatedPath
          : translatedPath['root']
      const originalSegment = subPaths[index]
      const routePrefix = this.config.routePrefix
      const finalSegment =
        routePrefix && segment.startsWith(routePrefix)
          ? originalSegment
          : segment
      /* istanbul ignore next */
      return originalSegment.length > 0 ? `${acc}/${finalSegment}` : acc
    }, '')

    /* istanbul ignore if */
    if (this.shouldAddLanguageToPath()) {
      /* istanbul ignore if */
      if (this.translate.currentLang) {
        routeUrl = this._langRegex.test(this.router.url)
          ? routeUrl
          : `/${this.translate.currentLang}${routeUrl}`
      }
    }

    const translatedQueryParams = needsQueryTranslation
      ? await this.translateQueryParams(
          queryParams,
          subPaths[subPaths.length - 1],
        )
      : queryParams

    const originalPath = this.router
      .createUrlTree([], { queryParams: urlTree.queryParams })
      .toString()
    const newPath = this.router
      .createUrlTree([routeUrl], { queryParams: translatedQueryParams })
      .toString()

    return {
      routeUrl,
      queryParams: translatedQueryParams,
      originalPath,
      newPath,
    }
  }

  private shouldTranslateQueryParams(queryParams: Params): boolean {
    return (
      Object.keys(queryParams).length > 0 &&
      this.config.enableQueryParamsTranslate === true &&
      this.translate.currentLang !== this.translate.defaultLang
    )
  }

  private shouldAddLanguageToPath(): boolean {
    const { enableLanguageInPath, includeDefaultLanguageInPath } = this.config
    return (
      enableLanguageInPath === true &&
      (this.translate.currentLang !== this.translate.defaultLang ||
        includeDefaultLanguageInPath === true)
    )
  }

  private getDeepestChildRoute(): {
    skipTranslation: boolean
    routeTitle?: string
    params?: Params
  } {
    let child = this.activatedRoute.firstChild
    while (child?.firstChild) child = child.firstChild

    /* istanbul ignore next */
    if (!child?.snapshot) return { skipTranslation: false }

    const { title: dataTitle, skipTranslation = false } = child.snapshot.data
    const routeTitle =
      dataTitle || child.snapshot.title || child.snapshot.routeConfig?.title
    let params = child.snapshot.params

    /* istanbul ignore next */
    if (
      this.stateService.isServerSide() &&
      Object.keys(params || {}).length === 0
    ) {
      params = this.extractParamsFromUrl(routeTitle)
    }

    return { skipTranslation, routeTitle, params }
  }

  private extractParamsFromUrl(routeTitle?: string): Params {
    /* istanbul ignore next */
    if (!routeTitle) return {}
    return this.matchUrlToRoutePattern(this.getCleanUrl())
  }

  private getCleanUrl(): string {
    let url = this.stateService.isServerSide()
      ? this.document.location?.pathname || ''
      : this.router.url

    url = url.split('?')[0]
    const langMatch = url.match(/^\/([a-z]{2})(?:\/|$)/)
    /* istanbul ignore next */
    if (langMatch && this.isLanguageCode(langMatch[1])) {
      url = url.replace(/^\/[a-z]{2}/, '') || '/'
    }
    return url
  }

  /* istanbul ignore next - Complex URL pattern matching with multiple branches - difficult to test exhaustively */
  private matchUrlToRoutePattern(url: string): Params {
    const urlSegments = url.split('/').filter((segment) => segment.length > 0)
    const segmentCount = urlSegments.length

    for (const route of this.routesWithoutWildcard) {
      if (!route.path) continue

      const routeSegments = route.path
        .split('/')
        .filter((segment) => segment.length > 0)

      if (routeSegments.length !== segmentCount) continue

      const routeParams: Params = {}
      let i = 0

      for (; i < segmentCount; i++) {
        const routeSegment = routeSegments[i]
        const urlSegment = urlSegments[i]

        if (routeSegment.startsWith(':')) {
          routeParams[routeSegment.substring(1)] = urlSegment
        } else if (routeSegment !== urlSegment) {
          break
        }
      }

      if (i === segmentCount) return routeParams
    }

    return {}
  }

  private isLanguageCode(segment: string): boolean {
    const languages = this.getAvailableLanguages()
    return languages.includes(segment)
  }

  private async getTranslatedPath(subPath: string): Promise<string> {
    const cacheKey = `${this.translate.currentLang}:${this._computedConfig.routePrefixDot}${subPath}`

    if (!this._translationCache.has(cacheKey)) {
      const translationPromise = firstValueFrom(
        this.translate.get(`${this._computedConfig.routePrefixDot}${subPath}`),
      )
      this._translationCache.set(cacheKey, translationPromise)
    }

    return this._translationCache.get(cacheKey)!
  }

  private async translateQueryParams(
    queryParams: Params,
    path: string,
  ): Promise<Params> {
    const paramsSuffix = this.config.routeSuffixesWithQueryParams?.params
    /* istanbul ignore next */
    if (!paramsSuffix) return queryParams

    const translatedQueryParams: Params = {}
    const keys = Object.keys(queryParams)

    await Promise.all(
      keys.map(async (key) => {
        const translatedKey = await this.getTranslatedPath(
          `${path}.${paramsSuffix}.${key}`,
        )
        translatedQueryParams[translatedKey] = queryParams[key]
      }),
    )

    return translatedQueryParams
  }

  private updateLocationIfChanged(
    newRouteUrl: string,
    queryParams?: Params,
  ): void {
    const currentPathWithParams = this.router
      .createUrlTree([], {
        queryParams: this.router.parseUrl(this.location.path()).queryParams,
      })
      .toString()

    const newPathWithParams = this.router
      .createUrlTree([newRouteUrl], { queryParams })
      .toString()

    const translatedPaths: RoutePath[] =
      this.stateService.getItem(lastRouteKey) ?? []
    const index = translatedPaths.findIndex(
      (path) => path.originalPath === currentPathWithParams,
    )

    /* istanbul ignore next */
    if (index !== -1) {
      translatedPaths[index].translatedPath = newPathWithParams
    } else {
      translatedPaths.push({
        originalPath: currentPathWithParams,
        translatedPath: newPathWithParams,
      })
    }

    /* istanbul ignore next */
    if (this.stateService.isClientSide()) {
      this.location.replaceState(newPathWithParams)
    }

    this.stateService.setItem(lastRouteKey, translatedPaths)
  }
}
