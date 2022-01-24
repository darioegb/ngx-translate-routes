import { Inject, Injectable } from '@angular/core';

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
import { NGX_TRANSLATE_ROUTES_CONFING } from './ngx-translate-routes.token';

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
    @Inject(NGX_TRANSLATE_ROUTES_CONFING)
    config: NgxTranslateRoutesConfig
  ) {
    this.config = config;
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
              JSON.parse(localStorage.getItem(lastRouteKey) || '{}')
                ?.translatedPath === event.url)
        )
      )
      .subscribe({
        next: (event) => {
          if (event instanceof NavigationStart) {
            const item = localStorage.getItem(lastRouteKey);
            const lastLocationPath: RoutePath = item && JSON.parse(item);
            localStorage.removeItem(lastRouteKey);
            this.router.navigateByUrl(lastLocationPath.path);
          } else {
            this.checkConfigValueAndMakeTranslations();
          }
        },
      });
  }

  checkConfigValueAndMakeTranslations() {
    this.config.enableTitleTranslate && this.translateTitle();
    this.config.enableRouteTranslate && this.translateRoute();
  }

  private translateTitle() {
    let child = this.activatedRoute.firstChild;
    while (child?.firstChild) {
      child = child.firstChild;
    }
    const routeTitle = child?.snapshot.data?.title;
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
