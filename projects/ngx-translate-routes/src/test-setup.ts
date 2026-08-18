import 'zone.js'
import 'zone.js/testing'

// Ensure tests run inside Angular's ProxyZone so that fakeAsync() works with Vitest.
// zone.js/testing patches jasmine/jest automatically but Vitest needs explicit wrapping.
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-function-type */
const Zone = (globalThis as Record<string, unknown>)['Zone'] as { current: { fork: (spec: unknown) => { run: (fn: (...args: unknown[]) => unknown, ctx: unknown, args: unknown[]) => unknown } }; ProxyZoneSpec: { new(): unknown } } | undefined

if (Zone?.ProxyZoneSpec && typeof beforeEach === 'function' && typeof afterEach === 'function') {
  const ProxyZoneSpec = Zone.ProxyZoneSpec
  const proxyZoneSpec = new ProxyZoneSpec()
  const proxyZone = Zone.current.fork(proxyZoneSpec)

  const g = globalThis as Record<string, any>
  const origBeforeEach = g['beforeEach'] as (fn: Function, ...a: unknown[]) => void
  const origAfterEach = g['afterEach'] as (fn: Function, ...a: unknown[]) => void
  const origIt = g['it'] as ((name: string, fn: Function, ...a: unknown[]) => void) & { only?: unknown; skip?: unknown; todo?: unknown }
  const origTest = g['test'] as ((name: string, fn: Function, ...a: unknown[]) => void) & { only?: unknown; skip?: unknown; todo?: unknown }

  function wrapInProxyZone(fn: unknown): unknown {
    if (!fn || typeof fn !== 'function') return fn
    return function (this: unknown, ...args: unknown[]) {
      return proxyZone.run(fn as (...a: unknown[]) => unknown, this, args)
    }
  }

  g['beforeEach'] = (fn: Function, ...a: unknown[]) => origBeforeEach(wrapInProxyZone(fn) as Function, ...a)
  g['afterEach'] = (fn: Function, ...a: unknown[]) => origAfterEach(wrapInProxyZone(fn) as Function, ...a)
  g['it'] = (name: string, fn: Function, ...a: unknown[]) => origIt(name, wrapInProxyZone(fn) as Function, ...a)
  g['test'] = (name: string, fn: Function, ...a: unknown[]) => origTest(name, wrapInProxyZone(fn) as Function, ...a)
  g['it'].only = origIt.only
  g['it'].skip = origIt.skip
  g['it'].todo = origIt.todo
  g['test'].only = origTest.only
  g['test'].skip = origTest.skip
  g['test'].todo = origTest.todo
}
/* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-function-type */
