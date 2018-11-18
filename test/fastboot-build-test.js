'use strict';
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-fs'));

const glob = require('glob');

const AddonTestApp = require('ember-cli-addon-tests').AddonTestApp;

describe('it builds with ember-cli-fastboot', function() {
  this.timeout(300000);

  let app;

  beforeEach(function() {
    app = new AddonTestApp();

    return app
      .create('dummy', { skipNpm: true })
      .then(app =>
        app.editPackageJSON(pkg => {
          pkg.devDependencies['ember-cli-fastboot'] = '*';
        })
      )
      .then(() => app.run('npm', 'install'));
  });

  it('builds into dist/ember-fetch/fetch-fastboot.js', function() {
    return app.runEmberCommand('build').then(function() {
      expect(app.filePath('dist/index.html')).to.be.a.file();
      expect(app.filePath('dist/ember-fetch/fetch-fastboot.js')).to.be.a.file();
      expect(app.filePath('dist/assets/dummy-fastboot.js')).to.be.a.file();
    });
  });

  it('produces a production build with --environment=production', function() {
    return app
      .runEmberCommand('build', '--environment=production')
      .then(function() {
        expect(app.filePath('dist/index.html')).to.be.a.file();
        expect(find('dist/ember-fetch/fetch-fastboot-*.js')).to.be.a.file();
        expect(find('dist/ember-fetch/fetch-fastboot-*.js')).to.match(
          /fetch-fastboot-\w{32}/,
          'file name should contain MD5 fingerprint'
        );

        expect(find('dist/assets/dummy-fastboot-*.js')).to.be.a.file();
        expect(find('dist/assets/dummy-fastboot-*.js')).to.match(
          /dummy-fastboot-\w{32}/,
          'file name should contain MD5 fingerprint'
        );
      });
  });

  function find(globPath) {
    globPath = app.filePath(globPath);
    let files = glob.sync(globPath);

    expect(files.length).to.equal(1, globPath);

    return files[0];
  }
});
