
3.4.3 / 2017-10-16
==================

  * Fix non GET/HEAD requests not having body set

3.4.2 / 2017-10-16
==================

  * Remove `app` tree re-export of `ember-fetch/mixins/ember-fetch.js`
  * Drop requirement of host apps having ember-cli-shims
  * Upgrade ember-cli and other dependencies

3.4.1 / 2017-10-13
==================

  * Restore POST body being stringified
  * fix 'serializeQueryParams' typo
  * add more badges
  * add chrome and firefox to travis
  * fix tests by using yarn in ember-try

3.4.0 / 2017-09-15
==================

  * Override Ember Data's RESTAdapter#ajaxOptions
  * Add `globals` to eslint config
  * Add CHANGELOG through 3.0.1
  * fix minor typo around DS

3.3.1 / 2017-08-23
==================

  * Don't process empty options.data, don't filter out 'null' query param values
  * Bump Ember-CLI, ember-cli-babel

3.3.0 / 2017-08-16
==================

  * Make dealing with response body more robust, bring ajaxError and ajaxSuccess methods more inline with standard ember data methods

3.2.9 / 2017-07-14
==================

  * fix: use this for import if this.import present
  * fix: remove include options
  * fix: support nested addons/engines

3.2.8 / 2017-07-10
==================

  * Stringify data for a POST request

3.2.7 / 2017-07-02
==================

  * Filter out query params with undefined values, as $.ajax does

3.2.6 - 3.2.4 / 2017-07-29
==========================
  * Mimic $.ajax behavior, improve robustness
  * another stefanpenner remnant
  * update travis location

3.2.3 / 2017-07-25
==================

  * update repo link

3.2.2 / 2017-07-24
==================

  * [FIXES #35] ensure rejections remain rejections in tests
  * Rejections must be forwarded
  * Fix logic to automatically add a Content-Type header

3.1.0 / 2017-07-21
==================

  * Add hook into fetch behavior

3.0.2 / 2017-07-19
==================

  * Better handle empty body responses

3.0.1 / 2017-07-19
==================

  * Make sure Content-Length is greater than zero
  * Use Number over parseInt, return promise over done
  * Add bodyPromise helper function and test
  * Empty response should yield Promise not empty object

3.0.1 / 2017-07-19
==================

  * remove redundant try/catch
  * tidy-up
  * Support Ember.merge
  * Handle empty response
  * Cleanup jquery query param serialization
  * [TYPESCRIPT]: added early index.d.ts for type defs
  * Respect adapter headers if present
  * Add adapter mixin which enables Ember Data to use fetch instead of jQuery.ajax
