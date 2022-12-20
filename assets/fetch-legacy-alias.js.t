/*
 * For backwards compatibility, we need to still support consumers importing from the `fetch` path.
 * In the future, we should release a breaking change which removes this alias and requires consumers
 * to import from `ember-fetch`. This will ensure there is no confusion around folks thinking they are
 * importing from the actual `fetch` package.
 */
define('fetch', ['exports', 'ember-fetch'], function(exports, emberFetch) {
  const exportKeys = Object.keys(emberFetch);
  for (let i = 0; i < exportKeys.length; i++) {
    const key = exportKeys[i];
    exports[key] = emberFetch[key];
  }
});