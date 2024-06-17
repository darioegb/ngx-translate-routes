import { Location } from '@angular/common'
import { Injectable, OnDestroy, inject, Inject } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Router, NavigationEnd, NavigationStart } from '@angular/router'
import { filter, map, skip, takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'
import {
  NgxTranslateRoutesConfig,
  RoutePath,
} from './ngx-translate-routes.interfaces'
import { NGX_TRANSLATE_ROUTES_CONFING } from './ngx-translate-routes.token'
import { NgxTranslateRoutesTitleService } from './ngx-translate-routes-title.service'
import { NgxTranslateRoutesRouteService } from './ngx-translate-routes-route.service'
import { lastRouteKey } from './ngx-translate-routes.constants'

@Injectable({
  providedIn: 'root',
})
export class NgxTranslateRoutesService implements OnDestroy {
  #isNavigatingBackOrForward = false
  #destroy$ = new Subject<void>()
  #translate = inject(TranslateService)
  #router = inject(Router)
  #location = inject(Location)
  #titleService = inject(NgxTranslateRoutesTitleService)
  #routeService = inject(NgxTranslateRoutesRouteService)

  constructor(
    @Inject(NGX_TRANSLATE_ROUTES_CONFING)
    private config: NgxTranslateRoutesConfig,
  ) {
    this.#translate.onDefaultLangChange
      .pipe(skip(1), takeUntil(this.#destroy$))
      .subscribe({
        next: () => {
          const translatedPaths: RoutePath[] = this.#getTranslatedPaths()
          const lastTranslatedPath = translatedPaths.find(
            (path) => path.translatedPath === this.#location.path(),
          )
          if (lastTranslatedPath) {
            this.#location.replaceState(lastTranslatedPath.originalPath)
            localStorage.removeItem(lastRouteKey)
          }
          this.checkConfigValueAndMakeTranslations()
          if (this.config.onLanguageChange) {
            this.config.onLanguageChange()
          }
        },
      })
  }

  init(): void {
    this.#router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        map((event) => event as NavigationStart),
        takeUntil(this.#destroy$),
      )
      .subscribe({
        next: (event) => {
          const item = localStorage.getItem(lastRouteKey)
          if (
            event.navigationTrigger === 'popstate' ||
            (event.id === 1 && item)
          ) {
            this.#isNavigatingBackOrForward = true
            const translatedPaths: RoutePath[] = this.#getTranslatedPaths()
            const lastTranslatedPath = translatedPaths.find(
              (path) => path.translatedPath === event.url,
            )

            if (lastTranslatedPath) {
              this.#router.navigateByUrl(lastTranslatedPath.originalPath, {
                skipLocationChange: true,
              })
            }
          }
        },
      })
    this.#router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.#destroy$),
      )
      .subscribe({
        next: () => {
          if (!this.#isNavigatingBackOrForward) {
            this.checkConfigValueAndMakeTranslations()
          }
          this.#isNavigatingBackOrForward = false
        },
      })
  }

  checkConfigValueAndMakeTranslations(): void {
    this.config.enableTitleTranslate && this.#titleService.translateTitle()
    this.config.enableRouteTranslate && this.#routeService.translateRoute()
  }

  ngOnDestroy(): void {
    this.#destroy$.next()
    this.#destroy$.complete()
  }

  #getTranslatedPaths(): RoutePath[] {
    return JSON.parse(localStorage.getItem(lastRouteKey) ?? '[]')
  }
}
