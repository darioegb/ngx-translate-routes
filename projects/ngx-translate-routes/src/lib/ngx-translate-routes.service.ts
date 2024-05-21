import { Inject, Injectable, OnDestroy, inject } from '@angular/core';

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
export class NgxTranslateRoutesService implements OnDestroy {
  #destroy$ = new Subject<void>();
  #translate = inject(TranslateService);
  #location = inject(Location);
  #title = inject(Title);
  #router = inject(Router);
  #activatedRoute = inject(ActivatedRoute);

  constructor(
    @Inject(NGX_TRANSLATE_ROUTES_CONFING)
    private config: NgxTranslateRoutesConfig
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
    try {
      const { routeTranslationStrategy, routesUsingStrategy } = this.config;
      const subPaths = this.#router.url.split('/');
      let routeUrl = '';

      for (const subPath of subPaths) {
        const translatePath = routeTranslationStrategy && routesUsingStrategy?.includes(subPath)
          ? routeTranslationStrategy(subPath)
          : await this.#getTranslatedPath(subPath);

        routeUrl = this.#concatenateRouteUrl(routeUrl, translatePath, subPath);
      }

      this.#updateLocationIfChanged(routeUrl);
    } catch (error) {
      console.error('Error translating route:', error);
    }
  }

  async #getTranslatedPath(subPath: string): Promise<string> {
    return firstValueFrom(this.#translate.get(`${this.config.routePrefix}.${subPath}`));
  }

  #concatenateRouteUrl(routeUrl: string, translatePath: string, subPath: string): string {
    if (subPath.length > 0) {
      const segmentToConcat = !translatePath.startsWith(translatePrefixes.route) ? translatePath : subPath;
      return `${routeUrl}/${segmentToConcat}`;
    }
    return subPath;
  }

  #updateLocationIfChanged(newRouteUrl: string): void {
    const currentPath = this.#location.path();
    if (currentPath !== newRouteUrl) {
      const lastLocationPath: RoutePath = {
        path: currentPath,
        translatedPath: newRouteUrl,
      };
      this.#location.replaceState(newRouteUrl);
      localStorage.setItem(lastRouteKey, JSON.stringify(lastLocationPath));
    }
  }
}
