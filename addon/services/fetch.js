import Ember from 'ember'
import {default as originalFetch} from 'fetch';

const {get} = Ember;

export default Ember.Service.extend({
  originalFetch,
  fetch(...args) {
    let options = args[1];

    const fetch = get(this, 'originalFetch');

    const headers = get(this, 'headers');
    if(Object.keys(headers).length) {
      options = options || {};
      options.headers = options.headers || {};
      Object.keys(headers).forEach(key => {
        options.headers[key] = headers[key];
      });
    }

    if(options) {
      args[1] = options;
    }

    return fetch(...args);
  },
  headers: {
  },
});
