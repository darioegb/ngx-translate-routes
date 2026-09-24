# Contributing

## Setup

```bash
nvm use          # Node version pinned in .nvmrc
pnpm install      # frozen lockfile is enforced in CI
pnpm start        # serves the ngx-translate-routes-showcase demo app
```

## Making changes

- Library source lives in `projects/ngx-translate-routes/`; the SSR-only helpers are a separate secondary entry point at `projects/ngx-translate-routes/ssr/` (`ngx-translate-routes/ssr`). Two demo apps exercise it: `projects/ngx-translate-routes-showcase/` (client-side, `pnpm start`) and `projects/ngx-translate-routes-ssr-showcase/` (`pnpm start:ssr`).
- Run `pnpm test:prod` before pushing — it runs the library's Vitest suite with coverage.
- Run `pnpm lint` (library) and `pnpm lint:showcases` (both demo apps), and `pnpm format` (or let `lint-staged` do it on commit).
- Documentation site source lives in `docs/` and is a fully independent pnpm project (its own lockfile). `pnpm docs:start` runs it locally.

## Commits

Commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/) — this is enforced by commitlint on every commit (`.husky/commit-msg`) and drives `semantic-release`'s version bump:

- `fix:` → patch
- `feat:` → minor
- `feat!:` / a `BREAKING CHANGE:` footer → major

Don't hand-edit `CHANGELOG.md`, the library's `version` field, or the compatibility table in `README.md` — `semantic-release` and its `scripts/*.mjs` hooks generate all of that from your commit messages.

## Branches

`main` is the only long-lived branch — it's the released, stable line (`latest` on npm) and where `semantic-release` publishes from. Open PRs against it directly.

## Pull requests

CI (`test_lint`, `test_vitest`, SonarCloud) must pass. Please don't use `--no-verify` to skip local hooks — if a hook is genuinely wrong, fix the hook instead.
