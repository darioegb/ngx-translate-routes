import { Injectable, OnDestroy, inject, Inject } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Router, NavigationEnd, NavigationStart } from '@angular/router'
import { filter, skip, takeUntil } from 'rxjs/operators'
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
  #destroy$ = new Subject<void>()
  #translate = inject(TranslateService)
  #router = inject(Router)
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
        filter(
          (event) =>
            event instanceof NavigationEnd ||
            (event instanceof NavigationStart &&
              event.id === 1 &&
              JSON.parse(localStorage.getItem(lastRouteKey) || '{}')
                ?.translatedPath === event.url),
        ),
        takeUntil(this.#destroy$),
      )
      .subscribe({
        next: (event) => {
          if (event instanceof NavigationStart) {
            const item = localStorage.getItem(lastRouteKey)
            const lastLocationPath: RoutePath = item && JSON.parse(item)
            localStorage.removeItem(lastRouteKey)
            this.#router.navigateByUrl(lastLocationPath.path)
          } else {
            this.checkConfigValueAndMakeTranslations()
          }
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
}
