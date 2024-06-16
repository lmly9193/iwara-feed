export async function getData(url) {
    const promise = await fetch(url);
    const response = await promise.json();
    return response;
};
