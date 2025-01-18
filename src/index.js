import { waitForPromise } from '@ember/test-waiters';

export async function wrappedFetch(...args) {
    let responsePromise = fetch(...args);

    waitForPromise(responsePromise);

    let response = await responsePromise;

    return new Proxy(response, {
        get(target, prop, receiver) {
            let original = Reflect.get(target, prop, receiver);

            if (['json', 'text', 'arrayBuffer', 'blob', 'formData'].includes(prop)) {
                return (...args) => {
                    let parsePromise = original(...args);

                    return waitForPromise(parsePromise);
                }
            }

            return original;
        }
    });
}

export default wrappedFetch;
