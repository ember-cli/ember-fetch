
import fetch from 'fetch';

export default function ajax(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  return fetch(input, init).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw response;
  })
}