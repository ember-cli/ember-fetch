# Ember-fetch

https://github.com/github/fetch wrapped and bundled for ember-cli users

## Installation

* `ember install:addon ember-fetch`

## Usage

```js
import fetch from 'fetch';
import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return fetch('/my-cool-end-point.json').then(function(request) {
      return request.json();
    });
  }
});
```

further docs: https://github.com/github/fetch

### Browser Support

* evergreen / IE9+ / Safari 6.1+ https://github.com/github/fetch#browser-support

### why is this wrapper needed?

* original emits a global
* original requires a Promise polyfil (ember users have RSVP)
* original isn't Ember run-loop aware

### Won't this wrapper get out-of-sync?

* we actually don't bundle github/fetch rather we merely wrap/transform what
  comes from `node_modules`, so we should be resilient to changes assuming
  semver from the fetch module

