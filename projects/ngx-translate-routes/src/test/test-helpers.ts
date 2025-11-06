import { Location } from '@angular/common'
import { Observable, of } from 'rxjs'

export function createRouterMock(
  config: unknown[] = [],
  url = '/about',
  events: Observable<unknown> = of('/'),
) {
  return {
    config,
    events,
    url,
    parseUrl: jasmine
      .createSpy('parseUrl')
      .and.callFake((urlToParse: string) => {
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
    createUrlTree: jasmine
      .createSpy('createUrlTree')
      .and.callFake((commands: unknown[]) => {
        // Filter out falsy values (undefined, null, empty strings)
        const filteredCommands = commands?.filter((cmd) => cmd) || []

        if (filteredCommands.length === 0) {
          // Empty commands array - use current url
          return { toString: () => url }
        }

        // Join commands and ensure proper leading slash
        const joined = filteredCommands.join('/')
        const newUrl = joined.startsWith('/') ? joined : '/' + joined

        return {
          toString: () => newUrl,
        }
      }),
    navigateByUrl: jasmine
      .createSpy('navigateByUrl')
      .and.returnValue(Promise.resolve(true)),
    navigate: jasmine
      .createSpy('navigate')
      .and.returnValue(Promise.resolve(true)),
  }
}

/**
 * Creates an ActivatedRoute mock with nested children
 * @param data Route data
 * @param params Route params
 * @param queryParams Query params
 * @returns ActivatedRoute mock object
 */
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

/**
 * Creates a Location mock for testing
 * @param path Current path
 * @returns Location mock object
 */
export function createLocationMock(
  path = '/current-path',
): jasmine.SpyObj<Location> {
  let currentPath = path

  const spy = jasmine.createSpyObj('Location', [
    'path',
    'go',
    'back',
    'forward',
    'prepareExternalUrl',
    'replaceState',
  ])

  // Configure default return values
  spy.path.and.callFake(() => currentPath)
  spy.prepareExternalUrl.and.callFake((url: string) => url)
  spy.replaceState.and.callFake((newPath: string) => {
    currentPath = newPath
  })
  spy.go.and.callFake((newPath: string) => {
    currentPath = newPath
  })
  spy.back.and.stub()
  spy.forward.and.stub()

  return spy
}
