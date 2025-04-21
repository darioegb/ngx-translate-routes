import { Location } from '@angular/common'
import { DestroyRef, Injectable, inject } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Router, NavigationEnd, NavigationStart } from '@angular/router'
import { filter, map, skip } from 'rxjs/operators'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { RoutePath } from './ngx-translate-routes.interfaces'
import { NGX_TRANSLATE_ROUTES_CONFIG } from './ngx-translate-routes.token'
import { NgxTranslateRoutesHelperService } from './ngx-translate-routes-helper.service'
import { lastRouteKey } from './ngx-translate-routes.constants'
import { NgxTranslateRoutesGlobalStorageService } from './ngx-translate-routes-global-storage.service'

@Injectable({
  providedIn: 'root',
})
export class NgxTranslateRoutesService {
  private readonly translate = inject(TranslateService)
  private readonly router = inject(Router)
  private readonly location = inject(Location)
  private readonly helperService = inject(NgxTranslateRoutesHelperService)
  private readonly config = inject(NGX_TRANSLATE_ROUTES_CONFIG)
  private readonly globalStorageService = inject(
    NgxTranslateRoutesGlobalStorageService,
  )
  private readonly _destroyRef = inject(DestroyRef)

  constructor() {
    this.translate.onLangChange
      .pipe(skip(1), takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: () => {
          this.handleLanguageChange()
        },
      })
  }

  init(): void {
    const lastRoute =
      this.router.config?.findIndex((route) => route.path === '**') !== -1 &&
      this.router.config?.pop()
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        map((event) => event as NavigationStart),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe({
        next: (event) => {
          const item = this.globalStorageService.getItem(lastRouteKey)
          if (
            event.navigationTrigger === 'popstate' ||
            (event.id === 1 && item)
          ) {
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
        },
      })

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe({
        next: () => {
          this.checkConfigValueAndMakeTranslations()
        },
      })
  }

  checkConfigValueAndMakeTranslations(): void {
    this.config.enableTitleTranslate && this.helperService.translateTitle()
    this.config.enableRouteTranslate && this.helperService.translateRoute()
  }

  private handleLanguageChange(): void {
    const translatedPaths: RoutePath[] = this.getTranslatedPaths()
    const lastTranslatedPath = translatedPaths.find(
      (path) => path.translatedPath === this.location.path(),
    )
    if (lastTranslatedPath) {
      this.location.replaceState(lastTranslatedPath.originalPath)
      this.globalStorageService.removeItem(lastRouteKey)
    }
    this.checkConfigValueAndMakeTranslations()
    if (this.config.onLanguageChange) {
      this.config.onLanguageChange()
    }
  }

  private getTranslatedPaths(): RoutePath[] {
    return this.globalStorageService.getItem(lastRouteKey) ?? []
  }
}
