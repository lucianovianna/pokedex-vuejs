import axios from 'axios';

const baseUrl = 'https://pokeapi.co/api/v2/pokemon/';
const http = axios.create({ timeout: 10000 });
const cache = new Map();
const cacheLimit = 100;

function remember(key, response) {
  cache.set(key, response);
  if (cache.size > cacheLimit) cache.delete(cache.keys().next().value);
}

function get(url, params = {}) {
  const resource = new URL(url);
  Object.keys(params).forEach(key => resource.searchParams.set(key, params[key]));
  resource.searchParams.sort();
  const key = resource.href;
  if (cache.has(key)) return cache.get(key);

  const request = http.get(url, { params }).then(response => {
    // Reuse a Pokemon fetched by ID when its name is requested, and vice versa.
    if (/\/pokemon\/[^/]+\/$/.test(resource.pathname)) {
      remember(`${baseUrl}${response.data.id}/`, request);
      remember(`${baseUrl}${response.data.name}/`, request);
    }
    return response;
  }).catch(error => {
    cache.delete(key);
    throw error;
  });
  remember(key, request);
  return request;
}

export default {
  getPokemonsList: (limit = 99999, offset = 0) => get(baseUrl, { limit, offset }),
  getDataByUrl: url => get(url),
  getPokemonData: info => get(`${baseUrl}${info}/`),
};
