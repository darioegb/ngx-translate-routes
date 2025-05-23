import { Injectable, inject } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { Location } from '@angular/common'
import { firstValueFrom } from 'rxjs'
import { RoutePath } from './ngx-translate-routes.interfaces'
import { NGX_TRANSLATE_ROUTES_CONFIG } from './ngx-translate-routes.token'
import { lastRouteKey } from './ngx-translate-routes.constants'
import { NgxTranslateRoutesGlobalStorageService } from './ngx-translate-routes-global-storage.service'

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
  private readonly globalStorageService = inject(
    NgxTranslateRoutesGlobalStorageService,
  )

  async translateTitle(): Promise<void> {
    const { skipTranslation, routeTitle, params } = this.getDeepestChildRoute()
    let appTitle: string

    if (skipTranslation) {
      appTitle = routeTitle!
    } else if (routeTitle) {
      appTitle = await firstValueFrom(
        this.translate.get(`${this.config.titlePrefix}.${routeTitle}`, params),
      )
    } else {
      appTitle = this.title.getTitle()
    }
    this.title.setTitle(appTitle)
  }

  async translateRoute(): Promise<void> {
    try {
      const { skipTranslation } = this.getDeepestChildRoute()

      if (skipTranslation) {
        return
      }

      const {
        routeTranslationStrategy,
        routesUsingStrategy,
        enableQueryParamsTranslate,
        routeSuffixesWithQueryParams,
        enableLanguageInPath,
        includeDefaultLanguageInPath,
      } = this.config

      const urlTree = this.router.parseUrl(this.router.url)
      const subPaths = urlTree?.root?.children['primary']?.segments?.map(
        (segment) => segment.path,
      )

      if (!subPaths?.length) {
        return
      }

      const queryParams = urlTree?.queryParams ?? {}
      const isQueryParamsNeedsTranslation =
        Object.keys(queryParams).length > 0 &&
        enableQueryParamsTranslate &&
        this.translate.currentLang !== this.translate.defaultLang
      const translatedPaths = await Promise.all(
        subPaths.map((subPath) => {
          if (
            routeTranslationStrategy &&
            routesUsingStrategy?.includes(subPath)
          ) {
            return routeTranslationStrategy(subPath)
          }
          const pathKey = isQueryParamsNeedsTranslation
            ? `${subPath}.${routeSuffixesWithQueryParams?.route}`
            : subPath
          return this.getTranslatedPath(pathKey)
        }),
      )

      let routeUrl = translatedPaths.reduce(
        (acc, translatedPath, index) =>
          this.concatenateRouteUrl(
            acc,
            typeof translatedPath === 'string'
              ? translatedPath
              : translatedPath['root'],
            subPaths[index],
          ),
        '',
      )

      if (
        enableLanguageInPath &&
        ((this.translate.currentLang !== this.translate.defaultLang &&
          !includeDefaultLanguageInPath) ||
          includeDefaultLanguageInPath)
      ) {
        routeUrl = !this.isLangInPath(this.router.url)
          ? `/${this.translate.currentLang}${routeUrl}`
          : routeUrl
      }

      const translatedQueryParams = isQueryParamsNeedsTranslation
        ? await this.translateQueryParams(
            queryParams,
            subPaths[subPaths.length - 1],
          )
        : queryParams

      this.updateLocationIfChanged(routeUrl, translatedQueryParams)
    } catch (error) {
      console.error('Error translating route:', error)
    }
  }

  private getDeepestChildRoute(): {
    skipTranslation: boolean
    routeTitle?: string
    params?: Params
  } {
    let child = this.activatedRoute.firstChild
    while (child?.firstChild) {
      child = child.firstChild
    }
    const { title: routeTitle, skipTranslation } = child?.snapshot.data || {}
    const params = child?.snapshot.params
    return { skipTranslation, routeTitle, params }
  }

  private async getTranslatedPath(subPath: string): Promise<string> {
    return firstValueFrom(
      this.translate.get(`${this.config.routePrefix}.${subPath}`),
    )
  }

  private concatenateRouteUrl(
    routeUrl: string,
    translatePath: string,
    subPath: string,
  ): string {
    const segmentToConcat = translatePath.startsWith(
      this.config.routePrefix ?? '',
    )
      ? subPath
      : translatePath
    return subPath.length > 0 ? `${routeUrl}/${segmentToConcat}` : subPath
  }

  private async translateQueryParams(
    queryParams: Params,
    path: string,
  ): Promise<Params> {
    const translatedQueryParams: Params = {}
    for (const key of Object.keys(queryParams)) {
      const translatedKey = await this.getTranslatedPath(
        `${path}.${this.config.routeSuffixesWithQueryParams?.params}.${key}`,
      )
      translatedQueryParams[translatedKey] = queryParams[key]
    }
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
      this.globalStorageService.getItem(lastRouteKey) ?? []
    const index = translatedPaths.findIndex(
      (path) => path.originalPath === currentPathWithParams,
    )

    if (index !== -1) {
      translatedPaths[index].translatedPath = newPathWithParams
    } else {
      translatedPaths.push({
        originalPath: currentPathWithParams,
        translatedPath: newPathWithParams,
      })
    }

    this.location.replaceState(newPathWithParams)
    this.globalStorageService.setItem(lastRouteKey, translatedPaths)
  }

  private isLangInPath(path: string): boolean {
    const langRegex = /^\/[a-z]{2}(-[A-Z]{2})?(\/|$)/
    return langRegex.test(path)
  }
}
