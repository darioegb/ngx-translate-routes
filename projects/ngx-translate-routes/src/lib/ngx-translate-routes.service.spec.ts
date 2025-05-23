import { provideHttpClientTesting } from '@angular/common/http/testing'
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

import { ReplaySubject } from 'rxjs'
import { of } from 'rxjs/internal/observable/of'
import { Location } from '@angular/common'
import { TRANSLATIONS } from '../test'
import { NgxTranslateRoutesModule } from './ngx-translate-routes.module'
import { NgxTranslateRoutesService } from './ngx-translate-routes.service'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('NgxTranslateRoutesService', () => {
  describe('With object config', () => {
    let service: NgxTranslateRoutesService
    let title: Title
    let location: Location
    const url = '/users/profile/1'

    beforeEach(() => {
      TestBed.configureTestingModule({
    imports: [TranslateTestingModule.withTranslations(TRANSLATIONS).withDefaultLanguage('en'),
        NgxTranslateRoutesModule.forRoot()],
    providers: [
        {
            provide: Router,
            useValue: {
                events: of('/'),
                createUrlTree: (_: any) => url,
                navigateByUrl: (_: any) => { },
                parseUrl: (_: any) => ({
                    root: {
                        children: {
                            primary: {
                                segments: [
                                    {
                                        path: 'users',
                                    },
                                    {
                                        path: 'profile',
                                    },
                                    {
                                        path: '1',
                                    },
                                ],
                            },
                        },
                    },
                }),
                url,
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
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
})
      title = TestBed.inject(Title)
      service = TestBed.inject(NgxTranslateRoutesService)
      location = TestBed.inject(Location)
      localStorage.clear()
    })

    it('should be created', () => {
      expect(service).toBeTruthy()
    })

    it('checkConfigValueAndMakeTranslations should set title and url', fakeAsync(() => {
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
    imports: [TranslateTestingModule.withTranslations(TRANSLATIONS).withDefaultLanguage('en'),
        NgxTranslateRoutesModule.forRoot()],
    providers: [
        {
            provide: Router,
            useValue: {
                events: of('/'),
                navigateByUrl: (_: any) => { },
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
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
})
      service = TestBed.inject(NgxTranslateRoutesService)
      location = TestBed.inject(Location)
      localStorage.clear()
    })

    it('should be created', () => {
      expect(service).toBeTruthy()
    })

    it('checkConfigValueAndMakeTranslations should not set title and url when 404', () => {
      expect(location.path()).not.toEqual(
        `/${TRANSLATIONS.es.routes.about.root}`,
      )
    })
  })

  describe('Without object config', () => {
    const url = '/sobreNosotros'
    const eventSubject = new ReplaySubject<RouterEvent>(1)

    const routerStub = {
      events: eventSubject.asObservable(),
      navigateByUrl: jasmine.createSpy('navigateByUrl'),
      createUrlTree: (_: any) => url,
      parseUrl: jasmine.createSpy('parseUrl'),
      url,
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
    let router: Router

    beforeEach(() => {
      TestBed.configureTestingModule({
    imports: [TranslateTestingModule.withTranslations(TRANSLATIONS).withDefaultLanguage('es'),
        NgxTranslateRoutesModule.forRoot({
            enableQueryParamsTranslate: true,
        })],
    providers: [
        {
            provide: Router,
            useValue: routerStub,
        },
        {
            provide: ActivatedRoute,
            useValue: activatedRouteStub,
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
})
      title = TestBed.inject(Title)
      service = TestBed.inject(NgxTranslateRoutesService)
      location = TestBed.inject(Location)
      activatedRoute = TestBed.inject(ActivatedRoute)
      router = TestBed.inject(Router)
      localStorage.clear()
      activatedRoute.firstChild!.snapshot.data['skipTranslation'] = false
    })

    it('should be created', () => {
      expect(service).toBeTruthy()
    })

    it('checkConfigValueAndMakeTranslations should set title and url', fakeAsync(() => {
      (router.parseUrl as jasmine.Spy).and.returnValue({
        root: {
          children: {
            primary: {
              segments: [{ path: 'about' }],
            },
          },
        },
        queryParams: { name: 'Test' },
      })
      eventSubject.next(new NavigationEnd(1, '/about', 'imperative'))
      eventSubject.next(new NavigationStart(1, '/sobreNosotros', 'imperative'))
      tick()
      expect(title.getTitle()).toEqual(TRANSLATIONS.es.titles.about)
      expect(location.path()).toEqual(`/${TRANSLATIONS.es.routes.about.root}`)
    }))

    it('should set title without translation if skipTranslation is true', fakeAsync(() => {
      activatedRoute.firstChild!.snapshot.data['skipTranslation'] = true
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
    imports: [TranslateTestingModule.withTranslations(TRANSLATIONS).withDefaultLanguage('en'),
        NgxTranslateRoutesModule.forRoot({
            enableRouteTranslate: false,
            enableTitleTranslate: false,
        })],
    providers: [
        {
            provide: Router,
            useValue: {
                events: of('/'),
                navigateByUrl: (_: any) => { },
                parseUrl: (_: any) => { },
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
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
})
      service = TestBed.inject(NgxTranslateRoutesService)
      title = TestBed.inject(Title)
      localStorage.clear()
    })

    it('should be created', () => {
      expect(service).toBeTruthy()
    })

    it('checkConfigValueAndMakeTranslations should not translate route and title when config is false', () => {
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
      onLangChange: eventSubject.asObservable(),
      use: jasmine.createSpy('use'),
      instant: (_: string) => {},
      defaultLang: 'en',
    }
    let service: NgxTranslateRoutesService

    beforeEach(() => {
      TestBed.configureTestingModule({
    imports: [TranslateTestingModule.withTranslations(TRANSLATIONS).withDefaultLanguage('en'),
        NgxTranslateRoutesModule.forRoot({
            enableRouteTranslate: false,
            enableTitleTranslate: false,
        })],
    providers: [
        {
            provide: Router,
            useValue: {
                events: of('/'),
                navigateByUrl: (_: any) => { },
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
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
})
      service = TestBed.inject(NgxTranslateRoutesService)
      localStorage.clear()
    })

    it('should be created', () => {
      expect(service).toBeTruthy()
    })

    it('checkConfigValueAndMakeTranslations should be called when defaultLangChange', () => {
      spyOn(service, 'checkConfigValueAndMakeTranslations')
      eventSubject.next({ lang: 'en', translations: [] })
      eventSubject.next({ lang: 'es', translations: [] })
      fakeTranslate.onLangChange.subscribe((newLang) => {
        expect(newLang.lang).toEqual('es')
        expect(service.checkConfigValueAndMakeTranslations).toHaveBeenCalled()
      })
    })
  })

  describe('NgxTranslateRoutesService constructor', () => {
    let service: NgxTranslateRoutesService

    const eventSubject = new ReplaySubject<DefaultLangChangeEvent>(1)

    const fakeTranslate = {
      onLangChange: eventSubject.asObservable(),
      use: jasmine.createSpy('use'),
      defaultLang: 'en',
      get: jasmine
        .createSpy('translate.get')
        .and.returnValue(of('translatedPath')),
    }
    const config = {
      onLanguageChange: jasmine.createSpy('onLanguageChange'),
    }

    beforeEach(() => {
      TestBed.configureTestingModule({
    imports: [TranslateTestingModule.withTranslations(TRANSLATIONS).withDefaultLanguage('en'),
        NgxTranslateRoutesModule.forRoot(config)],
    providers: [
        {
            provide: Router,
            useValue: {
                events: of('/'),
                navigateByUrl: (_: any) => { },
                createUrlTree: (_: any) => '/',
                parseUrl: (_: any) => ({
                    root: {
                        children: {
                            primary: {
                                segments: [],
                            },
                        },
                    },
                }),
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
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
})

      service = TestBed.inject(NgxTranslateRoutesService)
      service.init()
    })

    it('should call config.onLanguageChange when default language changes', () => {
      eventSubject.next({ lang: 'en', translations: [] })
      eventSubject.next({ lang: 'es', translations: [] })
      fakeTranslate.onLangChange.subscribe(() => {
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
    imports: [TranslateTestingModule.withTranslations(TRANSLATIONS).withDefaultLanguage('en'),
        NgxTranslateRoutesModule.forRoot(config)],
    providers: [
        {
            provide: Router,
            useValue: {
                events: of('/'),
                createUrlTree: (_: any) => 'custom-test',
                navigateByUrl: (_: any) => { },
                parseUrl: (_: any) => ({
                    root: {
                        children: {
                            primary: {
                                segments: [
                                    {
                                        path: 'test',
                                    },
                                ],
                            },
                        },
                    },
                }),
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
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
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
    const url = '/no-title'

    beforeEach(() => {
      TestBed.configureTestingModule({
    imports: [TranslateTestingModule.withTranslations(TRANSLATIONS).withDefaultLanguage('en'),
        NgxTranslateRoutesModule.forRoot()],
    providers: [
        {
            provide: Router,
            useValue: {
                events: of('/'),
                createUrlTree: (_: any) => url,
                navigateByUrl: (_: any) => { },
                parseUrl: (_: any) => ({
                    root: {
                        children: {
                            primary: {
                                segments: [
                                    {
                                        path: 'no-title',
                                    },
                                ],
                            },
                        },
                    },
                }),
                url,
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
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
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

  describe('enableLanguageInPath', () => {
    let service: NgxTranslateRoutesService
    let location: Location
    const config = {
      enableLanguageInPath: true,
    }

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          TranslateTestingModule.withTranslations(TRANSLATIONS).withDefaultLanguage('en'),
          NgxTranslateRoutesModule.forRoot(config),
        ],
        providers: [
          {
            provide: Router,
            useValue: {
              events: of('/'),
              createUrlTree: (_: any) => '/es/test',
              navigateByUrl: (_: any) => {},
              parseUrl: (_: any) => ({
                root: {
                  children: {
                    primary: {
                      segments: [{ path: 'es' }, { path: 'test' }],
                    },
                  },
                },
              }),
              url: '/es/test',
            },
          },
          {
            provide: ActivatedRoute,
            useValue: {
              firstChild: {
                snapshot: {
                  data: {},
                },
              },
            },
          },
          provideHttpClient(withInterceptorsFromDi()),
          provideHttpClientTesting(),
        ],
      })
      service = TestBed.inject(NgxTranslateRoutesService)
      location = TestBed.inject(Location)
      localStorage.clear()
      service.init()
    })

    it('should include non-default language in the path when enabled', fakeAsync(() => {
      service.checkConfigValueAndMakeTranslations()
      tick()
      expect(location.path()).toEqual('/es/test')
    }))

    it('should not include default language in the path', fakeAsync(() => {
      TestBed.resetTestingModule()
      TestBed.configureTestingModule({
        imports: [
          TranslateTestingModule.withTranslations(TRANSLATIONS).withDefaultLanguage('en'),
          NgxTranslateRoutesModule.forRoot(config),
        ],
        providers: [
          {
            provide: Router,
            useValue: {
              events: of('/'),
              createUrlTree: (_: any) => '/test',
              navigateByUrl: (_: any) => {},
              parseUrl: (_: any) => ({
                root: {
                  children: {
                    primary: {
                      segments: [{ path: 'test' }],
                    },
                  },
                },
              }),
              url: '/test',
            },
          },
          {
            provide: ActivatedRoute,
            useValue: {
              firstChild: {
                snapshot: {
                  data: {},
                },
              },
            },
          },
          provideHttpClient(withInterceptorsFromDi()),
          provideHttpClientTesting(),
        ],
      })
      service = TestBed.inject(NgxTranslateRoutesService)
      location = TestBed.inject(Location)
      localStorage.clear()
      service.init()
      service.checkConfigValueAndMakeTranslations()
      tick()
      expect(location.path()).toEqual('/test')
    }))
  })

  describe('includeDefaultLanguageInPath', () => {
    let service: NgxTranslateRoutesService
    let location: Location
    const config = {
      includeDefaultLanguageInPath: true,
    }

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          TranslateTestingModule.withTranslations(TRANSLATIONS).withDefaultLanguage('en'),
          NgxTranslateRoutesModule.forRoot(config),
        ],
        providers: [
          {
            provide: Router,
            useValue: {
              events: of('/'),
              createUrlTree: (_: any) => '/en/test',
              navigateByUrl: (_: any) => {},
              parseUrl: (_: any) => ({
                root: {
                  children: {
                    primary: {
                      segments: [{ path: 'en' }, { path: 'test' }],
                    },
                  },
                },
              }),
              url: '/en/test',
            },
          },
          {
            provide: ActivatedRoute,
            useValue: {
              firstChild: {
                snapshot: {
                  data: {},
                },
              },
            },
          },
          provideHttpClient(withInterceptorsFromDi()),
          provideHttpClientTesting(),
        ],
      })
      service = TestBed.inject(NgxTranslateRoutesService)
      location = TestBed.inject(Location)
      localStorage.clear()
      service.init()
    })

    it('should include default language in the path when enabled', fakeAsync(() => {
      service.checkConfigValueAndMakeTranslations()
      tick()
      expect(location.path()).toEqual('/en/test')
    }))

    it('should not include default language in the path when disabled', fakeAsync(() => {
      const updatedConfig = { includeDefaultLanguageInPath: false }
      TestBed.resetTestingModule()
      TestBed.configureTestingModule({
        imports: [
          TranslateTestingModule.withTranslations(TRANSLATIONS).withDefaultLanguage('en'),
          NgxTranslateRoutesModule.forRoot(updatedConfig),
        ],
        providers: [
          {
            provide: Router,
            useValue: {
              events: of('/'),
              createUrlTree: (_: any) => '/test',
              navigateByUrl: (_: any) => {},
              parseUrl: (_: any) => ({
                root: {
                  children: {
                    primary: {
                      segments: [{ path: 'test' }],
                    },
                  },
                },
              }),
              url: '/test',
            },
          },
          {
            provide: ActivatedRoute,
            useValue: {
              firstChild: {
                snapshot: {
                  data: {},
                },
              },
            },
          },
          provideHttpClient(withInterceptorsFromDi()),
          provideHttpClientTesting(),
        ],
      })
      service = TestBed.inject(NgxTranslateRoutesService)
      location = TestBed.inject(Location)
      localStorage.clear()
      service.init()
      service.checkConfigValueAndMakeTranslations()
      tick()
      expect(location.path()).toEqual('/test')
    }))
  })
})
