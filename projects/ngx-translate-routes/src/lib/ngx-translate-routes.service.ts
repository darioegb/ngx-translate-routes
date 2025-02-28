import { Location } from '@angular/common'
import { Injectable, OnDestroy, inject } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Router, NavigationEnd, NavigationStart } from '@angular/router'
import { filter, map, takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { RoutePath } from './ngx-translate-routes.interfaces'
import { NGX_TRANSLATE_ROUTES_CONFING } from './ngx-translate-routes.token'
import { NgxTranslateRoutesTitleService } from './ngx-translate-routes-title.service'
import { NgxTranslateRoutesRouteService } from './ngx-translate-routes-route.service'
import { lastRouteKey } from './ngx-translate-routes.constants'
import { NgxTranslateRoutesGlobalStorageService } from './ngx-translate-routes-global-storage.service'

@Injectable({
  providedIn: 'root',
})
export class NgxTranslateRoutesService implements OnDestroy {
  private readonly destroy$ = new Subject<void>()
  private readonly translate = inject(TranslateService)
  private readonly router = inject(Router)
  private readonly location = inject(Location)
  private readonly titleService = inject(NgxTranslateRoutesTitleService)
  private readonly routeService = inject(NgxTranslateRoutesRouteService)
  private readonly config = inject(NGX_TRANSLATE_ROUTES_CONFING)
  private readonly globalStorageService = inject(
    NgxTranslateRoutesGlobalStorageService,
  )

  constructor() {
    this.translate.onDefaultLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.handleLanguageChange()
        },
      })
  }

  init(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        map((event) => event as NavigationStart),
        takeUntil(this.destroy$),
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
          }
        },
      })

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: () => {
          this.checkConfigValueAndMakeTranslations()
        },
      })
  }

  checkConfigValueAndMakeTranslations(): void {
    this.config.enableTitleTranslate && this.titleService.translateTitle()
    this.config.enableRouteTranslate && this.routeService.translateRoute()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
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
