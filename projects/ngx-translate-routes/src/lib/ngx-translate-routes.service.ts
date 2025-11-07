import { Location, DOCUMENT } from '@angular/common'
import { DestroyRef, Injectable, inject } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import {
  Router,
  NavigationEnd,
  NavigationStart,
  Route,
  LoadChildrenCallback,
} from '@angular/router'
import { filter, skip } from 'rxjs/operators'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { RoutePath } from './ngx-translate-routes.interfaces'
import { NGX_TRANSLATE_ROUTES_CONFIG } from './ngx-translate-routes.token'
import { NgxTranslateRoutesHelperService } from './ngx-translate-routes-helper.service'
import { lastRouteKey } from './ngx-translate-routes.constants'
import { NgxTranslateRoutesStateService } from './ngx-translate-routes-state.service'

@Injectable({
  providedIn: 'root',
})
export class NgxTranslateRoutesService {
  private readonly translate = inject(TranslateService)
  private readonly router = inject(Router)
  private readonly location = inject(Location)
  private readonly document = inject(DOCUMENT)
  private readonly helperService = inject(NgxTranslateRoutesHelperService)
  private readonly config = inject(NGX_TRANSLATE_ROUTES_CONFIG)
  private readonly stateService = inject(NgxTranslateRoutesStateService)
  private readonly _destroyRef = inject(DestroyRef)

  constructor() {
    this.translate.onLangChange
      .pipe(skip(1), takeUntilDestroyed(this._destroyRef))
      .subscribe(() => {
        this.helperService.clearTranslationCache()
        this.handleLanguageChange()
      })
  }

  /* istanbul ignore next - SSR-specific route translation - difficult to test in browser environment */
  async handleServerSideRouteTranslation(): Promise<void> {
    const url = this.document.location?.pathname
    if (!url || url === '/') return

    const cleanUrl = url.split('?')[0]
    const defaultLangPrefix = `/${this.translate.defaultLang}`

    if (
      this.config.includeDefaultLanguageInPath &&
      (cleanUrl.startsWith(`${defaultLangPrefix}/`) ||
        cleanUrl === defaultLangPrefix)
    ) {
      const pathWithoutLang =
        cleanUrl.replace(new RegExp(`^${defaultLangPrefix}/?`), '') || '/'
      await this.registerRoute(cleanUrl, pathWithoutLang)
      return
    }

    const detected =
      await this.helperService.detectLanguageFromTranslatedUrl(cleanUrl)
    if (detected) {
      await this.registerRoute(cleanUrl, detected.originalPath)
    }
  }

  /* istanbul ignore next - SSR route registration - difficult to test in browser environment */
  private async registerRoute(
    translatedPath: string,
    originalPath: string,
  ): Promise<void> {
    const originalRoute = this.router.config.find(
      (route) =>
        route.path === originalPath ||
        (originalPath === '/' && (route.path === '' || route.redirectTo)),
    )

    if (originalRoute) {
      this.router.config.unshift({
        ...originalRoute,
        path: translatedPath.startsWith('/')
          ? translatedPath.slice(1)
          : translatedPath,
      })
      return
    }

    await this.registerNestedRoute(translatedPath, originalPath)
  }

  /* istanbul ignore next - SSR nested route registration - difficult to test in browser environment */
  private async registerNestedRoute(
    translatedPath: string,
    originalPath: string,
  ): Promise<void> {
    const pathParts = originalPath.split('/')
    if (pathParts.length < 2) return

    const basePath = pathParts[0]
    const baseRoute = this.router.config.find(
      (route) => route.path === basePath && route.loadChildren,
    )

    if (!baseRoute) return

    const dynamicPath = this.buildDynamicPath(translatedPath, originalPath)

    if (this.router.config.some((route) => route.path === dynamicPath)) return

    const translatedRoute = await this.createRouteWithFallback(
      dynamicPath,
      originalPath,
      baseRoute,
    )

    this.router.config.unshift(translatedRoute)
  }

  /* istanbul ignore next - Dynamic path building for SSR routes */
  private buildDynamicPath(
    translatedPath: string,
    originalPath: string,
  ): string {
    const translatedParts = (
      translatedPath.startsWith('/') ? translatedPath.slice(1) : translatedPath
    ).split('/')
    const originalParts = originalPath.split('/')

    return translatedParts
      .map((part, i) =>
        i < originalParts.length && originalParts[i].startsWith(':')
          ? originalParts[i]
          : part,
      )
      .join('/')
  }

  /* istanbul ignore next - Route creation with lazy loading fallback */
  private async createRouteWithFallback(
    dynamicPath: string,
    originalPath: string,
    baseRoute: Route,
  ): Promise<Route> {
    try {
      const loadChildren = baseRoute.loadChildren
      if (!loadChildren) {
        return { path: dynamicPath, loadChildren: baseRoute.loadChildren }
      }
      const lazyRoutes = await this.loadLazyRoutes(loadChildren)
      return lazyRoutes?.length
        ? {
            path: dynamicPath,
            redirectTo: originalPath,
            pathMatch: 'full' as const,
          }
        : { path: dynamicPath, loadChildren: baseRoute.loadChildren }
    } catch {
      return { path: dynamicPath, loadChildren: baseRoute.loadChildren }
    }
  }

  /* istanbul ignore next - Lazy route loading with multiple module formats */
  private async loadLazyRoutes(
    loadChildren: LoadChildrenCallback,
  ): Promise<Route[] | null> {
    try {
      if (typeof loadChildren !== 'function') return null

      const result = await loadChildren()

      if (Array.isArray(result)) return result as Route[]

      if (result && typeof result === 'object') {
        const moduleResult = result as { default?: Route[] }
        if (Array.isArray(moduleResult.default)) return moduleResult.default

        const routesArray = Object.values(result).find(Array.isArray)
        return routesArray ? (routesArray as Route[]) : null
      }

      return null
    } catch {
      return null
    }
  }

  async initForSsr(): Promise<void> {
    await this.handleServerSideRouteTranslation()
    await this.checkConfigValueAndMakeTranslations()
  }

  init(): void {
    const wildcardIndex = this.router.config.findIndex(
      (route) => route.path === '**',
    )
    const lastRoute = wildcardIndex !== -1 && this.router.config.pop()

    this.router.events
      .pipe(
        filter(
          (event) =>
            event instanceof NavigationStart || event instanceof NavigationEnd,
        ),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe((event) => {
        /* istanbul ignore next */
        if (event instanceof NavigationStart) {
          this.handleNavigationStart(event, lastRoute || false)
        } else {
          this.checkConfigValueAndMakeTranslations()
        }
      })
  }

  /* istanbul ignore next - Navigation event handling with popstate */
  private handleNavigationStart(
    event: NavigationStart,
    lastRoute: Route | false,
  ): void {
    const item = this.stateService.getItem(lastRouteKey)
    if (event.navigationTrigger === 'popstate' || (event.id === 1 && item)) {
      const translatedPaths: RoutePath[] = this.getTranslatedPaths()
      const lastTranslatedPath = translatedPaths.find(
        (path) => path.translatedPath === event.url,
      )

      if (lastTranslatedPath) {
        this.router.navigateByUrl(lastTranslatedPath.originalPath, {
          skipLocationChange: true,
        })
      }

      if (lastRoute) {
        this.router.config.push(lastRoute)
      }
    }
  }

  async checkConfigValueAndMakeTranslations(): Promise<void> {
    const promises: Promise<void>[] = []

    /* istanbul ignore next */
    if (this.config.enableTitleTranslate) {
      promises.push(this.helperService.translateTitle())
    }
    /* istanbul ignore next */
    if (this.config.enableRouteTranslate) {
      promises.push(this.helperService.translateRoute())
    }

    await Promise.all(promises)
  }

  /* istanbul ignore next - Language change handling with path restoration */
  private async handleLanguageChange(): Promise<void> {
    const translatedPaths: RoutePath[] = this.getTranslatedPaths()
    const lastTranslatedPath = translatedPaths.find(
      (path) => path.translatedPath === this.location.path(),
    )
    if (lastTranslatedPath) {
      this.location.replaceState(lastTranslatedPath.originalPath)
      this.stateService.removeItem(lastRouteKey)
    }
    await this.checkConfigValueAndMakeTranslations()
    if (this.config.onLanguageChange) {
      this.config.onLanguageChange()
    }
  }

  private getTranslatedPaths(): RoutePath[] {
    return this.stateService.getItem(lastRouteKey) ?? []
  }
}
