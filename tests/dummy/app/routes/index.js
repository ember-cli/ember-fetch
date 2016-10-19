import Ember from 'ember';
import fetch from 'fetch';
import ajax from 'ember-fetch/ajax';

export default Ember.Route.extend({
  model: function() {
    return Ember.RSVP.hash({
      fetch: fetch('/omg.json').then(function(request) {
        return request.json();
      }),
      ajax: ajax('/omg.json')
    });
  }
});
