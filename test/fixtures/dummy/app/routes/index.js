import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import fetch, { Request } from 'fetch';
import ajax from 'ember-fetch/ajax';

export default Route.extend({
  model: function() {
    return hash({
      fetch: fetch('/omg.json').then(function(request) {
        return request.json();
      }),
      request: fetch(new Request('/omg.json')).then(function(request) {
        return request.json();
      }),
      ajax: ajax('/omg.json')
    });
  }
});
