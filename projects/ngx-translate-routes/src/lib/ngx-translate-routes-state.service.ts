import {
  Injectable,
  PLATFORM_ID,
  inject,
  TransferState,
  makeStateKey,
} from '@angular/core'
import { isPlatformBrowser, isPlatformServer, DOCUMENT } from '@angular/common'
import { RoutePath } from './ngx-translate-routes.interfaces'
import {
  lastRouteKey,
  millisecondsInADay,
} from './ngx-translate-routes.constants'
import { NGX_TRANSLATE_ROUTES_CONFIG } from './ngx-translate-routes.token'

const ROUTE_STATE_KEY = makeStateKey<RoutePath[]>('ngx-translate-routes-state')
const PRELOADED_ROUTES_KEY = makeStateKey<Record<string, string>>(
  'ngx-translate-routes-preloaded',
)

@Injectable({
  providedIn: 'root',
})
export class NgxTranslateRoutesStateService {
  private readonly transferState = inject(TransferState)
  private readonly platformId = inject(PLATFORM_ID)
  private readonly document = inject(DOCUMENT)
  private readonly config = inject(NGX_TRANSLATE_ROUTES_CONFIG)

  private readonly isServer = isPlatformServer(this.platformId)
  private readonly isBrowser = isPlatformBrowser(this.platformId)

  setItem<T>(key: string, value: T): void {
    if (this.isServer && key === lastRouteKey && Array.isArray(value)) {
      this.transferState.set(ROUTE_STATE_KEY, value as RoutePath[])
    } else if (this.isBrowser) {
      this.storeInBrowser(key, value)
    }
  }

  private storeInBrowser<T>(key: string, value: T): void {
    if (this.config.cacheMethod === 'cookies') {
      const expiry = new Date()
      expiry.setTime(
        expiry.getTime() +
          (this.config.cookieExpirationDays || 30) * millisecondsInADay,
      )
      this.document.cookie = `${key}=${JSON.stringify(value)}; expires=${expiry.toUTCString()}; path=/`
    } else {
      localStorage.setItem(key, JSON.stringify(value))
    }
  }

  getItem<T>(key: string): T | null {
    if (!this.isBrowser) return null

    if (key === lastRouteKey) {
      const transferredValue = this.transferState.get(ROUTE_STATE_KEY, null)
      if (transferredValue) {
        this.transferState.remove(ROUTE_STATE_KEY)
        return transferredValue as T
      }
    }

    return this.getFromStorage<T>(key)
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

  setPreloadedRoutes(routes: Record<string, string>): void {
    if (this.isServer) {
      this.transferState.set(PRELOADED_ROUTES_KEY, routes)
    }
  }

  getPreloadedRoutes(): Record<string, string> | null {
    if (this.isBrowser) {
      const preloaded = this.transferState.get(PRELOADED_ROUTES_KEY, null)
      if (preloaded) {
        this.transferState.remove(PRELOADED_ROUTES_KEY)
        return preloaded
      }
    }
    return null
  }

  isServerSide(): boolean {
    return this.isServer
  }

  isClientSide(): boolean {
    return this.isBrowser
  }

  private getFromStorage<T>(key: string): T | null {
    if (!this.isBrowser) return null

    if (this.config.cacheMethod === 'cookies') {
      const matches = this.document.cookie.match(
        new RegExp(
          '(?:^|; )' + key.replace(/([.$?*|{}()[]\/+^])/g, '\\$1') + '=([^;]*)',
        ),
      )
      return matches ? (JSON.parse(decodeURIComponent(matches[1])) as T) : null
    } else {
      const item = localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : null
    }
  }
}
