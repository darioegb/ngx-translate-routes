import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NgxTranslateRoutesService {
  constructor(
    private translate: TranslateService,
    private location: Location,
    private title: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  translateTitles() {
    const appTitle = this.title.getTitle();
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let child = this.activatedRoute.firstChild;
          if (child) {
            while (child.firstChild) {
              child = child.firstChild;
            }
            let routeTitle: string = child.snapshot.data.title;
            if (routeTitle) {
              routeTitle = routeTitle.includes('titles.')
                ? this.translate.instant(routeTitle)
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

  translateRoutes() {
    let routeUrl: string;
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
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
                    !translatePath.startsWith('routes.')
                      ? translatePath
                      : subPath
                  }`
                )
              : subPath;
        });
        this.location.replaceState(routeUrl);
      });
  }
}
