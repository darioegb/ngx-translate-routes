import { Injectable, Optional } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, debounceTime, skip } from 'rxjs/operators';
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
  private isInitTranslate = false;

  constructor(
    private translate: TranslateService,
    private location: Location,
    private title: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    @Optional() config?: NgxTranslateRoutesConfig
  ) {
    this.config = new NgxTranslateRoutesConfig(config);
    this.translate.onDefaultLangChange.pipe(skip(1)).subscribe((lang) => {
      if (this.isInitTranslate) {
        this.translateTitle();
        this.translateRoute();
        console.log(lang);
        console.log(this.translate.defaultLang);
      }
    });
  }

  init() {
    if (this.config) {
      this.initWithConfig();
    } else {
      this.initTranslateRoutes();
      this.initTranslateRouteTitles();
    }
  }

  private initWithConfig() {
    if (this.config.enableRouteTranslate) {
      this.initTranslateRoutes();
    }
    if (this.config.enableTitleTranslate) {
      this.initTranslateRouteTitles();
    }
  }

  private initTranslateRouteTitles() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        debounceTime(100)
      )
      .subscribe(() => {
        this.isInitTranslate = true;
        this.translateTitle();
      });
  }

  private initTranslateRoutes() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        debounceTime(100)
      )
      .subscribe(() => {
        this.isInitTranslate = true;
        this.translateRoute();
      });
    this.router.errorHandler = () => {
      const lastLocationPath = sessionStorage.getItem(lastRouteKey);
      sessionStorage.removeItem(lastRouteKey);
      this.router.navigateByUrl(lastLocationPath);
    };
  }

  private translateTitle() {
    let appTitle = this.title.getTitle();
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
        appTitle = routeTitle;
      }
    }
    this.title.setTitle(appTitle);
  }

  private translateRoute() {
    let routeUrl: string;
    routeUrl = '';
    const subPaths = this.router.url.split('/');
    subPaths.forEach((subPath: string) => {
      const translatePath: string = this.translate.instant(`routes.${subPath}`);
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
  }
}
