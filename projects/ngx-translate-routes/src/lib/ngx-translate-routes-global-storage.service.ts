import { Injectable, PLATFORM_ID, inject } from '@angular/core'
import { DOCUMENT, isPlatformBrowser } from '@angular/common'
import { millisecondsInADay } from './ngx-translate-routes.constants'
import { NGX_TRANSLATE_ROUTES_CONFIG } from './ngx-translate-routes.token'

@Injectable({
  providedIn: 'root',
})
export class NgxTranslateRoutesGlobalStorageService {
  private readonly document = inject(DOCUMENT)
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID))
  private readonly config = inject(NGX_TRANSLATE_ROUTES_CONFIG)

  setItem<T>(key: string, value: T): void {
    if (this.isBrowser) {
      if (this.config.cacheMethod === 'cookies') {
        const date = new Date()
        date.setTime(
          date.getTime() +
            (this.config.cookieExpirationDays || 30) * millisecondsInADay,
        )
        const expires = `expires=${date.toUTCString()}`
        this.document.cookie = `${key}=${JSON.stringify(value)}; ${expires}; path=/`
      } else {
        localStorage.setItem(key, JSON.stringify(value))
      }
    }
  }

  getItem<T>(key: string): T | null {
    if (this.isBrowser) {
      if (this.config.cacheMethod === 'cookies') {
        const matches = this.document.cookie.match(
          new RegExp(
            '(?:^|; )' +
              key.replace(/([.$?*|{}()[]\/+^])/g, '\\$1') +
              '=([^;]*)',
          ),
        )
        return matches
          ? (JSON.parse(decodeURIComponent(matches[1])) as T)
          : null
      } else {
        const item = localStorage.getItem(key)
        return item ? (JSON.parse(item) as T) : null
      }
    }
    return null
  }

  removeItem(key: string): void {
    if (this.isBrowser) {
      if (this.config.cacheMethod === 'cookies') {
        this.document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
      } else {
        localStorage.removeItem(key)
      }
    }
  }
}
