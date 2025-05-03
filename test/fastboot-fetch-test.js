'use strict';
const request = require('request');
const get = require('rsvp').denodeify(request);
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-fs'));

const AddonTestApp = require('ember-cli-addon-tests').AddonTestApp;

describe('renders in fastboot build', function () {
  this.timeout(300000);

  let app;

  beforeEach(function () {
    app = new AddonTestApp();

    return app
      .create('dummy', {
        skipNpm: true,
        emberVersion: '^3.28.10',
        emberDataVersion: '^3.28.9',
      })
      .then((app) =>
        app.editPackageJSON((pkg) => {
          pkg.devDependencies['isbinaryfile'] = '5.0.0';
          pkg.devDependencies['ember-resolver'] = '^8.1.0';
          pkg.devDependencies['ember-cli-fastboot'] = '*';
          // ember-fetch-adapter@0.4.0 has ember-fetch as dependency, we want to test
          pkg.devDependencies['ember-fetch-adapter'] = '0.4.3';
          // These 2 are in ember-fetch's package.json, symlinking to dummy won't help resolve
          pkg.devDependencies['abortcontroller-polyfill'] = '*';
          pkg.devDependencies['node-fetch'] = '^2.6.7';
        })
      )
      .then(function () {
        return app.run('npm', 'install');
      })
      .then(function () {
        return app.startServer({
          command: 'serve',
        });
      })
      .catch((e) => {
        //eslint-disable-next-line no-console
        console.error(e);
      });
  });

  afterEach(function () {
    return app.stopServer();
  });

  it('fetches in fastboot mode', function () {
    return get({
      url: 'http://localhost:49741/',
      headers: {
        Accept: 'text/html',
      },
    }).then(function (response) {
      expect(response.body).to.contain('Hello World! fetch');
      expect(response.body).to.contain('Hello World! fetch (Request)');
    });
  });
});
