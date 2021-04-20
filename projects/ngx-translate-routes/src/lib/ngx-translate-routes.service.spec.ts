import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import {
  ActivatedRoute,
  NavigationEnd,
  NavigationStart,
  Router,
  RouterEvent,
} from '@angular/router';
import { DefaultLangChangeEvent, TranslateService } from '@ngx-translate/core';
import { TranslateTestingModule } from 'ngx-translate-testing';

import { ReplaySubject } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { TRANSLATIONS } from '../test';
import { NgxTranslateRoutesModule } from './ngx-translate-routes.module';
import { NgxTranslateRoutesService } from './ngx-translate-routes.service';

describe('NgxTranslateRoutesService', () => {
  describe('With object config', () => {
    let service: NgxTranslateRoutesService;
    let title: Title;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          TranslateTestingModule.withTranslations(
            TRANSLATIONS
          ).withDefaultLanguage('en'),
          NgxTranslateRoutesModule.forRoot({
            enableRouteTranslate: true,
            enableTitleTranslate: true,
          }),
        ],
        providers: [
          {
            provide: Router,
            useValue: {
              events: of('/'),
              navigateByUrl: (_: any) => {},
              url: '/users/profile/1',
            },
          },
          {
            provide: ActivatedRoute,
            useValue: {
              firstChild: {
                firstChild: {
                  snapshot: {
                    data: {
                      title: 'titles.users.profile',
                    },
                  },
                },
              },
            },
          },
        ],
      });
      title = TestBed.inject(Title);
      service = TestBed.inject(NgxTranslateRoutesService);
      localStorage.clear();
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('#checkConfigValueAndMakeTranslations should set title and url', () => {
      service.checkConfigValueAndMakeTranslations();
      expect(title.getTitle()).toEqual(TRANSLATIONS.en.titles.users.profile);
      expect(document.location.pathname).toEqual('/users/profile/1');
    });
  });

  describe('With object config and 404 error ocurred', () => {
    let service: NgxTranslateRoutesService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          TranslateTestingModule.withTranslations(
            TRANSLATIONS
          ).withDefaultLanguage('en'),
          NgxTranslateRoutesModule.forRoot({
            enableRouteTranslate: true,
            enableTitleTranslate: true,
          }),
        ],
        providers: [
          {
            provide: Router,
            useValue: {
              events: of('/'),
              navigateByUrl: (_: any) => {},
              url: '/404',
            },
          },
          {
            provide: ActivatedRoute,
            useValue: {
              firstChild: {
                firstChild: {
                  snapshot: {
                    data: {},
                  },
                },
              },
            },
          },
        ],
      });
      service = TestBed.inject(NgxTranslateRoutesService);
      localStorage.clear();
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('#checkConfigValueAndMakeTranslations should not set title and url when 404', () => {
      service.checkConfigValueAndMakeTranslations();
      expect(document.location.pathname).not.toEqual(
        `/${TRANSLATIONS.es.routes.about}`
      );
    });
  });

  describe('Without object config', () => {
    const eventSubject = new ReplaySubject<RouterEvent>(1);

    const routerStub = {
      events: eventSubject.asObservable(),
      navigateByUrl: jasmine.createSpy('navigateByUrl'),
      url: '/about',
    };
    const activatedRouteStub = {
      firstChild: {
        snapshot: {
          data: {
            title: 'titles.about',
          },
        },
      },
    };

    let service: NgxTranslateRoutesService;
    let title: Title;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          TranslateTestingModule.withTranslations(
            TRANSLATIONS
          ).withDefaultLanguage('es'),
          NgxTranslateRoutesModule.forRoot(),
        ],
        providers: [
          {
            provide: Router,
            useValue: routerStub,
          },
          {
            provide: ActivatedRoute,
            useValue: activatedRouteStub,
          },
        ],
      });
      title = TestBed.inject(Title);
      service = TestBed.inject(NgxTranslateRoutesService);
      localStorage.clear();
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('#checkConfigValueAndMakeTranslations should set title and url', () => {
      eventSubject.next(new NavigationEnd(1, '/about', 'imperative'));
      expect(title.getTitle()).toEqual(TRANSLATIONS.es.titles.about);
      expect(document.location.pathname).toEqual(
        `/${TRANSLATIONS.es.routes.about}`
      );
    });

    it('#checkConfigValueAndMakeTranslations should set title and url', () => {
      eventSubject.next(new NavigationEnd(1, '/about', 'imperative'));
      eventSubject.next(new NavigationStart(1, '/sobreNosotros', 'imperative'));
      expect(title.getTitle()).toEqual(TRANSLATIONS.es.titles.about);
      expect(document.location.pathname).toEqual(
        `/${TRANSLATIONS.es.routes.about}`
      );
    });
  });

  describe('With object config false', () => {
    let service: NgxTranslateRoutesService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          TranslateTestingModule.withTranslations(
            TRANSLATIONS
          ).withDefaultLanguage('en'),
          NgxTranslateRoutesModule.forRoot({
            enableRouteTranslate: false,
            enableTitleTranslate: false,
          }),
        ],
        providers: [
          {
            provide: Router,
            useValue: {
              events: of('/'),
              navigateByUrl: (_: any) => {},
              url: '/',
            },
          },
          {
            provide: ActivatedRoute,
            useValue: {
              firstChild: {
                firstChild: {
                  snapshot: {
                    data: {},
                  },
                },
              },
            },
          },
        ],
      });
      service = TestBed.inject(NgxTranslateRoutesService);
      localStorage.clear();
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('#checkConfigValueAndMakeTranslations should not translate route and title when config is false', () => {
      service.checkConfigValueAndMakeTranslations();
      const privateSpyTitle = spyOn<any>(service, 'translateTitle');
      const privateSpyRoute = spyOn<any>(service, 'translateRoute');
      expect(privateSpyTitle).not.toHaveBeenCalled();
      expect(privateSpyRoute).not.toHaveBeenCalled();
    });
  });

  describe('With object config false and mock translateService', () => {
    const eventSubject = new ReplaySubject<DefaultLangChangeEvent>(1);

    const fakeTranslate = {
      onDefaultLangChange: eventSubject.asObservable(),
      setDefaultLang: jasmine.createSpy('setDefaultLang'),
      instant: (_: string) => {},
      defaultLang: 'en',
    };
    let service: NgxTranslateRoutesService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          TranslateTestingModule.withTranslations(
            TRANSLATIONS
          ).withDefaultLanguage('en'),
          NgxTranslateRoutesModule.forRoot({
            enableRouteTranslate: false,
            enableTitleTranslate: false,
          }),
        ],
        providers: [
          {
            provide: Router,
            useValue: {
              events: of('/'),
              navigateByUrl: (_: any) => {},
              url: '/',
            },
          },
          {
            provide: ActivatedRoute,
            useValue: {
              firstChild: {
                firstChild: {
                  snapshot: {
                    data: {},
                  },
                },
              },
            },
          },
          {
            provide: TranslateService,
            useValue: fakeTranslate,
          },
        ],
      });
      service = TestBed.inject(NgxTranslateRoutesService);
      localStorage.clear();
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('#checkConfigValueAndMakeTranslations should be called when defaultLangChange', () => {
      spyOn(service, 'checkConfigValueAndMakeTranslations');
      eventSubject.next({ lang: 'en', translations: [] });
      eventSubject.next({ lang: 'es', translations: [] });
      fakeTranslate.onDefaultLangChange.subscribe((newLang) => {
        expect(newLang.lang).toEqual('es');
        expect(service.checkConfigValueAndMakeTranslations).toHaveBeenCalled();
      });
    });
  });
});
