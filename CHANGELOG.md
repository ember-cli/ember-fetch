# Changelog

## v6.7.2 (2019-11-03)

#### :bug: Bug Fix
* [#372](https://github.com/ember-cli/ember-fetch/pull/372) fix: throwing w/ fresh ember-cli-fastboot serve ([@xg-wang](https://github.com/x
g-wang))

#### Committers: 1
- Thomas Wang ([@xg-wang](https://github.com/xg-wang))

## v6.7.1 (2019-09-12)

#### :bug: Bug Fix
* [#358](https://github.com/ember-cli/ember-fetch/pull/358) Enable absolute url transform for Request in FastBoot ([@xg-wang](https://github.com/xg-wang))

#### Committers: 2
- Jan Bobisud ([@bobisjan](https://github.com/bobisjan))
- Thomas Wang ([@xg-wang](https://github.com/xg-wang))

## v6.7.0 (2019-07-08)

#### :rocket: Enhancement

- [#303](https://github.com/ember-cli/ember-fetch/pull/303) Add fetch response and error utils ([@BarryThePenguin](https://github.com/BarryThePenguin))

#### Committers: 3

- Jonathan Haines ([@BarryThePenguin](https://github.com/BarryThePenguin))
- Thomas Wang ([@xg-wang](https://github.com/xg-wang))
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)

## v6.6.0 (2019-06-28)

#### :memo: Documentation

- [#308](https://github.com/ember-cli/ember-fetch/pull/308) Deprecate ember-data adapter mixin ([@xg-wang](https://github.com/xg-wang))

#### Committers: 2

- Thomas Wang ([@xg-wang](https://github.com/xg-wang))
- [@dependabot-preview[bot]](https://github.com/apps/dependabot-preview)

## v6.5.1 (2019-04-18)

#### :bug: Bug Fix

- [#279](https://github.com/ember-cli/ember-fetch/pull/279) Update cacheKeyForTree to cache the treeForVendor ([@2hu12](https://github.com/2hu12))

#### Committers: 1

- 2hu ([@2hu12](https://github.com/2hu12))

## v6.5.0 (2019-03-11)

#### :rocket: Enhancement

- [#136](https://github.com/ember-cli/ember-fetch/pull/136) TypeScript support ([@xg-wang](https://github.com/xg-wang))

#### Committers: 1

- Thomas Wang ([@xg-wang](https://github.com/xg-wang))

## v6.4.0 (2018-12-19)

#### :rocket: Enhancement

- [#173](https://github.com/ember-cli/ember-fetch/pull/173) Do not include polyfill if browser targets don't need it ([@mydea](https://github.com/mydea))

#### Committers: 1

- Francesco Novy ([@mydea](https://github.com/mydea))

## v6.3.1 (2018-12-13)

#### :rocket: Enhancement

- [#186](https://github.com/ember-cli/ember-fetch/pull/186) handle stringifying data that was created with Object.create(null) ([@meirish](https://github.com/meirish))

#### Committers: 1

- Matthew Irish ([@meirish](https://github.com/meirish))

## v6.3.0 (2018-12-07)

- Support POST body of all valid types
- Only set default Content-Type header in adapter mixin

## v6.2.3 (2018-12-07)

#### :bug: Bug Fix

- [#167](https://github.com/ember-cli/ember-fetch/pull/167) Fix fetch public/fastboot-fetch.js module definition for Fastboot ([@xg-wang](https://github.com/xg-wang))

#### :house: Internal

- [#171](https://github.com/ember-cli/ember-fetch/pull/171) Setup addon tests ([@xg-wang](https://github.com/xg-wang))
- [#183](https://github.com/ember-cli/ember-fetch/pull/183) Remove mistakenly committed release tarball ([@Turbo87](https://github.com/Turbo87))
- [#182](https://github.com/ember-cli/ember-fetch/pull/182) TravisCI: Remove deprecated `sudo: false` option ([@Turbo87](https://github.com/Turbo87))

#### Committers: 2

- Thomas Wang ([@xg-wang](https://github.com/xg-wang))
- Tobias Bieniek ([@Turbo87](https://github.com/Turbo87))

## v6.2.2 (2018-11-28)

#### :bug: Bug Fix

- [#172](https://github.com/ember-cli/ember-fetch/pull/172) Make configuration work in engines ([@mydea](https://github.com/mydea))

#### Committers: 1

- Francesco Novy ([@mydea](https://github.com/mydea))

## v6.2.1 (2018-11-27)

#### :rocket: Bug Fix

- [#137](https://github.com/ember-cli/ember-fetch/pull/137) Use package name of AbortController polyfill in whitelisted dependencies ([@bobisjan](https://github.com/bobisjan))

#### Committers: 1

- Jan Bobisud ([@bobisjan](https://github.com/bobisjan))

## v6.2.0 (2018-11-16)

#### :rocket: Enhancement

- [#143](https://github.com/ember-cli/ember-fetch/pull/143) Enable Fastboot relative URL ([@xg-wang](https://github.com/xg-wang))

#### Committers: 1

- Thomas Wang ([@xg-wang](https://github.com/xg-wang))

## v6.1.1 (2018-11-16)

#### :bug: Bug Fix

- [#165](https://github.com/ember-cli/ember-fetch/pull/165) Use `ember-cli-babel` to transpile vendor tree ([@Turbo87](https://github.com/Turbo87))

#### :house: Internal

- [#164](https://github.com/ember-cli/ember-fetch/pull/164) Improve ESLint setup ([@Turbo87](https://github.com/Turbo87))
- [#162](https://github.com/ember-cli/ember-fetch/pull/162) refactor(test/prefer-native): use co instead of async fn & run in CI ([@buschtoens](https://github.com/buschtoens))

#### Committers: 2

- Jan Buschtöns ([@buschtoens](https://github.com/buschtoens))
- Tobias Bieniek ([@Turbo87](https://github.com/Turbo87))

## v6.1.0 (2018-11-02)

- Export mixin helper functions separately
- Fix typo/bug in parseFetchResponseForError
- If POST body is a string, don't stringify it

## v6.0.0 (2018-10-30)

- Set body to undefined for 204/205/HEAD responses
- Deprecate Logger and remove Ember.merge
- Move serializeQueryParams to its own file so that consuming applications and addons can import it directly

## v5.1.3 (2018-08-25)

- Add babel-core 6 to dependency to avoid babel-core 5 being resolved

## v5.1.2 (2018-08-23)

- Rollup `abortcontroller` and `fetch` as iife.

## v5.1.1 (2018-07-20)

- added supports latest Pretender!
- added support for opt-in native fetch (see readme for details)
- added support for AbortController (see readme for details)

## v5.0.0 (2018-06-05)

- Drop Node 4, 5, 7, and 9 support.
- Update dependencies to prevent warnings RE: legacy broccoli APIs.

## v4.0.2 (2018-05-23)

- Use `yetch` and add support for `AbortController`.

## v3.4.4 (2017-12-20)

- Ensure `fetch` can be used with `ArrayBuffer`s.
- Switch typings to newer style.

## v3.4.3 (2017-10-16)

- Fix non GET/HEAD requests not having body set

## v3.4.2 (2017-10-16)

- Remove `app` tree re-export of `ember-fetch/mixins/ember-fetch.js`
- Drop requirement of host apps having ember-cli-shims
- Upgrade ember-cli and other dependencies

## v3.4.1 (2017-10-13)

- Restore POST body being stringified
- fix 'serializeQueryParams' typo
- add more badges
- add chrome and firefox to travis
- fix tests by using yarn in ember-try

## v3.4.0 (2017-09-15)

- Override Ember Data's RESTAdapter#ajaxOptions
- Add `globals` to eslint config
- Add CHANGELOG through 3.0.1
- fix minor typo around DS

## v3.3.1 (2017-08-23)

- Don't process empty options.data, don't filter out 'null' query param values
- Bump Ember-CLI, ember-cli-babel

## v3.3.0 (2017-08-16)

- Make dealing with response body more robust, bring ajaxError and ajaxSuccess methods more inline with standard ember data methods

## v3.2.9 (2017-07-14)

- fix: use this for import if this.import present
- fix: remove include options
- fix: support nested addons/engines

## v3.2.8 (2017-07-10)

- Stringify data for a POST request

## v3.2.7 (2017-07-02)

- Filter out query params with undefined values, as \$.ajax does

## v3.2.4 - v3.2.6 (2017-07-29)

- Mimic \$.ajax behavior, improve robustness
- another stefanpenner remnant
- update travis location

## v3.2.3 (2017-07-25)

- update repo link

## v3.2.2 (2017-07-24)

- [FIXES #35] ensure rejections remain rejections in tests
- Rejections must be forwarded
- Fix logic to automatically add a Content-Type header

## v3.1.0 (2017-07-21)

- Add hook into fetch behavior

## v3.0.2 (2017-07-19)

- Better handle empty body responses

## v3.0.1 (2017-07-19)

- Make sure Content-Length is greater than zero
- Use Number over parseInt, return promise over done
- Add bodyPromise helper function and test
- Empty response should yield Promise not empty object

## v3.0.1 (2017-07-19)

- remove redundant try/catch
- tidy-up
- Support Ember.merge
- Handle empty response
- Cleanup jquery query param serialization
- [TYPESCRIPT]: added early index.d.ts for type defs
- Respect adapter headers if present
- Add adapter mixin which enables Ember Data to use fetch instead of jQuery.ajax
