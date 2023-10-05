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

ember-fetch requries ember-cli 3.??? or above.

## Usage

Many Ember test suits depend on the `fetch` being wrapped by a `waitForPromise`. `ember-fetch` provides a setup method that you should call once during the start-up of your application:

```js
# app/app.js

import { setupFetchWaiter } from 'ember-fetch';

setupFetchWaiter();
```

Available imports:
```js
import { setupFetchWater, fetch } from 'ember-fetch';
```

The `fetch` export is purely for backwards compatibility and is a straight up re-export of the native fetch. 



### Error Handling

TODO: add these utils back in for backwards compatibility.
