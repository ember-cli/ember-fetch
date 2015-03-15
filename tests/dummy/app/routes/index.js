import Ember from 'ember';
import fetch from 'fetch';

export default Ember.Route.extend({
  model: function() {
    return fetch('/omg.json').then(function(request) {
      return request.json();
    });
  }
});
