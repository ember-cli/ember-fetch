'use strict';

const AddonFactory = require('../');
const CoreObject = require('core-object');
const expect = require('chai').expect;

const EmberFetchAddon = CoreObject.extend(AddonFactory);
const ParentAddonName = 'some-addon';

describe('Break the build if ember-fetch is a nested dependency', function() {
  let addon;

  beforeEach(function() {
    addon = new EmberFetchAddon();
    const parent = new CoreObject({
      name: ParentAddonName,
      parent: {}
    });
    Object.assign(addon, { parent });
  });

  it('Throws a silent error that includes parent addon name', function() {
    expect(() => addon.included()).to.throw(`ember-fetch is found to be dependency of "some-addon"`);
  });
});
