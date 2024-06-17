import { Injectable, inject, Inject } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Location } from '@angular/common'
import { Params, Router } from '@angular/router'
import { firstValueFrom } from 'rxjs'
import {
  NgxTranslateRoutesConfig,
  RoutePath,
} from './ngx-translate-routes.interfaces'
import { NGX_TRANSLATE_ROUTES_CONFING } from './ngx-translate-routes.token'
import { lastRouteKey } from './ngx-translate-routes.constants'

@Injectable({
  providedIn: 'root',
})
export class NgxTranslateRoutesRouteService {
  #translate = inject(TranslateService)
  #location = inject(Location)
  #router = inject(Router)

  constructor(
    @Inject(NGX_TRANSLATE_ROUTES_CONFING)
    private config: NgxTranslateRoutesConfig,
  ) {}

  async translateRoute(): Promise<void> {
    try {
      const {
        routeTranslationStrategy,
        routesUsingStrategy,
        enableQueryParamsTranslate,
        routeSuffixesWithQueryParams,
      } = this.config

      const urlTree = this.#router.parseUrl(this.#router.url)
      const subPaths = urlTree?.root?.children['primary']?.segments?.map(
        (segment) => segment.path,
      )
      const queryParams = urlTree?.queryParams ?? {}
      const isQueryParamsNeedsTranslation =
        Object.keys(queryParams).length > 0 && enableQueryParamsTranslate

      const translatedPaths = await Promise.all(
        subPaths?.map((subPath) => {
          if (
            routeTranslationStrategy &&
            routesUsingStrategy?.includes(subPath)
          ) {
            return Promise.resolve(routeTranslationStrategy(subPath))
          }
          const pathKey = isQueryParamsNeedsTranslation
            ? `${subPath}.${routeSuffixesWithQueryParams?.route}`
            : subPath
          return this.#getTranslatedPath(pathKey)
        }),
      )

      const routeUrl = translatedPaths?.reduce(
        (acc, translatedPath, index) =>
          this.#concatenateRouteUrl(acc, translatedPath, subPaths[index]),
        '',
      )

      const translatedQueryParams = isQueryParamsNeedsTranslation
        ? await this.#translateQueryParams(queryParams)
        : queryParams

      this.#updateLocationIfChanged(routeUrl, translatedQueryParams)
    } catch (error) {
      console.error('Error translating route:', error)
    }
  }

  async #getTranslatedPath(subPath: string): Promise<string> {
    return firstValueFrom(
      this.#translate.get(`${this.config.routePrefix}.${subPath}`),
    )
  }

  #concatenateRouteUrl(
    routeUrl: string,
    translatePath: string,
    subPath: string,
  ): string {
    if (subPath.length > 0) {
      const segmentToConcat = !translatePath.startsWith(
        this.config.routePrefix!,
      )
        ? translatePath
        : subPath
      return `${routeUrl}/${segmentToConcat}`
    }
    return subPath
  }

  async #translateQueryParams(queryParams: Params): Promise<Params> {
    const translatedQueryParams: Params = {}
    for (const key in queryParams) {
      if (Object.prototype.hasOwnProperty.call(queryParams, key)) {
        const path = this.#router.url
          .match(new RegExp(`[^/]*${key}`))?.[0]
          .replace(new RegExp(`${key}|[^\\w\\s]`, 'g'), '')
        const translatedKey = await this.#getTranslatedPath(
          `${path}.${this.config.routeSuffixesWithQueryParams?.params}.${key}`,
        )
        const value = queryParams[key]
        translatedQueryParams[translatedKey] = value
      }
    }
    return translatedQueryParams
  }

  #updateLocationIfChanged(newRouteUrl: string, queryParams: Params): void {
    const currentPath = this.#location.path()
    const originalPath = this.#router
      .parseUrl(currentPath)
      .root.children['primary'].segments.map((segment) => segment.path)
      .join('/')
    const newPathWithParams = this.#router
      .createUrlTree([newRouteUrl], { queryParams })
      .toString()

    if (currentPath !== newPathWithParams) {
      const translatedPaths: RoutePath[] = JSON.parse(
        localStorage.getItem(lastRouteKey) ?? '[]',
      )
      const index = translatedPaths.findIndex(
        (path) => path.originalPath === originalPath,
      )

      if (index !== -1) {
        translatedPaths[index].translatedPath = newPathWithParams
      } else {
        translatedPaths.push({
          originalPath,
          translatedPath: newPathWithParams,
        })
      }

      this.#location.replaceState(newPathWithParams)
      localStorage.setItem(lastRouteKey, JSON.stringify(translatedPaths))
    }
  }
}
