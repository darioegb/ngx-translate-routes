import { Inject, Injectable, inject } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';
import {
  Router,
  NavigationEnd,
  ActivatedRoute,
  NavigationStart,
} from '@angular/router';
import { filter, skip, takeUntil } from 'rxjs/operators';
import { Subject, firstValueFrom } from 'rxjs';
import {
  NgxTranslateRoutesConfig,
  RoutePath,
} from './ngx-translate-routes.interfaces';
import {
  translatePrefixes,
  lastRouteKey,
} from './ngx-translate-routes.constants';
import { NGX_TRANSLATE_ROUTES_CONFING } from './ngx-translate-routes.token';

@Injectable({
  providedIn: 'root',
})
export class NgxTranslateRoutesService {
  #destroy$ = new Subject<void>();
  #translate = inject(TranslateService);
  #location = inject(Location);
  #title = inject(Title);
  #router = inject(Router);
  #activatedRoute = inject(ActivatedRoute);

  constructor(
    @Inject(NGX_TRANSLATE_ROUTES_CONFING)
    private readonly config: NgxTranslateRoutesConfig
  ) {
    this.#translate.onDefaultLangChange
      .pipe(skip(1), takeUntil(this.#destroy$))
      .subscribe({
        next: () => {
          this.checkConfigValueAndMakeTranslations();
          if (this.config.onLanguageChange) {
            this.config.onLanguageChange();
          }
        },
      });
  }

  init() {
    this.#router.events
      .pipe(
        filter(
          (event) =>
            event instanceof NavigationEnd ||
            (event instanceof NavigationStart &&
              event.id === 1 &&
              JSON.parse(localStorage.getItem(lastRouteKey) || '{}')
                ?.translatedPath === event.url)
        ),
        takeUntil(this.#destroy$)
      )
      .subscribe({
        next: (event) => {
          if (event instanceof NavigationStart) {
            const item = localStorage.getItem(lastRouteKey);
            const lastLocationPath: RoutePath = item && JSON.parse(item);
            localStorage.removeItem(lastRouteKey);
            this.#router.navigateByUrl(lastLocationPath.path);
          } else {
            this.checkConfigValueAndMakeTranslations();
          }
        },
      });
  }

  checkConfigValueAndMakeTranslations(): void {
    this.config.enableTitleTranslate && this.#translateTitle();
    this.config.enableRouteTranslate && this.#translateRoute();
  }

  ngOnDestroy(): void {
    this.#destroy$.next();
    this.#destroy$.complete();
  }

  async #translateTitle(): Promise<void> {
    let child = this.#activatedRoute.firstChild;
    while (child?.firstChild) {
      child = child.firstChild;
    }
    const routeTitle = child?.snapshot.data?.title;
    // Only for versions < 14
    const skipTranslation = !!child?.snapshot.data?.skipTranslation;
    const params = child?.snapshot.params;
    let appTitle: string;
    if (skipTranslation) {
      appTitle = routeTitle;
    } else if (routeTitle) {
      appTitle = await firstValueFrom(
        this.#translate.get(`${this.config.titlePrefix}.${routeTitle}`, params)
      );
    } else {
      appTitle = this.#title.getTitle();
    }

    this.#title.setTitle(appTitle);
  }

  async #translateRoute(): Promise<void> {
    let routeUrl = '';
    const subPaths = this.#router.url.split('/');
    await subPaths.forEach(async (subPath: string) => {
      let translatePath: string;
      if (
        this.config.routeTranslationStrategy &&
        this.config.routesUsingStrategy?.includes(subPath)
      ) {
        translatePath = this.config.routeTranslationStrategy(subPath);
      } else {
        translatePath = await firstValueFrom(
          this.#translate.get(`${this.config.routePrefix}.${subPath}`)
        );
      }
      routeUrl =
        subPath.length > 0
          ? this.#routeUrlConcat(routeUrl, translatePath, subPath)
          : subPath;
    });
    const lastLocationPath: RoutePath = {
      path: this.#location.path(),
      translatedPath: routeUrl,
    };
    this.#location.replaceState(routeUrl);
    localStorage.setItem(lastRouteKey, JSON.stringify(lastLocationPath));
  }

  #routeUrlConcat(
    routeUrl: string,
    translatePath: string,
    subPath: string
  ): string {
    return routeUrl.concat(
      `/${
        !translatePath.startsWith(translatePrefixes.route)
          ? translatePath
          : subPath
      }`
    );
  }
}
