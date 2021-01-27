const fetcher = (url) => fetch(url).then((response) => response.json());

export { fetcher };
