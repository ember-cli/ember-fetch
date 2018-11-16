import setupFetch from 'fetch/setup';

/**
 * To allow relative URLs for Fastboot mode, we need the per request information
 * from the fastboot service. Then we re-define the `fetch` amd module.
 */
function patchFetchForRelativeURLs(instance) {
  const fastboot = instance.lookup('service:fastboot');
  const request = fastboot.get('request');
  // Prember is not sending protocol
  const protocol = request.protocol === 'undefined:' ? 'http:' : request.protocol;
  // host is cp
  setupFetch(protocol, request.get('host'))();
}

export default {
  name: 'fetch',
  initialize: patchFetchForRelativeURLs
};
