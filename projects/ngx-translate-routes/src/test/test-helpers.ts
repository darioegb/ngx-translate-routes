import { Location } from '@angular/common'
import { TranslateService } from '@ngx-translate/core'
import { TranslateTestingModule, Translations } from 'ngx-translate-testing'
import { Observable, of } from 'rxjs'

/**
 * Creates a TranslateService setup that provides the same instance in both the
 * Angular module injector (via `importConfig`) and the environment injector
 * (via `envProvider`). This is required in Angular 22 TestBed where
 * `providedIn: 'root'` services can only access the environment injector.
 */
export function createTranslateSetup(translations: Translations, defaultLang = 'en') {
  const testModule = TranslateTestingModule.withTranslations(translations).withDefaultLanguage(defaultLang)
  const cachedProviders = testModule.providers
  const translateService = (cachedProviders[0] as { useValue: TranslateService }).useValue
  return {
    /** Use in TestBed `imports` to get full TranslateModule support */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    importConfig: { ngModule: testModule.ngModule, providers: cachedProviders } as any,
    /** Use in TestBed `providers` to expose TranslateService to the env injector */
    envProvider: { provide: TranslateService, useValue: translateService },
    /** Direct reference to the shared TranslateService instance */
    translateService,
  }
}

export function createRouterMock(
  config: unknown[] = [],
  url = '/about',
  events: Observable<unknown> = of('/'),
) {
  return {
    config,
    events,
    url,
    parseUrl: vi.fn((urlToParse: string) => {
      const segments = urlToParse
        .split('/')
        .filter((s) => s)
        .map((path) => ({ path, parameters: {} }))
      return {
        root: {
          children: {
            primary: {
              segments:
                segments.length > 0
                  ? segments
                  : [{ path: '', parameters: {} }],
            },
          },
        },
      }
    }),
    createUrlTree: vi.fn((commands: unknown[]) => {
      const filteredCommands = commands?.filter((cmd) => cmd) || []

      if (filteredCommands.length === 0) {
        return { toString: () => url }
      }

      const joined = filteredCommands.join('/')
      const newUrl = joined.startsWith('/') ? joined : '/' + joined

      return {
        toString: () => newUrl,
      }
    }),
    navigateByUrl: vi.fn().mockResolvedValue(true),
    navigate: vi.fn().mockResolvedValue(true),
  }
}

export function createActivatedRouteMock(
  data: Record<string, unknown> = {},
  params: Record<string, unknown> = {},
  queryParams: Record<string, unknown> = {},
) {
  return {
    firstChild: {
      firstChild: {
        firstChild: {
          snapshot: {
            data,
            params,
            queryParams,
            paramMap: {
              get: (key: string) => params[key] || null,
            },
          },
        },
      },
    },
  }
}

export function createLocationMock(path = '/current-path') {
  let currentPath = path

  return {
    path: vi.fn(() => currentPath),
    go: vi.fn((newPath: string) => {
      currentPath = newPath
    }),
    back: vi.fn(),
    forward: vi.fn(),
    prepareExternalUrl: vi.fn((url: string) => url),
    replaceState: vi.fn((newPath: string) => {
      currentPath = newPath
    }),
  } as unknown as ReturnType<typeof vi.fn> & Location
}
