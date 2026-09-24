# Copilot instructions for ngx-translate-routes

This is an Angular 22 workspace (library peer floor: Angular >= 18) built with pnpm. Three projects:

- `projects/ngx-translate-routes/` — the published library. Two entry points: the root (`ngx-translate-routes`) and a secondary one at `ssr/` (`ngx-translate-routes/ssr`) for SSR-only route registration.
- `projects/ngx-translate-routes-showcase/` — a client-side-only demo app; deliberately uses `NgModule`-based, non-standalone components (`standalone: false`) to keep exercising the deprecated `NgxTranslateRoutesModule.forRoot()` path. Not published.
- `projects/ngx-translate-routes-ssr-showcase/` — an SSR demo app using standalone components and `provideNgxTranslateRoutesSsr()`. Not published.

## Architecture

- `NgxTranslateRoutesService` is the orchestrator: it listens to `Router` navigation events (`NavigationStart`/`NavigationEnd`) and to `TranslateService.onLangChange`, and mutates `router.config` directly (unshifting translated routes, restoring the wildcard route) rather than going through Angular's routing APIs. `init()` runs on the browser; `initForSsr()` additionally registers translated routes into `router.config` before the first render so server-rendered HTML already has the right URL.
- `NgxTranslateRoutesHelperService` does the actual translation work (route paths, titles, query params) against `TranslateService`, with an in-memory `_translationCache` keyed by `lang:key` that's cleared whenever the language changes.
- `NgxTranslateRoutesStateService` abstracts where translated-path state lives: `TransferState` on the server (so it survives the SSR → browser handoff), then `localStorage` or cookies in the browser depending on `config.cacheMethod`.
- Config flows through the `NGX_TRANSLATE_ROUTES_CONFIG` injection token, merged with `DEFAULT_CONFIG` in `provideNgxTranslateRoutes()`. `enableSsrRouteTranslation` is rejected at runtime there (throws) since v3 — SSR support only comes from `provideNgxTranslateRoutesSsr()` in the secondary entry point, which forces that flag on. Don't reintroduce SSR config knobs into the root entry point.
- `NgxTranslateRoutesModule` is deprecated but kept working — it forwards to the same `NgxTranslateRoutesService.init()`. Don't add anything to it that only the SSR path needs.

## Testing

- Tests run on Vitest via `@angular/build:unit-test`, not Karma — `pnpm test:prod` runs the library's suite (`projects/ngx-translate-routes`, including `ssr/**/*.spec.ts`) with coverage.
- `pnpm lint` lints the library; `pnpm lint:showcases` lints both demo apps separately.

## Conventions

- Conventional Commits, enforced by commitlint; `semantic-release` derives the version and changelog from them. Never hand-edit `CHANGELOG.md`, the library's `version`, or the compatibility table in `README.md`.
- `docs/` is a fully independent Docusaurus project (own `package.json`, own lockfile) — not part of the root pnpm workspace.
