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

* `npm install ember-fetch`

ember-fetch requries ember-auto-import 2 or above.

## Usage

```js
import Route from '@ember/routing/route';
import fetch from 'ember-fetch';

export default class extends Route {
  model() {
    return fetch('/my-cool-end-point.json').then(function(response) {
      return response.json();
    });
  }
}
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

* browsers that support [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

