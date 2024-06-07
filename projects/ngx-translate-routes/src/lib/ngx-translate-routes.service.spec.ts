import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TestBed, fakeAsync, tick } from '@angular/core/testing'
import { Title } from '@angular/platform-browser'
import {
  ActivatedRoute,
  NavigationEnd,
  NavigationStart,
  Router,
  RouterEvent,
} from '@angular/router'
import { DefaultLangChangeEvent, TranslateService } from '@ngx-translate/core'
import { TranslateTestingModule } from 'ngx-translate-testing'

import { ReplaySubject, Subject } from 'rxjs'
import { of } from 'rxjs/internal/observable/of'
import { Location } from '@angular/common'
import { TRANSLATIONS } from '../test'
import { NgxTranslateRoutesModule } from './ngx-translate-routes.module'
import { NgxTranslateRoutesService } from './ngx-translate-routes.service'

describe('NgxTranslateRoutesService', () => {
  describe('With object config', () => {
    let service: NgxTranslateRoutesService
    let title: Title
    let location: Location

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          TranslateTestingModule.withTranslations(
            TRANSLATIONS,
          ).withDefaultLanguage('en'),
          NgxTranslateRoutesModule.forRoot(),
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
                      title: 'users.profile',
                    },
                  },
                },
              },
            },
          },
        ],
      })
      title = TestBed.inject(Title)
      service = TestBed.inject(NgxTranslateRoutesService)
      location = TestBed.inject(Location)
      localStorage.clear()
      service.init()
    })

    it('should be created', () => {
      expect(service).toBeTruthy()
    })

    it('#checkConfigValueAndMakeTranslations should set title and url', fakeAsync(() => {
      service.checkConfigValueAndMakeTranslations()
      tick()
      expect(title.getTitle()).toEqual(TRANSLATIONS.en.titles.users.profile)
      expect(location.path()).toEqual('/users/profile/1')
    }))
  })

  describe('With object config and 404 error ocurred', () => {
    let service: NgxTranslateRoutesService
    let location: Location

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          TranslateTestingModule.withTranslations(
            TRANSLATIONS,
          ).withDefaultLanguage('en'),
          NgxTranslateRoutesModule.forRoot(),
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
      })
      service = TestBed.inject(NgxTranslateRoutesService)
      location = TestBed.inject(Location)
      localStorage.clear()
    })

    it('should be created', () => {
      expect(service).toBeTruthy()
    })

    it('#checkConfigValueAndMakeTranslations should not set title and url when 404', () => {
      expect(location.path()).not.toEqual(`/${TRANSLATIONS.es.routes.about}`)
    })
  })

  describe('Without object config', () => {
    const eventSubject = new ReplaySubject<RouterEvent>(1)

    const routerStub = {
      events: eventSubject.asObservable(),
      navigateByUrl: jasmine.createSpy('navigateByUrl'),
      url: '/about',
    }
    const activatedRouteStub = {
      firstChild: {
        snapshot: {
          data: {
            title: 'about',
          },
        },
      },
    }

    let service: NgxTranslateRoutesService
    let title: Title
    let location: Location
    let activatedRoute: ActivatedRoute

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          TranslateTestingModule.withTranslations(
            TRANSLATIONS,
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
      })
      title = TestBed.inject(Title)
      service = TestBed.inject(NgxTranslateRoutesService)
      location = TestBed.inject(Location)
      activatedRoute = TestBed.inject(ActivatedRoute)
      localStorage.clear()
      activatedRoute.firstChild!.snapshot.data.skipTranslation = false
    })

    it('should be created', () => {
      expect(service).toBeTruthy()
    })

    it('#checkConfigValueAndMakeTranslations should set title and url', fakeAsync(() => {
      eventSubject.next(new NavigationEnd(1, '/about', 'imperative'))
      tick()
      expect(title.getTitle()).toEqual(TRANSLATIONS.es.titles.about)
      expect(location.path()).toEqual(`/${TRANSLATIONS.es.routes.about}`)
    }))

    it('#checkConfigValueAndMakeTranslations should set title and url', fakeAsync(() => {
      eventSubject.next(new NavigationEnd(1, '/about', 'imperative'))
      eventSubject.next(new NavigationStart(1, '/sobreNosotros', 'imperative'))
      tick()
      expect(title.getTitle()).toEqual(TRANSLATIONS.es.titles.about)
      expect(location.path()).toEqual(`/${TRANSLATIONS.es.routes.about}`)
    }))

    it('should set title without translation if skipTranslation is true', fakeAsync(() => {
      activatedRoute.firstChild!.snapshot.data.skipTranslation = true
      service.checkConfigValueAndMakeTranslations()
      tick()
      expect(title.getTitle()).toEqual('about')
    }))
  })

  describe('With object config false', () => {
    let service: NgxTranslateRoutesService
    let title: Title

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          TranslateTestingModule.withTranslations(
            TRANSLATIONS,
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
      })
      service = TestBed.inject(NgxTranslateRoutesService)
      title = TestBed.inject(Title)
      localStorage.clear()
    })

    it('should be created', () => {
      expect(service).toBeTruthy()
    })

    it('#checkConfigValueAndMakeTranslations should not translate route and title when config is false', () => {
      service.checkConfigValueAndMakeTranslations()
      const privateSpyRoute = spyOn(localStorage, 'setItem')
      const privateSpyTitle = spyOn(title, 'setTitle')
      expect(privateSpyTitle).not.toHaveBeenCalled()
      expect(privateSpyRoute).not.toHaveBeenCalled()
    })
  })

  describe('With object config false and mock translateService', () => {
    const eventSubject = new ReplaySubject<DefaultLangChangeEvent>(1)

    const fakeTranslate = {
      onDefaultLangChange: eventSubject.asObservable(),
      setDefaultLang: jasmine.createSpy('setDefaultLang'),
      instant: (_: string) => {},
      defaultLang: 'en',
    }
    let service: NgxTranslateRoutesService

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          TranslateTestingModule.withTranslations(
            TRANSLATIONS,
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
      })
      service = TestBed.inject(NgxTranslateRoutesService)
      localStorage.clear()
    })

    it('should be created', () => {
      expect(service).toBeTruthy()
    })

    it('#checkConfigValueAndMakeTranslations should be called when defaultLangChange', () => {
      spyOn(service, 'checkConfigValueAndMakeTranslations')
      eventSubject.next({ lang: 'en', translations: [] })
      eventSubject.next({ lang: 'es', translations: [] })
      fakeTranslate.onDefaultLangChange.subscribe((newLang) => {
        expect(newLang.lang).toEqual('es')
        expect(service.checkConfigValueAndMakeTranslations).toHaveBeenCalled()
      })
    })
  })

  describe('NgxTranslateRoutesService constructor', () => {
    let service: NgxTranslateRoutesService

    const eventSubject = new ReplaySubject<DefaultLangChangeEvent>(1)

    const fakeTranslate = {
      onDefaultLangChange: eventSubject.asObservable(),
      setDefaultLang: jasmine.createSpy('setDefaultLang'),
      defaultLang: 'en',
      get: jasmine.createSpy('translate.get').and.returnValue(of('translatedPath'))
    }
    const config = {
      onLanguageChange: jasmine.createSpy('onLanguageChange'),
    }

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          TranslateTestingModule.withTranslations(
            TRANSLATIONS,
          ).withDefaultLanguage('en'),
          NgxTranslateRoutesModule.forRoot(config),
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
          { provide: TranslateService, useValue: fakeTranslate },
          NgxTranslateRoutesService,
        ],
      })

      service = TestBed.inject(NgxTranslateRoutesService)
    })

    it('should call config.onLanguageChange when default language changes', () => {
      eventSubject.next({ lang: 'en', translations: [] })
      eventSubject.next({ lang: 'es', translations: [] })
      fakeTranslate.onDefaultLangChange.subscribe(() => {
        expect(config.onLanguageChange).toHaveBeenCalled()
      })
    })
  })

  describe('Route translation with custom strategy', () => {
    let service: NgxTranslateRoutesService
    let location: Location

    const config = {
      enableRouteTranslate: true,
      routeTranslationStrategy: (route: string) => `custom-${route}`,
      routesUsingStrategy: ['test'],
    }

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          TranslateTestingModule.withTranslations(
            TRANSLATIONS,
          ).withDefaultLanguage('en'),
          NgxTranslateRoutesModule.forRoot(config),
        ],
        providers: [
          {
            provide: Router,
            useValue: {
              events: of('/'),
              navigateByUrl: (_: any) => {},
              url: '/test',
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
      })
      service = TestBed.inject(NgxTranslateRoutesService)
      location = TestBed.inject(Location)
      localStorage.clear()
      service.init()
    })

    it('should use custom translation strategy for routes', fakeAsync(() => {
      service.checkConfigValueAndMakeTranslations()
      tick()
      expect(location.path()).toEqual('/custom-test')
    }))
  })

  describe('Title translation fallback to default title', () => {
    let service: NgxTranslateRoutesService
    let title: Title

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          TranslateTestingModule.withTranslations(
            TRANSLATIONS,
          ).withDefaultLanguage('en'),
          NgxTranslateRoutesModule.forRoot(),
        ],
        providers: [
          {
            provide: Router,
            useValue: {
              events: of('/'),
              navigateByUrl: (_: any) => {},
              url: '/no-title',
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
      })
      title = TestBed.inject(Title)
      spyOn(title, 'getTitle').and.returnValue('Default Title')
      service = TestBed.inject(NgxTranslateRoutesService)
      localStorage.clear()
      service.init()
    })

    it('should fall back to default title if no title data is present', fakeAsync(() => {
      service.checkConfigValueAndMakeTranslations()
      tick()
      expect(title.getTitle()).toEqual('Default Title')
    }))
  })
})
