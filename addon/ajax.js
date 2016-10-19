import fetch from 'fetch';

export default function ajax(...args) {
  return fetch(...args).then(response => {
    if (response.ok) {
      return response.json();
    }

    throw response;
  });
}
