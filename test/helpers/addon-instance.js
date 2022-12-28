const root = require('path').resolve(__dirname, '../../');
const AddonFactory = require(root);

const ui = {
  writeWarnLine() { },
  writeDeprecateLine() { },
};

function makeProject({ browsers, ...rest }) {
  return {
    root,
    targets: { browsers },
    ...rest
  };
}
exports.makeProject = makeProject;

function makeApp({
  // For convenience
  browsers,
  project = makeProject({ browsers }),

  // Optional overrides to be applied at last
  overrides,

  // 'ember-fetch' config
  ...emberFetchConfig
}) {
  return {
    project,
    options: {
      'ember-fetch': emberFetchConfig
    },
    ...overrides
  };
}
exports.makeApp = makeApp;

function makeAddon({
  /**
   * The host app instance. Only present on addons that are a direct dependency
   * of the host app itself.
   * {@link https://github.com/ember-cli/ember-cli/blob/v3.27.0/lib/models/addon.js#L188-L199}
   */
  app = undefined,

  /**
   * If the addon is a direct dependency of an app, then `parent` is the
   * corresponding project instance.
   * If it's a dependency of another addon, then `parent` is that addon instance.
   * {@link https://github.com/ember-cli/ember-cli/blob/v3.27.0/lib/models/addon.js#L210-L221}
   */
  parent = app && app.project,

  /**
   * {@link https://github.com/ember-cli/ember-cli/blob/v3.27.0/lib/models/addon.js#L201-L208}
   */
  project = parent.project,

  ...overrides
}) {
  const addon = Object.assign(Object.create(AddonFactory), {
    ui,
    project,
    parent,
    app,
    addons: [],
    ...overrides
  });

  addon._normalizeBuildConfig();

  return addon;
}
exports.makeAddon = makeAddon;

function makeRootAddon({
  // For convenience
  browsers,
  project,

  app,

  // Optional overrides to be applied at last
  overrides,

  // 'ember-fetch' config
  ...emberFetchConfig
}) {
  if (!app) {
    app = makeApp({
      project: project || makeProject({ browsers }),
      ...emberFetchConfig
    });
  }

  return makeAddon({
    app,
    project: app.project,
    parent: app.project,
    ...overrides
  });
}
exports.makeRootAddon = makeRootAddon;

function makeNestedAddon({ parent, host, overrides }) {
  return makeAddon({
    app: undefined,
    parent,
    project: parent.project,
    _findHost: host ? () => host : undefined,
    ...overrides
  });
}
exports.makeNestedAddon = makeNestedAddon;
