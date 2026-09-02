import { TestBed } from '@angular/core/testing'
import { ApplicationInitStatus, PLATFORM_ID } from '@angular/core'
import { provideNgxTranslateRoutes } from './ngx-translate-routes.providers'
import { NgxTranslateRoutesService } from './ngx-translate-routes.service'
import { NGX_TRANSLATE_ROUTES_CONFIG } from './ngx-translate-routes.token'

describe('provideNgxTranslateRoutes', () => {
  it('should throw when enableSsrRouteTranslation is provided', () => {
    expect(() =>
      provideNgxTranslateRoutes({ enableSsrRouteTranslation: true }),
    ).toThrow(/removed in v3/)
  })

  it('should merge config with defaults', () => {
    TestBed.configureTestingModule({
      providers: [provideNgxTranslateRoutes({ enableRouteTranslate: false })],
    })

    const config = TestBed.inject(NGX_TRANSLATE_ROUTES_CONFIG)
    expect(config.enableRouteTranslate).toBe(false)
    expect(config.enableTitleTranslate).toBe(true)
  })

  it('should call init() on the browser platform', async () => {
    const initSpy = vi.fn()
    TestBed.configureTestingModule({
      providers: [
        provideNgxTranslateRoutes(),
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
        provideNgxTranslateRoutes(),
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
