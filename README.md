# Ember-fetch
[![Build Status](https://travis-ci.org/stefanpenner/ember-fetch.svg?branch=master)](https://travis-ci.org/stefanpenner/ember-fetch)
[![Build status](https://ci.appveyor.com/api/projects/status/u7qcv4pgsvo60sxt?svg=true)](https://ci.appveyor.com/project/embercli/ember-fetch)

HTML5 [fetch](https://fetch.spec.whatwg.org) polyfill from [github](https://github.com/github/fetch) wrapped and bundled for ember-cli users

* [intro to fetch](http://updates.html5rocks.com/2015/03/introduction-to-fetch)
* [spec](https://fetch.spec.whatwg.org)
* [usage](https://github.com/github/fetch#usage)
* [origin repo](https://github.com/github/fetch)

## Installation

* `ember install ember-fetch`

## Usage

```js
import fetch from 'ember-fetch/ajax';
import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return fetch('/my-cool-end-point.json').then(function(response) {
      return response;
    });
  }
});
```

### Use with Ember Data
To have Ember Data utilize `fetch` instead of jQuery.ajax to make calls to your backend, extend your project's `application` adapter with the `adapter-fetch` mixin.

```js
// app/adapters/application.js
import DS from 'ember-data';
import AdapterFetch from 'ember-fetch/mixins/adapter-fetch';

export default RESTAdapter.extend(AdapterFetch, {
  ...
});
```

further docs: https://github.com/github/fetch

### Browser Support

* evergreen / IE10+ / Safari 6.1+ https://github.com/github/fetch#browser-support


### does this replace ic-ajax?

* ideally yes, but only if you cater to IE9+
* for basic drop-in compat `import ajax from 'ember-fetch/ajax'`

### What about all the run-loop and promise mixing details?

* taken care of for you

### why is this wrapper needed?

* original emits a global
* original requires a Promise polyfill (ember users have RSVP)
* original isn't Ember run-loop aware

### Won't this wrapper get out-of-sync?

* we actually don't bundle github/fetch rather we merely wrap/transform what
  comes from `node_modules`, so we should be resilient to changes assuming
  semver from the fetch module

