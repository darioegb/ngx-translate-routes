import { TestBed } from '@angular/core/testing'
import { ApplicationInitStatus, PLATFORM_ID } from '@angular/core'
import { NGX_TRANSLATE_ROUTES_CONFIG, NgxTranslateRoutesService } from 'ngx-translate-routes'
import { provideNgxTranslateRoutesSsr } from './providers'

describe('provideNgxTranslateRoutesSsr', () => {
  it('should force enableSsrRouteTranslation to true and merge availableLanguages', () => {
    TestBed.configureTestingModule({
      providers: [
        provideNgxTranslateRoutesSsr({ availableLanguages: ['en', 'es'] }),
      ],
    })

    const config = TestBed.inject(NGX_TRANSLATE_ROUTES_CONFIG)
    expect(config.enableSsrRouteTranslation).toBe(true)
    expect(config.availableLanguages).toEqual(['en', 'es'])
  })

  it('should call init() on the browser platform', async () => {
    const initSpy = vi.fn()
    TestBed.configureTestingModule({
      providers: [
        provideNgxTranslateRoutesSsr(),
        { provide: PLATFORM_ID, useValue: 'browser' },
        {
          provide: NgxTranslateRoutesService,
          useValue: { init: initSpy, initForSsr: vi.fn() },
        },
      ],
    })

    await TestBed.inject(ApplicationInitStatus).donePromise

    expect(initSpy).toHaveBeenCalled()
  })

  it('should call initForSsr() then init() on the server platform', async () => {
    const initSpy = vi.fn()
    const initForSsrSpy = vi.fn().mockResolvedValue(undefined)
    TestBed.configureTestingModule({
      providers: [
        provideNgxTranslateRoutesSsr(),
        { provide: PLATFORM_ID, useValue: 'server' },
        {
          provide: NgxTranslateRoutesService,
          useValue: { init: initSpy, initForSsr: initForSsrSpy },
        },
      ],
    })

    await TestBed.inject(ApplicationInitStatus).donePromise

    expect(initForSsrSpy).toHaveBeenCalled()
    expect(initSpy).toHaveBeenCalled()
  })
})
