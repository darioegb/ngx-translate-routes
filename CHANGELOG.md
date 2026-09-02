## 3.0.0 (2026-09-02)

* fix: consolidate SSR provider pattern — provideNgxTranslateRoutesSsr in shared config ([9b169bb](https://github.com/darioegb/ngx-translate-routes/commit/9b169bb))
* fix(ci): build package before semantic-release and fix docs actions ([23efaca](https://github.com/darioegb/ngx-translate-routes/commit/23efaca))
* fix(ssr-showcase): migrate to v3 SSR API ([d32727a](https://github.com/darioegb/ngx-translate-routes/commit/d32727a))
* feat!: v3.0.0 — Angular 22, provideAppInitializer, deprecate NgxTranslateRoutesModule ([05bb49f](https://github.com/darioegb/ngx-translate-routes/commit/05bb49f))
* Merge pull request #88 from darioegb/create-pull-request/patch ([cfce456](https://github.com/darioegb/ngx-translate-routes/commit/cfce456)), closes [#88](https://github.com/darioegb/ngx-translate-routes/issues/88)
* Merge pull request #89 from darioegb/feat/v3.0.0 ([3ec6f01](https://github.com/darioegb/ngx-translate-routes/commit/3ec6f01)), closes [#89](https://github.com/darioegb/ngx-translate-routes/issues/89)
* Merge pull request #90 from darioegb/develop ([74eaf7a](https://github.com/darioegb/ngx-translate-routes/commit/74eaf7a)), closes [#90](https://github.com/darioegb/ngx-translate-routes/issues/90)
* test: cover provideNgxTranslateRoutes and provideNgxTranslateRoutesSsr ([abedd62](https://github.com/darioegb/ngx-translate-routes/commit/abedd62))
* ci: migrate test:prod and CI job to Vitest, drop Karma/Puppeteer container ([3faa302](https://github.com/darioegb/ngx-translate-routes/commit/3faa302))
* ci: revert action SHA pinning back to version tags for now ([4b6f3c0](https://github.com/darioegb/ngx-translate-routes/commit/4b6f3c0))
* ci: wire semantic-release into the pipeline, pin pnpm via packageManager ([0d918d6](https://github.com/darioegb/ngx-translate-routes/commit/0d918d6))
* docs: add Docusaurus v2.4 snapshot and update current docs for v3 ([4ed0293](https://github.com/darioegb/ngx-translate-routes/commit/4ed0293))
* docs: fix EN SSR guide — provideNgxTranslateRoutesSsr goes in shared app.config.ts ([f350867](https://github.com/darioegb/ngx-translate-routes/commit/f350867))
* docs: fix footer copyright — author name and MIT license ([13c8a05](https://github.com/darioegb/ngx-translate-routes/commit/13c8a05))
* docs: fix provideNgxTranslateRoutesSsr placement — shared app.config.ts not server ([9f91880](https://github.com/darioegb/ngx-translate-routes/commit/9f91880))
* docs: point npm homepage and README to Docusaurus site ([93624e0](https://github.com/darioegb/ngx-translate-routes/commit/93624e0))
* docs(es): sync Spanish translations with v3 changes ([10bc338](https://github.com/darioegb/ngx-translate-routes/commit/10bc338))
* chore: migrate Karma/Jasmine to Vitest (Angular 22) ([01a9b51](https://github.com/darioegb/ngx-translate-routes/commit/01a9b51))
* chore: migrate showcase apps to new Angular application builder ([f554572](https://github.com/darioegb/ngx-translate-routes/commit/f554572))
* chore: revert premature v3.0.0 CHANGELOG entry ([50cd63f](https://github.com/darioegb/ngx-translate-routes/commit/50cd63f))
* chore: update changelog and README ([7fe4a35](https://github.com/darioegb/ngx-translate-routes/commit/7fe4a35))
* chore: upgrade Angular workspace 19 → 22 with CLI migrations ([20bb492](https://github.com/darioegb/ngx-translate-routes/commit/20bb492))
* build: replace hand-rolled release scripts with semantic-release ([b7dec39](https://github.com/darioegb/ngx-translate-routes/commit/b7dec39))
* feat: add ngx-translate-routes/ssr secondary entry point ([9e895be](https://github.com/darioegb/ngx-translate-routes/commit/9e895be))

### BREAKING CHANGE

* check now runs before the feat check, so major bumps
are actually reachable) - but it still only reads the single latest
commit subject for its regex fallback, not the full range since the
last tag, and the primary path relies on a human naming the git tag
correctly on the GitHub Release UI. semantic-release's commit-analyzer
(conventionalcommits preset) analyzes the entire commit range and
removes that manual step entirely, and doing version -> changelog ->
build -> publish -> tag in one job removes the update_version/deploy
self-approve-PR dance (and its --no-verify bot commits) by construction.

.releaserc.json pipeline: commit-analyzer -> release-notes-generator
-> changelog -> exec (writes the version into the library's *source*
package.json via scripts/set-lib-version.mjs, regenerates the README
compatibility table via the existing update-readme.mjs, then builds -
all before @semantic-release/npm ever sees dist/) -> npm
(pkgRoot: dist/ngx-translate-routes) -> git (commits CHANGELOG.md,
README.md and the source manifest back) -> github.

v3.0.0 has NOT shipped yet (no v3.0.0 tag on origin, last real
release is v2.4.0) and its CHANGELOG.md entry was hand-edited after
generation - verified @semantic-release/changelog's prepare step only
ever prepends new release notes above existing file content, it does
not regenerate the whole file the way auto-changelog did, so that
entry is safe. IMPORTANT: v3.0.0 itself must still be cut through the
existing manual process (or a last manual tag+publish) BEFORE this
pipeline's first automatic run, so semantic-release sees v3.0.0 as
already released and starts fresh from there - otherwise its first
run would try to auto-generate v3.0.0's notes itself, duplicating the
existing entry.

Also added packageManager/engines (Node >=22.22.3, matching
@angular/core@22's actual published engines field) and .nvmrc/.npmrc,
matching the same fields added to ngx-error-message. Deleted
scripts/update-package-version.mjs, scripts/update-changelog.mjs, and
the auto-changelog/semver devDependencies they pulled in; kept
scripts/update-readme.mjs since semantic-release has no equivalent
and it's now invoked from the exec plugin instead of a separate CI
job. Verified locally: `ng build ngx-translate-routes` still builds
both the primary and `ssr` secondary entry points, `ng lint` passes,
and --dry-run --no-ci loads the full plugin chain (25 hooks across 5
plugins) without error.

### Changelog

All notable changes to this project will be documented in this file. Dates are displayed in UTC.

Generated by [`auto-changelog`](https://github.com/CookPete/auto-changelog).

#### [v2.4.0](https://github.com/darioegb/ngx-translate-routes/compare/v2.3.5...v2.4.0)

> 18 August 2026

- Update changelog and README [`#84`](https://github.com/darioegb/ngx-translate-routes/pull/84)
- Update package version [`#83`](https://github.com/darioegb/ngx-translate-routes/pull/83)
- fix: scope lint to library project only, drop showcase linting from CI [`#79`](https://github.com/darioegb/ngx-translate-routes/pull/79)
- Update changelog and README [`#78`](https://github.com/darioegb/ngx-translate-routes/pull/78)
- Update package version [`#77`](https://github.com/darioegb/ngx-translate-routes/pull/77)
- feat: v2.4.0 — refactoring, tooling modernization and Docusaurus docs [`d722a8d`](https://github.com/darioegb/ngx-translate-routes/commit/d722a8dd029371a8e378ece8a51ba122bcb506f4)
- fix: correct library version to 2.4.0 and fix release version script [`479f845`](https://github.com/darioegb/ngx-translate-routes/commit/479f845d50bdd108516bc9f3da0916b49c737826)
- fix: resolve Sonar security issues and exclude docs from analysis [`47bcbec`](https://github.com/darioegb/ngx-translate-routes/commit/47bcbec1712658e6ebdf11d52240537494728466)

#### [v2.3.5](https://github.com/darioegb/ngx-translate-routes/compare/v2.3.4...v2.3.5)

> 11 August 2026

- fix: use PAT_TOKEN for synchronous PR merge in CI [`#74`](https://github.com/darioegb/ngx-translate-routes/pull/74)
- fix: @ngx-translate/core v18 compatibility & dashboard title fix [`#72`](https://github.com/darioegb/ngx-translate-routes/pull/72)
- fix: @ngx-translate/core v18 compatibility & dashboard title fix [`#71`](https://github.com/darioegb/ngx-translate-routes/pull/71)
- Update changelog and README [`#67`](https://github.com/darioegb/ngx-translate-routes/pull/67)
- Update package version [`#66`](https://github.com/darioegb/ngx-translate-routes/pull/66)
- chore: update changelog and README [`ebe21c8`](https://github.com/darioegb/ngx-translate-routes/commit/ebe21c810c340db4923936ec966afe89a5d25373)
- fix: use PAT_TOKEN and remove --auto for synchronous version bump merge [`349aa17`](https://github.com/darioegb/ngx-translate-routes/commit/349aa1746f066ed024295cd2a94d10225cfbc789)
- fix: use GITHUB_TOKEN for PR creation so PAT_TOKEN can approve as different user [`095cb1d`](https://github.com/darioegb/ngx-translate-routes/commit/095cb1d7e47c073f0116ebc7cc02deb128bc9acc)

#### [v2.3.4](https://github.com/darioegb/ngx-translate-routes/compare/v2.3.3...v2.3.4)

> 6 August 2026

- Update package version [`#65`](https://github.com/darioegb/ngx-translate-routes/pull/65)
- Update package version [`#64`](https://github.com/darioegb/ngx-translate-routes/pull/64)
- Update package version [`#63`](https://github.com/darioegb/ngx-translate-routes/pull/63)
- Update package version [`#61`](https://github.com/darioegb/ngx-translate-routes/pull/61)
- feat: improve SSR compatibility, fix CI pipeline and code quality [`a205596`](https://github.com/darioegb/ngx-translate-routes/commit/a2055966e8eae933a9d150d92964b4546138c275)
- fix: restore auto-approve step for bot-created PRs [`5589ea2`](https://github.com/darioegb/ngx-translate-routes/commit/5589ea2677f79e964ed898c403a41940aa814fb9)
- fix: bump peter-evans/create-pull-request to v8 [`9cfa036`](https://github.com/darioegb/ngx-translate-routes/commit/9cfa0365f8d3de4295f613a24606648f22d1017f)

#### [v2.3.3](https://github.com/darioegb/ngx-translate-routes/compare/v2.3.2...v2.3.3)

> 10 November 2025

- fix: revert nullish coalescing changes and fix SSR translations structure [`#47`](https://github.com/darioegb/ngx-translate-routes/pull/47)
- Release v3.0.0 - SSR improvements and performance optimizations [`#46`](https://github.com/darioegb/ngx-translate-routes/pull/46)
- Update changelog and README [`#44`](https://github.com/darioegb/ngx-translate-routes/pull/44)
- Update package version [`#43`](https://github.com/darioegb/ngx-translate-routes/pull/43)
- fix: improve SSR compatibility and optimize performance [`75c6067`](https://github.com/darioegb/ngx-translate-routes/commit/75c60675192cb15e4a9968957b5e0530eb3e3f5e)
- fix: resolve SonarCloud code quality issues [`ca2b6bd`](https://github.com/darioegb/ngx-translate-routes/commit/ca2b6bdb284cc351a0ff65ccb2c8017aabc7f7b7)
- fix: resolve final SonarCloud issues [`80565c1`](https://github.com/darioegb/ngx-translate-routes/commit/80565c1281febc99dc54f1a1f440f51e12b50d9b)

#### [v2.3.2](https://github.com/darioegb/ngx-translate-routes/compare/v2.3.1...v2.3.2)

> 21 April 2025

- fix: resolve problem when refresh browser show 404 page on existing route [`#42`](https://github.com/darioegb/ngx-translate-routes/pull/42)
- Update changelog and README [`#41`](https://github.com/darioegb/ngx-translate-routes/pull/41)
- Update package version [`#40`](https://github.com/darioegb/ngx-translate-routes/pull/40)
- chore: update changelog and README [`bc4f3fa`](https://github.com/darioegb/ngx-translate-routes/commit/bc4f3faf221fef8bd8ab3afa50dfbc9cb0921710)
- Update README.md [`73c16ca`](https://github.com/darioegb/ngx-translate-routes/commit/73c16caa04ea575fb560e4578a61d75773f4b96e)
- fix: add optional chaining to router.config in init method [`09c1e9e`](https://github.com/darioegb/ngx-translate-routes/commit/09c1e9e923dcaaaaf301588d4c605ff886fc6063)

#### [v2.3.1](https://github.com/darioegb/ngx-translate-routes/compare/v2.3.0...v2.3.1)

> 10 April 2025

- fix: resolve problem with provideAppInitializer [`#39`](https://github.com/darioegb/ngx-translate-routes/pull/39)
- Update changelog and README [`#38`](https://github.com/darioegb/ngx-translate-routes/pull/38)
- Update package version [`#37`](https://github.com/darioegb/ngx-translate-routes/pull/37)
- Update README.md [`c45e910`](https://github.com/darioegb/ngx-translate-routes/commit/c45e91018b140cd0698efb9d5e9fbcb5056b7d58)
- chore: update changelog and README [`fbacd21`](https://github.com/darioegb/ngx-translate-routes/commit/fbacd2198ada137a7bed177733e97a33c70f1d64)
- chore: update package version [`def8d83`](https://github.com/darioegb/ngx-translate-routes/commit/def8d8377480f8e208d33054efab2e9812cc3df1)

#### [v2.3.0](https://github.com/darioegb/ngx-translate-routes/compare/v2.2.1...v2.3.0)

> 7 April 2025

- feat: add language in path with optional default language [`#36`](https://github.com/darioegb/ngx-translate-routes/pull/36)
- Update changelog and README [`#35`](https://github.com/darioegb/ngx-translate-routes/pull/35)
- Update package version [`#34`](https://github.com/darioegb/ngx-translate-routes/pull/34)
- chore: update changelog and README [`21b6469`](https://github.com/darioegb/ngx-translate-routes/commit/21b64696eb8b8ca1b289d576f01fa1f4543158fa)
- chore: update package version [`50e3f8a`](https://github.com/darioegb/ngx-translate-routes/commit/50e3f8ae056853d57028ca79f82fc8db0b116842)

#### [v2.2.1](https://github.com/darioegb/ngx-translate-routes/compare/v2.2.0...v2.2.1)

> 6 March 2025

- Chore:  migrate to angular 19 & code optimization [`#33`](https://github.com/darioegb/ngx-translate-routes/pull/33)
- Update changelog and README [`#32`](https://github.com/darioegb/ngx-translate-routes/pull/32)
- Update package version [`#31`](https://github.com/darioegb/ngx-translate-routes/pull/31)
- chore: migrate to angular 18 [`cb87869`](https://github.com/darioegb/ngx-translate-routes/commit/cb8786951deefe8aec97ff7d04a9c22ccbb5aab5)
- chore: migrate to angular 19 [`e5fe26d`](https://github.com/darioegb/ngx-translate-routes/commit/e5fe26d9c4d018ef3d3aa6739bfc7e473d3a2729)
- chore: update @angular-eslint/schematics to 18 [`b2917ba`](https://github.com/darioegb/ngx-translate-routes/commit/b2917ba38dbbb50c353ccfb7fae43b41f94a91c8)

#### [v2.2.0](https://github.com/darioegb/ngx-translate-routes/compare/v2.1.3...v2.2.0)

> 3 March 2025

- feat: make configurable the cache method adding cookies [`#24`](https://github.com/darioegb/ngx-translate-routes/pull/24)
- Develop [`#23`](https://github.com/darioegb/ngx-translate-routes/pull/23)
- fix: prevent call locastorage on ssr [`#22`](https://github.com/darioegb/ngx-translate-routes/pull/22)
- fix: deploy task [`24101a3`](https://github.com/darioegb/ngx-translate-routes/commit/24101a3d2320bd21365e0e8561d4f00b2c280810)
- fix: write permissions bot [`ebfbcc4`](https://github.com/darioegb/ngx-translate-routes/commit/ebfbcc43c9260b9868553f26cca139286b61176f)
- fix: resolve sonar lint issues [`768fc81`](https://github.com/darioegb/ngx-translate-routes/commit/768fc8192fd1751b22c90d665f0f923234c58e91)

#### [v2.1.3](https://github.com/darioegb/ngx-translate-routes/compare/v2.1.2...v2.1.3)

> 17 July 2024

- fix: solve problem lost query params when refresh browser [`#21`](https://github.com/darioegb/ngx-translate-routes/pull/21)

#### [v2.1.2](https://github.com/darioegb/ngx-translate-routes/compare/v2.1.1...v2.1.2)

> 21 June 2024

- chore: prevent translations from root route [`#18`](https://github.com/darioegb/ngx-translate-routes/pull/18)

#### [v2.1.1](https://github.com/darioegb/ngx-translate-routes/compare/v2.1.0...v2.1.1)

> 17 June 2024

- chore: update changelog [`#17`](https://github.com/darioegb/ngx-translate-routes/pull/17)
- fix: resolve translation issue when language change [`#16`](https://github.com/darioegb/ngx-translate-routes/pull/16)

#### [v2.1.0](https://github.com/darioegb/ngx-translate-routes/compare/v2.0.1...v2.1.0)

> 17 June 2024

- feat: add translation to routes with query params also fix issue with navigation [`#15`](https://github.com/darioegb/ngx-translate-routes/pull/15)

#### [v2.0.1](https://github.com/darioegb/ngx-translate-routes/compare/v2.0.0...v2.0.1)

> 10 June 2024

- Develop [`#13`](https://github.com/darioegb/ngx-translate-routes/pull/13)
- Update CHANGELOG [`#7`](https://github.com/darioegb/ngx-translate-routes/pull/7)
- chore: add commitlint, prettier, semantic-release and migrate npm to pnpm [`d7c95bb`](https://github.com/darioegb/ngx-translate-routes/commit/d7c95bbcf6042b24038a6c8a602a30b5335f5832)
- chore: applied solid pattern update showcase [`461aac2`](https://github.com/darioegb/ngx-translate-routes/commit/461aac261d3a35e698499c1abf880edd1851a9d5)
- chore: fix ci.yml to use pnpm [`9ea0f5d`](https://github.com/darioegb/ngx-translate-routes/commit/9ea0f5d79c46e33c9930392ade92f7108c181409)

### [v2.0.0](https://github.com/darioegb/ngx-translate-routes/compare/v1.3...v2.0.0)

> 23 May 2024

- fix: solve problem with package repository [`#6`](https://github.com/darioegb/ngx-translate-routes/pull/6)
- fix: solve problem with package repository and permissions for ci job [`#5`](https://github.com/darioegb/ngx-translate-routes/pull/5)
- Update ci.yml [`#4`](https://github.com/darioegb/ngx-translate-routes/pull/4)
- fix sonar project properties [`#3`](https://github.com/darioegb/ngx-translate-routes/pull/3)
- update sonar project properties [`#2`](https://github.com/darioegb/ngx-translate-routes/pull/2)
- Feat/angular migration [`#1`](https://github.com/darioegb/ngx-translate-routes/pull/1)
- Feat/migration [`#8`](https://github.com/darioegb/ngx-translate-routes/pull/8)
- migrate to angular 17 [`463683c`](https://github.com/darioegb/ngx-translate-routes/commit/463683c58c7374534d51337e742ab89fbd8e37a1)
- fix package deps and some error with route translation strategy [`b643bbc`](https://github.com/darioegb/ngx-translate-routes/commit/b643bbc3094a63f8c71c05986459731e01324e6d)
- migrate to angular 14 [`7666dfa`](https://github.com/darioegb/ngx-translate-routes/commit/7666dfa822b50a7c4c3fd5184967a54e8c097010)

#### [v1.3](https://github.com/darioegb/ngx-translate-routes/compare/v1.2...v1.3)

> 20 April 2021

- Develop [`#7`](https://github.com/darioegb/ngx-translate-routes/pull/7)
- Develop [`#6`](https://github.com/darioegb/ngx-translate-routes/pull/6)
- Develop [`#5`](https://github.com/darioegb/ngx-translate-routes/pull/5)
- update readme file [`02a4915`](https://github.com/darioegb/ngx-translate-routes/commit/02a49157c67e58074747fe8e20d1d518dac4bc66)

#### [v1.2](https://github.com/darioegb/ngx-translate-routes/compare/v1.1...v1.2)

> 22 March 2021

- optimice code [`3a55ac2`](https://github.com/darioegb/ngx-translate-routes/commit/3a55ac2c1085c7829eea05b595025705af3df52f)

#### v1.1

> 9 January 2021

- fix issues #1 and #2 [`#4`](https://github.com/darioegb/ngx-translate-routes/pull/4)
- Develop [`#3`](https://github.com/darioegb/ngx-translate-routes/pull/3)
- Develop [`#2`](https://github.com/darioegb/ngx-translate-routes/pull/2)
- Develop [`#1`](https://github.com/darioegb/ngx-translate-routes/pull/1)
- Merge branch '1-does-not-translate-route-on-browser-reload' into 'master' [`#2`](https://github.com/darioegb/ngx-translate-routes/issues/2)
- Initial commit [`2be7a1b`](https://github.com/darioegb/ngx-translate-routes/commit/2be7a1b0b55e5a1fe785d18c6a345b218ca8a5e6)
- remove unused console log [`d296e78`](https://github.com/darioegb/ngx-translate-routes/commit/d296e785b800e447cef3d4ef0a9672f8e56f4d1d)
- update package json [`5bbd79b`](https://github.com/darioegb/ngx-translate-routes/commit/5bbd79bca4725b91aeea71494376d28f77f216ea)
