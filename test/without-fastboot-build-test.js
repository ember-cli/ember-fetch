'use strict';
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-fs'));

const AddonTestApp = require('ember-cli-addon-tests').AddonTestApp;

describe('it builds without ember-cli-fastboot', function() {
  this.timeout(300000);

  let app;

  beforeEach(function() {
    app = new AddonTestApp();

    return app
      .create('dummy', { skipNpm: true })
      .then(app =>
        app.editPackageJSON(pkg => {
          delete pkg.devDependencies['ember-cli-fastboot'];
        })
      )
      .then(() => app.run('npm', 'install'));
  });

  it('builds no exist dist/ember-fetch/fetch-fastboot.js', function() {
    return app.runEmberCommand('build').then(function() {
      expect(app.filePath('dist/index.html')).to.be.a.file();
      expect(app.filePath('dist/ember-fetch')).to.not.be.a.path();
    });
  });

  it('build with process.env.FASTBOOT_DISABLED', function() {
    process.env.FASTBOOT_DISABLED = 'true';
    return app.runEmberCommand('build').then(function() {
        expect(app.filePath('dist/index.html')).to.be.a.file();
        expect(app.filePath('dist/ember-fetch')).to.not.be.a.path();
    }).finally(function() {
      delete process.env.FASTBOOT_DISABLED;
    });
  });
});
