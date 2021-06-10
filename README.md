# ember-fetch
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

ember-fetch requries ember-cli 2.13 or above.

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

### Use with TypeScript
To use `ember-fetch` with TypeScript or enable editor's type support, You can add `"fetch": ["node_modules/ember-fetch"]` to your `tsconfig.json`.

```json
{
  "compilerOptions": {
    "paths": {
      "fetch": [
        "node_modules/ember-fetch"
      ]
    }
  }
}
```

### Use with Ember Data

ember-data@3.9.2 was released with built-in fetch support, if your ember-data is below 3.9.2, please checkout [ember-fetch v7.x](https://github.com/ember-cli/ember-fetch/tree/v7.x).

### Use with Fastboot
#### relative url
`ember-fetch` uses `node-fetch` in Fastboot, which [doesn't allow relative URL](https://github.com/bitinn/node-fetch/tree/v2.3.0#fetchurl-options).

> `url` should be an absolute url, such as `https://example.com/`.
> A path-relative URL (`/file/under/root`) or protocol-relative URL (`//can-be-http-or-https.com/`)
> will result in a rejected promise.

However, `ember-fetch` grabs the `protocol` and `host` info from fastboot request after the `instance-initializes`.
This allows you to make a relative URL request unless the app is not initialized, e.g. `initializers` and `app.js`.

#### top-level addon
For addon authors, if the addon supports Fastboot mode, `ember-fetch` should also be listed as a [peer dependency](https://docs.npmjs.com/files/package.json#peerdependencies).
This is because Fastboot only invokes top-level addon's `updateFastBootManifest` ([detail](https://github.com/ember-fastboot/ember-cli-fastboot/issues/597)), thus `ember-fetch` has to be a top-level addon installed by the host app.

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

If all your [browser targets](https://guides.emberjs.com/release/configuring-ember/build-targets/) support native `fetch`, and `preferNative: true`, the polyfill will not be included in the output build. If, for some reason, you still need the polyfill to be included in the bundle, you can set `alwaysIncludePolyfill: true`.

The way you do import remains same.

### Use native promise instead of RSVP

If you do not want to use RSVP, but native Promises, you can specify this build config flag:

```js
// ember-cli-build.js
let app = new EmberAddon(defaults, {
  // Add options here
  'ember-fetch': {
    nativePromise: true
  }
});
```

### Error Handling

A `fetch` response is successful if `response.ok` is true,
otherwise you can read the status code to determine the bad response type.
`fetch` will only reject with [network errors](https://fetch.spec.whatwg.org/#concept-network-error).

`ember-fetch` provides some utility functions:

  - `isBadRequestResponse` (400)
  - `isUnauthorizedResponse` (401)
  - `isForbiddenResponse` (403)
  - `isNotFoundResponse` (404)
  - `isConflictResponse` (409)
  - `isGoneResponse` (410)
  - `isInvalidResponse` (422)
  - `isServerErrorResponse` (5XX)
  - `isAbortError` [Aborted network error](https://fetch.spec.whatwg.org/#concept-aborted-network-error)


```js
import Route from '@ember/routing/route';
import fetch from 'fetch';
import {
  isAbortError,
  isServerErrorResponse,
  isUnauthorizedResponse
} from 'ember-fetch/errors';

export default Route.extend({
  model() {
    return fetch('/omg.json')
      .then(function(response) {
        if (response.ok) {
          return response.json();
        } else if (isUnauthorizedResponse(response)) {
          // handle 401 response
        } else if (isServerErrorResponse(response)) {
          // handle 5xx respones
        }
      })
      .catch(function(error) {
        if (isAbortError(error)) {
          // handle aborted network error
        }
        // handle network error
      });
  }
});
```

## Browser Support

* evergreen / IE10+ / Safari 6.1+ https://github.com/github/fetch#browser-support

## Q & A
### Does it work with pretender?

* Yes, [pretender v2.1](https://github.com/pretenderjs/pretender/tree/v2.1.0) comes with `fetch` support.

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
