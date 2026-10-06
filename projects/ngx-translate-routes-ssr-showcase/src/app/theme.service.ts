import { DOCUMENT } from '@angular/common'
import { Injectable, inject, signal } from '@angular/core'

export type Theme = 'light' | 'dark'

/** Message the docs page posts to the embedded showcase when its color mode changes. */
export const THEME_MESSAGE_TYPE = 'ngx-translate-routes-theme'

const OWN_STORAGE_KEY = 'ngx-translate-routes-showcase-theme'
/** Key Docusaurus uses to persist its color mode (same origin as the embedded showcase). */
const DOCUSAURUS_STORAGE_KEY = 'theme'

function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark'
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT)
  private readonly window = this.document.defaultView
  // `window` is null during SSR/prerender, so there is no query string to read then.
  private readonly params = new URLSearchParams(
    this.window?.location.search ?? '',
  )

  /** `?embed` is set by the docs iframe, which already provides its own navbar and theme switch. */
  readonly embedded = this.params.has('embed')
  readonly theme = signal<Theme>('light')

  constructor() {
    this.apply(this.initialTheme())
    if (this.embedded) {
      this.window?.addEventListener('message', (event) => this.onMessage(event))
    }
  }

  toggle(): void {
    const next = this.theme() === 'dark' ? 'light' : 'dark'
    this.apply(next)
    this.store(next)
  }

  private apply(theme: Theme): void {
    this.theme.set(theme)
    this.document.documentElement.setAttribute('data-bs-theme', theme)
  }

  private initialTheme(): Theme {
    const fromQuery = this.params.get('theme')
    if (isTheme(fromQuery)) {
      return fromQuery
    }
    // Standalone: the showcase's own toggle wins; otherwise follow the docs theme
    // (same-origin Docusaurus color mode) so a new tab opens in sync.
    const ownStored = this.embedded ? null : this.read(OWN_STORAGE_KEY)
    if (isTheme(ownStored)) {
      return ownStored
    }
    const docsStored = this.read(DOCUSAURUS_STORAGE_KEY)
    if (isTheme(docsStored)) {
      return docsStored
    }
    return this.window?.matchMedia?.('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  }

  private onMessage(event: MessageEvent): void {
    const data = event.data
    if (
      event.origin === this.document.location.origin &&
      data?.type === THEME_MESSAGE_TYPE &&
      isTheme(data.theme)
    ) {
      this.apply(data.theme)
    }
  }

  private read(key: string): string | null {
    try {
      return this.window?.localStorage.getItem(key) ?? null
    } catch {
      return null
    }
  }

  private store(theme: Theme): void {
    try {
      this.window?.localStorage.setItem(OWN_STORAGE_KEY, theme)
    } catch {
      // storage can be blocked (private mode / third-party iframe); the theme just won't persist
    }
  }
}
