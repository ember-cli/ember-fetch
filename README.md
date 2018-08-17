# Ember-fetch
[![Build Status](https://travis-ci.org/ember-cli/ember-fetch.svg?branch=master)](https://travis-ci.org/ember-cli/ember-fetch)
[![Build status](https://ci.appveyor.com/api/projects/status/u7qcv4pgsvo60sxt?svg=true)](https://ci.appveyor.com/project/embercli/ember-fetch)
[![Ember Observer Score](https://emberobserver.com/badges/ember-fetch.svg)](https://emberobserver.com/addons/ember-fetch)
[![npm version](https://badge.fury.io/js/ember-fetch.svg)](https://badge.fury.io/js/ember-fetch)

HTML5 [fetch](https://fetch.spec.whatwg.org) polyfill from [github](https://github.com/github/fetch) wrapped and bundled for ember-cli users.

* [intro to fetch](https://developers.google.com/web/updates/2015/03/introduction-to-fetch)
* [spec](https://fetch.spec.whatwg.org)
* [usage](https://github.com/github/fetch#usage)
* [origin repo](https://github.com/github/fetch)

## Installation

* `ember install ember-fetch`

## Usage

```js
import Route from '@ember/routing/route';
import fetch from 'fetch';

export default Route.extend({
  model() {
    return fetch('/my-cool-end-point.json').then(function(response) {
      return response.json();
    });
  }
});
```

Available imports:
```js
import fetch, { Headers, Request, Response, AbortController } from 'fetch';
```

### Use with Ember Data
To have Ember Data utilize `fetch` instead of jQuery.ajax to make calls to your backend, extend your project's `application` adapter with the `adapter-fetch` mixin.

```js
// app/adapters/application.js
import DS from 'ember-data';
import AdapterFetch from 'ember-fetch/mixins/adapter-fetch';

export default DS.RESTAdapter.extend(AdapterFetch, {
  ...
});
```

### Use with Fastboot
Currently, Fastboot supplies its own server-side ajax functionality, and including `ember-fetch` and the `adapter-fetch` mixin in a Fastboot app will not work without some modifications. To allow the `node-fetch` polyfill that is included with this addon to make your API calls, you must add an initializer to the consuming app's `fastboot` directory that overrides the one Fastboot utilizes to inject its own ajax.

Example:
```js
// fastboot/initializers/ajax.js

export default {
  name: 'ajax-service',
  initialize() {
    // noop
    // This is to override Fastboot's initializer which prevents ember-fetch from working
    // https://github.com/ember-fastboot/ember-cli-fastboot/blob/master/fastboot/initializers/ajax.js
  }
}
```

For addon that supports Fastboot, `ember-fetch` should also be listed as a [peer dependency](https://docs.npmjs.com/files/package.json#peerdependencies). 
This is because Fastboot only invokes top-level addon's `updateFastBootManifest`, thus `ember-fetch` has to be a top-level addon installed by the host app.

### Allow native fetch
`ember-fetch` allows access to native fetch in browser through a build config flag:
```js
// ember-cli-build.js
let app = new EmberAddon(defaults, {
  // Add options here
  'ember-fetch': {
    preferNative: true
  }
});
```
If set to `true`, the fetch polyfill will be skipped if native `fetch` is available,
otherwise the polyfilled `fetch` will be installed during the first pass of the vendor js file.

If set to `false`, the polyfilled `fetch` will replace native `fetch` be there or not.

The way you do import remains same.

## Browser Support

* evergreen / IE10+ / Safari 6.1+ https://github.com/github/fetch#browser-support

## Q & A
### Does it work with pretender?
Yes, [pretender v2.1](https://github.com/pretenderjs/pretender/tree/v2.1.0) comes with `fetch` support.

### Does this replace ic-ajax?

* ideally yes, but only if you cater to IE9+
* for basic drop-in compat `import ajax from 'ember-fetch/ajax'`

### What about all the run-loop and promise mixing details?

* taken care of for you

### Why is this wrapper needed?

* original emits a global
* original requires a Promise polyfill (ember users have RSVP)
* original isn't Ember run-loop aware

### Won't this wrapper get out-of-sync?

* we actually don't bundle github/fetch rather we merely wrap/transform what
  comes from `node_modules`, so we should be resilient to changes assuming
  semver from the fetch module
