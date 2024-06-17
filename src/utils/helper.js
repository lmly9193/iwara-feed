export function tap(value, callback) {
    callback(value);
    return value;
}

export function match(value, expressions) {
    if (typeof expressions !== 'object') {
        throw new Error('Expressions should be an object');
    }

    if (value in expressions) {
        return expressions[value];
    }

    if ('default' in expressions) {
        return expressions['default'];
    }

    throw new Error('No match found and no default provided');
}

export async function get(target, params = {}) {
    const url = new URL(target);

    for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, value);
    }

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Fetch failed. ${response.status} ${response.statusText}`);
    }

    const isJson = response.headers.get('content-type')?.includes('application/json');

    return isJson ? await response.json() : await response.text();
}
