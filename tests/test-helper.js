import Application from 'dummy/app';
import config from 'dummy/config/environment';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start } from 'ember-qunit';
import { registerDeprecationHandler } from '@ember/debug';

setApplication(Application.create(config.APP));

registerDeprecationHandler((msg, options, next) => {
  if (options.id !== 'deprecate-fetch-ember-data-support') {
    next(msg, options);
  }
});

setup(QUnit.assert);

start();
