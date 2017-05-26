import Ember from 'ember';
import fetch from 'fetch';

export default Ember.Controller.extend({
  actions: {
    fetchSlowData() {
      fetch('/slow-data.json').then((r) => r.json()).then((data) => this.set('fetchedSlowData', data));
    }
  }
});
