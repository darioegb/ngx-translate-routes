import { Injectable, Optional } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';
import {
  Router,
  NavigationEnd,
  ActivatedRoute,
  NavigationStart,
} from '@angular/router';
import { filter, skip } from 'rxjs/operators';
import { NgxTranslateRoutesConfig } from './ngx-translate-routes-config';
import {
  translatePrefixes,
  lastRouteKey,
  RoutePath,
} from './ngx-translate-routes-constant';

@Injectable({
  providedIn: 'root',
})
export class NgxTranslateRoutesService {
  private config: NgxTranslateRoutesConfig;

  constructor(
    private translate: TranslateService,
    private location: Location,
    private title: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    @Optional() config?: NgxTranslateRoutesConfig
  ) {
    this.config = new NgxTranslateRoutesConfig(
      config?.enableRouteTranslate,
      config?.enableTitleTranslate
    );
    this.translate.onDefaultLangChange
      .pipe(skip(1))
      .subscribe({ next: () => this.checkConfigValueAndMakeTranslations() });
  }

  init() {
    this.router.events
      .pipe(
        filter(
          (event) =>
            event instanceof NavigationEnd ||
            (event instanceof NavigationStart &&
              event.id === 1 &&
              JSON.parse(localStorage.getItem(lastRouteKey))?.translatedPath ===
                event.url)
        )
      )
      .subscribe({
        next: (event) => {
          if (event instanceof NavigationStart) {
            const lastLocationPath: RoutePath = JSON.parse(
              localStorage.getItem(lastRouteKey)
            );
            localStorage.removeItem(lastRouteKey);
            this.router.navigateByUrl(lastLocationPath.path);
          } else {
            this.checkConfigValueAndMakeTranslations();
          }
        },
      });
  }

  checkConfigValueAndMakeTranslations() {
    if (this.config.enableTitleTranslate) {
      this.translateTitle();
    }
    if (this.config.enableRouteTranslate) {
      this.translateRoute();
    }
  }

  private translateTitle() {
    let child = this.activatedRoute.firstChild;
    while (child.firstChild) {
      child = child.firstChild;
    }
    const routeTitle: string = child.snapshot.data.title;
    const appTitle = routeTitle
      ? this.translate.instant(routeTitle)
      : this.title.getTitle();
    this.title.setTitle(appTitle);
  }

  private translateRoute() {
    let routeUrl = '';
    const subPaths = this.router.url.split('/');
    subPaths.forEach((subPath: string) => {
      const translatePath: string = this.translate.instant(`routes.${subPath}`);
      routeUrl =
        subPath.length > 0
          ? this.routeUrlConcat(routeUrl, translatePath, subPath)
          : subPath;
    });
    const lastLocationPath: RoutePath = {
      path: this.location.path(),
      translatedPath: routeUrl,
    };
    localStorage.setItem(lastRouteKey, JSON.stringify(lastLocationPath));
    this.location.replaceState(routeUrl);
  }

  private routeUrlConcat(
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
