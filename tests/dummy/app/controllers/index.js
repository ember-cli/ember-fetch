import Ember from 'ember';
import fetch from 'fetch';

export default Ember.Controller.extend({
  actions: {
    fetchSlowData() {
      fetch('/slow-data.json')
        .then((r) => r.json(), (e) => {
          this.set('fetchedSlowDataFailed', true);
          throw e;
        })
        .then((data) => this.setProperties({ fetchedSlowData: data, fetchedSlowDataFailed: false }));
    },

    badFetch() {
      fetch('http://localhost:9999') // probably there is nothing listening here :D
        .then((r) => r.json(), () => {
          this.set('fetchFailed', true);
        });
    }
  }
});
