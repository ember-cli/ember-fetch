import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import fetch from 'fetch';

export default Route.extend({
  model: function () {
    return hash({
      fetch: fetch('/omg.json').then(function (request) {
        return request.json();
      }),
    });
  },
});
