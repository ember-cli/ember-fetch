'use strict';
const request = require('request');
const get = require('rsvp').denodeify(request);
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-fs'));

const AddonTestApp = require('ember-cli-addon-tests').AddonTestApp;

describe('renders in fastboot build without calling fetch', function () {
  this.timeout(300000);

  let app;

  beforeEach(function () {
    app = new AddonTestApp();

    return app
      .create('fresh', { skipNpm: true, noFixtures: true })
      .then((app) =>
        app.editPackageJSON((pkg) => {
          pkg.devDependencies['ember-cli-fastboot'] = '*';
          // ember-fetch-adapter@0.4.0 has ember-fetch as dependency, we want to test
          pkg.devDependencies['ember-fetch-adapter'] = '0.4.0';
          // These 2 are in ember-fetch's package.json, symlinking to dummy won't help resolve
          pkg.devDependencies['abortcontroller-polyfill'] = '*';
          pkg.devDependencies['node-fetch'] = '*';
        })
      )
      .then(function () {
        return app.run('npm', 'install');
      })
      .then(function () {
        return app.startServer({
          command: 'serve',
        });
      });
  });

  afterEach(function () {
    return app.stopServer();
  });

  it('builds into dist/ember-fetch/fetch-fastboot.js ignoring sub dependency version conflict', function () {
    expect(app.filePath('dist/index.html')).to.be.a.file();
    expect(app.filePath('dist/ember-fetch/fetch-fastboot.js')).to.be.a.file();
    expect(app.filePath('dist/assets/fresh-fastboot.js')).to.be.a.file();
  });

  it('fresh serve works', function () {
    return get({
      url: 'http://localhost:49741/',
      headers: {
        Accept: 'text/html',
      },
    }).then(function (response) {
      expect(response.body).to.contain('Congratulations, you made it!');
    });
  });
});
