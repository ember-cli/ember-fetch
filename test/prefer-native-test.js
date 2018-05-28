'use strict';

const AddonFactory = require('../');
const expect = require('chai').expect;
const helpers = require('broccoli-test-helper');
const path = require('path');
const templatePath = path.resolve(__dirname + '/assets/browser-fetch.js.t');

describe('Build browser assets', function() {
  let output, subject, addon;
  beforeEach(async function() {
    addon = Object.create(AddonFactory);
    Object.assign(addon, {
      buildConfig: {
        preferNative: true
      }
    });
    subject = addon.treeForVendor.call(addon);
    output = helpers.createBuilder(subject);
  });
  afterEach(async function() {
    await output.dispose();
  });

  it('preferNative is built into vendor file', async function() {
    await output.build();
    let files = output.read();
    expect(files).to.have.all.keys('ember-fetch.js', 'ember-fetch.map');
    expect(files['ember-fetch.js']).to.include('var preferNative = true');
  });
});
