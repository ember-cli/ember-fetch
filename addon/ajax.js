import fetch from 'fetch';
import serializeQueryParams from './utils/serialize-query-params';

export default function ajax(url, options = {}) {
  if (options.data) {
    // GET and HEAD requests can't have a `body`
    if ((!options.method || options.method === 'GET' || options.method === 'HEAD')) {
      if (Object.keys(options.data).length) {
        // Test if there are already query params in the url (mimics jQuey.ajax).
        const queryParamDelimiter = url.indexOf('?') > -1 ? '&' : '?';
        url += `${queryParamDelimiter}${serializeQueryParams(options.data)}`;
      }
    } else {
      options.body = options.data;
    }
  }

  return fetch(url, options).then(response => {
    if (response.ok) {
      return response.json();
    }

    throw response;
  });
}
