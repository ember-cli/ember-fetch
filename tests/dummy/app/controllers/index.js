import Controller from '@ember/controller';
import { run } from '@ember/runloop';
import fetch from 'fetch';

export default Controller.extend({
  actions: {
    fetchSlowData() {
      fetch('/slow-data.json')
        .then(
          (r) => r.json(),
          (e) => {
            run(() => this.set('fetchedSlowDataFailed', true));
            throw e;
          }
        )
        .then((data) => {
          run(() =>
            this.setProperties({
              fetchedSlowData: data,
              fetchedSlowDataFailed: false,
            })
          );
        });
    },

    badFetch() {
      fetch('http://localhost:9999') // probably there is nothing listening here :D
        .then(
          (r) => r.json(),
          () => run(() => this.set('fetchFailed', true))
        );
    },
  },
});
