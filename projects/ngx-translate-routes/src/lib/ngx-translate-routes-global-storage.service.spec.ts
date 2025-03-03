import { TestBed } from '@angular/core/testing'
import { DOCUMENT } from '@angular/common'
import { NgxTranslateRoutesGlobalStorageService } from './ngx-translate-routes-global-storage.service'
import { NgxTranslateRoutesModule } from './ngx-translate-routes.module'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { TRANSLATIONS } from '../test'
import { ActivatedRoute } from '@angular/router'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('NgxTranslateRoutesGlobalStorageService', () => {
  let storageService: NgxTranslateRoutesGlobalStorageService
  let document: Document

  describe('with cookies cache method', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
    imports: [TranslateTestingModule.withTranslations(TRANSLATIONS).withDefaultLanguage('en'),
        NgxTranslateRoutesModule.forRoot({
            cacheMethod: 'cookies',
            cookieExpirationDays: 7,
        })],
    providers: [
        {
            provide: ActivatedRoute,
            useValue: {
                snapshot: {
                    data: {},
                },
            },
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
})
      storageService = TestBed.inject(NgxTranslateRoutesGlobalStorageService)
      document = TestBed.inject(DOCUMENT)
      document.cookie = ''
    })

    it('should set item in cookies', () => {
      storageService.setItem('testKey', 'testValue')
      expect(document.cookie).toContain('testKey="testValue"')
    })

    it('should get item from cookies', () => {
      document.cookie = 'testKey="testValue"'
      const value = storageService.getItem('testKey')
      expect(value).toEqual('testValue')
    })

    it('should remove item from cookies', () => {
      document.cookie = 'testKey="testValue"'
      storageService.removeItem('testKey')
      expect(document.cookie).not.toContain('testKey="testValue"')
    })

    it('should clear all cookies', () => {
      document.cookie = 'testKey1="testValue1"; testKey2="testValue2"'
      storageService.clear()
      expect(document.cookie).toEqual('')
    })
  })

  describe('with localStorage cache method', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
    imports: [TranslateTestingModule.withTranslations(TRANSLATIONS).withDefaultLanguage('en'),
        NgxTranslateRoutesModule.forRoot({
            cacheMethod: 'localStorage',
        })],
    providers: [
        {
            provide: ActivatedRoute,
            useValue: {
                snapshot: {
                    data: {},
                },
            },
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
})
      storageService = TestBed.inject(NgxTranslateRoutesGlobalStorageService)
      localStorage.clear()
    })

    it('should set item in localStorage', () => {
      storageService.setItem('testKey', 'testValue')
      expect(localStorage.getItem('testKey')).toEqual('"testValue"')
    })

    it('should get item from localStorage', () => {
      localStorage.setItem('testKey', '"testValue"')
      const value = storageService.getItem('testKey')
      expect(value).toEqual('testValue')
    })

    it('should remove item from localStorage', () => {
      localStorage.setItem('testKey', 'testValue')
      storageService.removeItem('testKey')
      expect(localStorage.getItem('testKey')).toBeNull()
    })

    it('should clear all items from localStorage', () => {
      localStorage.setItem('testKey1', 'testValue1')

      localStorage.setItem('testKey2', 'testValue2')
      storageService.clear()
      expect(localStorage.length).toEqual(0)
    })
  })
})
