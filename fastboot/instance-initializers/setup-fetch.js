import { setupFastboot } from 'fetch';

/**
 * To allow relative URLs for Fastboot mode, we need the per request information
 * from the fastboot service. Then we set the protocol and host to fetch module.
 */
function patchFetchForRelativeURLs(instance) {
  const fastboot = instance.lookup('service:fastboot');
  const request = fastboot.get('request');
  // Prember is not sending protocol
  const protocol = request.protocol === 'undefined:' ? 'http:' : request.protocol;
  try {
    // host is cp
    setupFastboot(protocol, request.get('host'));
  } catch (_e) {
    // Do not throw error until request with a relative url.
  }
}

export default {
  name: 'fetch',
  initialize: patchFetchForRelativeURLs
};
