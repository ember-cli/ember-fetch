import Application from '../app';
import config from '../config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';
import { registerDeprecationHandler } from '@ember/debug';

setApplication(Application.create(config.APP));

registerDeprecationHandler((msg, options, next) => {
  if (options.id !== 'deprecate-fetch-ember-data-support') {
    next(msg, options);
  }
})

start();
