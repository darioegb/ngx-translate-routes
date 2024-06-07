import { Injectable, inject, Inject } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Location } from '@angular/common'
import { Router } from '@angular/router'
import { firstValueFrom } from 'rxjs'
import {
  NgxTranslateRoutesConfig,
  RoutePath,
} from './ngx-translate-routes.interfaces'
import { NGX_TRANSLATE_ROUTES_CONFING } from './ngx-translate-routes.token'
import {
  lastRouteKey,
  translatePrefixes,
} from './ngx-translate-routes.constants'

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
      const { routeTranslationStrategy, routesUsingStrategy } = this.config
      const subPaths = this.#router.url.split('/')
      let routeUrl = ''

      for (const subPath of subPaths) {
        const translatePath =
          routeTranslationStrategy && routesUsingStrategy?.includes(subPath)
            ? routeTranslationStrategy(subPath)
            : await this.#getTranslatedPath(subPath)

        routeUrl = this.#concatenateRouteUrl(routeUrl, translatePath, subPath)
      }

      this.#updateLocationIfChanged(routeUrl)
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
      const segmentToConcat = !translatePath.startsWith(translatePrefixes.route)
        ? translatePath
        : subPath
      return `${routeUrl}/${segmentToConcat}`
    }
    return subPath
  }

  #updateLocationIfChanged(newRouteUrl: string): void {
    const currentPath = this.#location.path()
    if (currentPath !== newRouteUrl) {
      const lastLocationPath: RoutePath = {
        path: currentPath,
        translatedPath: newRouteUrl,
      }
      this.#location.replaceState(newRouteUrl)
      localStorage.setItem(lastRouteKey, JSON.stringify(lastLocationPath))
    }
  }
}
