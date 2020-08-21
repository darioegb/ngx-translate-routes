import { Injectable, Optional } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';
import {
  Router,
  NavigationEnd,
  ActivatedRoute,
} from '@angular/router';
import { filter, map, debounceTime } from 'rxjs/operators';
import { NgxTranslateRoutesConfig } from './ngx-translate-routes-config';
import {
  translatePrefixes,
  lastRouteKey,
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
    this.config = new NgxTranslateRoutesConfig(config);
  }

  init() {
    if (this.config) {
      this.initWithConfig();
    } else {
      this.translateRoutes();
      this.translateTitles();
    }
  }

  private initWithConfig() {
    if (this.config.enableRouteTranslate) {
      this.translateRoutes();
    }
    if (this.config.enableTitleTranslate) {
      this.translateTitles();
    }
  }

  private translateTitles() {
    const appTitle = this.title.getTitle();
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        debounceTime(10),
        map(() => {
          let child = this.activatedRoute.firstChild;
          if (child) {
            while (child.firstChild) {
              child = child.firstChild;
            }
            let routeTitle: string = child.snapshot.data.title;
            if (routeTitle) {
              const translateTitle: string = this.translate.instant(routeTitle);
              routeTitle = !translateTitle.startsWith(translatePrefixes.title)
                ? translateTitle
                : routeTitle;
              return routeTitle;
            }
          }
          return appTitle;
        })
      )
      .subscribe((ttl: string) => {
        this.title.setTitle(ttl);
      });
  }

  private translateRoutes() {
    let routeUrl: string;
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        debounceTime(10)
      )
      .subscribe(() => {
        routeUrl = '';
        const subPaths = this.router.url.split('/');
        subPaths.forEach((subPath: string) => {
          const translatePath: string = this.translate.instant(
            `routes.${subPath}`
          );
          routeUrl =
            subPath.length > 0
              ? routeUrl.concat(
                  `/${
                    !translatePath.startsWith(translatePrefixes.route)
                      ? translatePath
                      : subPath
                  }`
                )
              : subPath;
        });
        sessionStorage.setItem(lastRouteKey, this.location.path());
        this.location.replaceState(routeUrl);
      });
    this.router.errorHandler = () => {
      const lastLocationPath = sessionStorage.getItem(lastRouteKey);
      sessionStorage.removeItem(lastRouteKey);
      this.router.navigateByUrl(lastLocationPath);
    };
  }
}
