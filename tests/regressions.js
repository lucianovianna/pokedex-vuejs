const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { transformSync } = require('@babel/core');
const { parseComponent } = require('vue-template-compiler');
const Vue = require('vue');

// Reuse the project's compiler and Babel to test modules and Options API components.
function loadModule(file, mocks) {
  const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  const script = file.endsWith('.vue') ? parseComponent(source).script.content : source;
  const { code } = transformSync(script, {
    babelrc: false,
    configFile: false,
    plugins: ['@babel/plugin-transform-modules-commonjs'],
  });
  const exports = {};
  vm.runInNewContext(code, {
    exports,
    require: name => ({ __esModule: true, default: mocks[name] }),
    console,
    URL,
  });
  return exports.default;
}

function createComponent(file, service, query = {}, propsData = {}) {
  const component = loadModule(file, { '@/services/PokemonsService.js': service });
  const route = Vue.observable({ name: 'Home', query });
  return new Vue({
    ...component,
    propsData,
    created: undefined,
    beforeCreate() {
      this.$route = route;
      this.$router = { replace: ({ query }) => {
        route.query = query;
        return Promise.resolve();
      } };
    },
  });
}

const tests = [];
const test = (name, run) => tests.push({ name, run });
const flush = () => new Promise(resolve => setImmediate(resolve));
const deferred = () => {
  let resolve;
  const promise = new Promise(done => { resolve = done; });
  return { promise, resolve };
};
const pokemon = id => ({
  id, name: `pokemon-${id}`, height: 7, weight: 69,
  species: { url: `species/${id}` },
  sprites: { front_default: null }, types: [], abilities: [], stats: [],
});
const list = (service, query) => createComponent('src/components/ListarPokemons.vue', service, query);
const detail = service => createComponent('src/views/Pokemon.vue', service);

test('list failure ends loading and a retry restores results', async () => {
  let fail = true;
  const view = list({
    getPokemonsList: async () => {
      if (fail) throw new Error('Offline');
      return { data: { results: [] } };
    },
  });
  await view.getPokemonsList();
  assert.equal(view.loading, false);
  assert.ok(view.error);
  fail = false;
  await view.getPokemonsList();
  assert.equal(view.error, '');
  view.$destroy();
});

test('failed detail requests never load evolutions and can be retried', async () => {
  let fail = true;
  let evolutionCalls = 0;
  const view = detail({
    getPokemonData: async () => {
      if (fail) throw new Error('Offline');
      return { data: pokemon(1) };
    },
    getDataByUrl: async () => {
      evolutionCalls++;
      return { data: { evolution_chain: null } };
    },
  });
  await view.getPokemonData('1');
  await flush();
  assert.equal(view.loading, false);
  assert.ok(view.error);
  assert.equal(view.pokeData, null);
  assert.equal(evolutionCalls, 0);
  fail = false;
  await view.getPokemonData('1');
  await flush();
  assert.equal(view.error, '');
  assert.equal(view.pokeData.id, 1);
  view.$destroy();
});

test('a late response cannot replace the current Pokemon', async () => {
  const first = deferred();
  const view = detail({
    getPokemonData: id => id === '1' ? first.promise : Promise.resolve({ data: pokemon(2) }),
    getDataByUrl: async () => ({ data: { evolution_chain: null } }),
  });
  const pending = view.getPokemonData('1');
  await view.getPokemonData('2');
  first.resolve({ data: pokemon(1) });
  await pending;
  await flush();
  assert.equal(view.pokeData.id, 2);
  assert.equal(view.loading, false);
  view.$destroy();
});

test('cards stop loading on failure and allow retry without duplicate requests', async () => {
  const pending = deferred();
  let calls = 0;
  let fail = true;
  const view = list({ getDataByUrl: async () => {
    calls++;
    await pending.promise;
    if (fail) throw new Error('Offline');
    return { data: pokemon(1) };
  } });
  const card = { url: 'pokemon/1', loading: false, error: false, dataLoaded: false };
  const request = view.loadPokemon(card);
  await view.loadPokemon(card);
  assert.equal(calls, 1);
  pending.resolve();
  await request;
  assert.equal(card.loading, false);
  assert.equal(card.error, true);
  fail = false;
  await view.loadPokemon(card);
  assert.equal(card.error, false);
  assert.equal(card.dataLoaded, true);
  assert.equal(card.image, null);
  view.$destroy();
});

test('sorting handles equal values without mutating the original list', () => {
  const view = list({});
  view.pokemonsList = [
    { id: 10, name: 'pikachu', dataLoaded: true },
    { id: 2, name: 'bulbasaur', dataLoaded: true },
    { id: 3, name: 'pikachu', dataLoaded: true },
  ];
  assert.equal(view.pokemonsOrdenados.map(p => p.id).join(','), '2,3,10');
  view.ordenacao = { campo: 'name', ordem: 'asc' };
  assert.equal(view.pokemonsOrdenados.map(p => p.id).join(','), '2,10,3');
  view.ordenacao = { campo: 'id', ordem: 'desc' };
  assert.equal(view.pokemonsOrdenados.map(p => p.id).join(','), '10,3,2');
  assert.equal(view.pokemonsList.map(p => p.id).join(','), '10,2,3');
  view.$destroy();
});

test('search is case insensitive, paginates results and resets the page', async () => {
  const view = list({});
  view.pokemonsList = [1, 2, 3].map(id => ({ id, name: `pokemon-${id}`, dataLoaded: true }));
  view.perPage = 1;
  view.currentPage = 2;
  assert.equal(view.pokemonsPorPagina[0].id, 2);
  view.busca = 'POKEMON-3';
  await Vue.nextTick();
  assert.equal(view.currentPage, 1);
  assert.equal(view.pokemonsPorPagina[0].id, 3);
  view.busca = 'missing';
  assert.equal(view.pokemonsFiltrados.length, 0);
  view.busca = '';
  await Vue.nextTick();
  view.currentPage = 2;
  view.ordenacao = { campo: 'id', ordem: 'desc' };
  await Vue.nextTick();
  assert.equal(view.currentPage, 1);
  assert.equal(view.pokemonsPorPagina[0].id, 3);
  view.$destroy();
});

test('IDs are extracted independently of the API host length', async () => {
  const view = list({ getPokemonsList: async () => ({ data: {
    results: [{ name: 'pikachu', url: 'https://example.org/pokemon/25/' }],
  } }) });
  view.setPokemonsData = () => {};
  await view.getPokemonsList();
  assert.equal(view.pokemonsList[0].id, 25);
  view.$destroy();
});

test('height uses centimeters and missing artwork falls back safely', () => {
  const view = detail({});
  view.pokeData = pokemon(1);
  assert.equal(view.heightInCentimeters, 70);
  assert.equal(view.getImage, '');
  view.pokeData.sprites.front_default = 'sprite.png';
  assert.equal(view.getImage, 'sprite.png');
  view.$destroy();
});

test('all evolution branches are loaded using the Pokemon species URL', async () => {
  const leaf = name => ({ species: { name }, evolves_to: [] });
  const chain = { ...leaf('root'), evolves_to: [leaf('branch-a'), leaf('branch-b')] };
  const urls = [];
  const view = detail({
    getDataByUrl: async url => {
      urls.push(url);
      return { data: url === 'species/10001' ? { evolution_chain: { url: 'chain' } } : { chain } };
    },
    getPokemonData: async name => ({ data: { ...pokemon(name), name } }),
  });
  view.pokeData = pokemon(10001);
  await view.loadEvolutionChain();
  assert.equal(urls.join(','), 'species/10001,chain');
  assert.equal(view.evoChain.map(p => p.name).join(','), 'root,branch-a,branch-b');
  assert.equal(view.evolutionLoading, false);
  view.$destroy();
});

test('evolution failures preserve details and can be retried', async () => {
  let fail = true;
  const view = detail({ getDataByUrl: async () => {
    if (fail) throw new Error('Offline');
    return { data: { evolution_chain: null } };
  } });
  view.pokeData = pokemon(1);
  await view.loadEvolutionChain();
  assert.equal(view.pokeData.id, 1);
  assert.equal(view.evolutionLoading, false);
  assert.ok(view.evolutionError);
  fail = false;
  await view.loadEvolutionChain();
  assert.equal(view.evolutionError, '');
  view.$destroy();
});

test('late evolution responses cannot populate another Pokemon page', async () => {
  const pending = deferred();
  const view = detail({
    getPokemonData: async () => ({ data: pokemon(1) }),
    getDataByUrl: url => url === 'species/1'
      ? Promise.resolve({ data: { evolution_chain: { url: 'chain' } } })
      : pending.promise,
  });
  view.pokeData = pokemon(1);
  const request = view.loadEvolutionChain();
  await flush();
  view.requestId++;
  view.pokeData = pokemon(2);
  pending.resolve({ data: { chain: { species: { name: 'old' }, evolves_to: [] } } });
  await request;
  assert.equal(view.evoChain.length, 0);
  view.$destroy();
});

test('listing restores shareable search, sorting and page from the URL', async () => {
  const view = list({}, { q: 'POKEMON', sort: 'name-desc', page: '2' });
  view.pokemonsList = [1, 2, 3].map(id => ({ id, name: `pokemon-${id}`, dataLoaded: true }));
  view.perPage = 1;
  await Vue.nextTick();
  assert.equal(view.busca, 'POKEMON');
  assert.equal(view.ordenacao.campo, 'name');
  assert.equal(view.ordenacao.ordem, 'desc');
  assert.equal(view.currentPage, 2);
  assert.equal(view.pokemonsPorPagina[0].id, 2);
  view.busca = 'pokemon-1';
  assert.equal(view.$route.query.q, 'pokemon-1');
  assert.equal(view.currentPage, 1);
  view.$destroy();
});

test('invalid URL filters use safe defaults and pages stay within the results', () => {
  const view = list({}, { q: ['invalid'], sort: 'unknown', page: '-2' });
  assert.equal(view.busca, '');
  assert.equal(view.ordenacao.campo, 'id');
  assert.equal(view.ordenacao.ordem, 'asc');
  assert.equal(view.currentPage, 1);
  view.pokemonsList = [{ id: 1, name: 'bulbasaur', dataLoaded: true }];
  view.$route.query = { page: '9999' };
  assert.equal(view.currentPage, 1);
  view.$destroy();
});

test('API requests have a timeout and reuse concurrent, ID and name lookups', async () => {
  const pending = deferred();
  let calls = 0;
  let timeout;
  const service = loadModule('src/services/PokemonsService.js', { axios: {
    create: options => {
      timeout = options.timeout;
      return { get: () => { calls++; return pending.promise; } };
    },
  } });
  const first = service.getPokemonData(1);
  const second = service.getDataByUrl('https://pokeapi.co/api/v2/pokemon/1/');
  assert.ok(timeout > 0 && timeout <= 15000);
  assert.equal(calls, 1);
  pending.resolve({ data: { id: 1, name: 'bulbasaur' } });
  await Promise.all([first, second]);
  await service.getPokemonData('bulbasaur');
  await service.getPokemonData(1);
  assert.equal(calls, 1);
});

test('failed API requests are not cached and different list pages stay separate', async () => {
  let calls = 0;
  let fail = true;
  const service = loadModule('src/services/PokemonsService.js', { axios: {
    create: () => ({ get: async () => {
      calls++;
      if (fail) throw new Error('Timeout');
      return { data: { results: [] } };
    } }),
  } });
  await assert.rejects(service.getPokemonsList(15, 0), /Timeout/);
  fail = false;
  await service.getPokemonsList(15, 0);
  await service.getPokemonsList(15, 0);
  assert.equal(calls, 2);
  await service.getPokemonsList(15, 15);
  await service.getPokemonsList(30, 0);
  assert.equal(calls, 4);
});

test('attribute bars label stats by name, preserve zero and fit the largest value', () => {
  const view = createComponent('src/components/Chart.vue', {}, {}, { chartData: [
    { stat: { name: 'speed' }, base_stat: 0 },
    { stat: { name: 'hp' }, base_stat: 150 },
    { stat: { name: 'attack' }, base_stat: 60 },
  ] });
  assert.equal(view.stats.map(stat => stat.label).join(','), 'Velocidade,HP,Ataque');
  assert.equal(view.stats[0].value, 0);
  assert.ok(view.maxStat >= 150);
  view.$destroy();
});

(async () => {
  for (const { name, run } of tests) {
    try {
      await run();
      console.log(`PASS ${name}`);
    } catch (error) {
      process.exitCode = 1;
      console.error(`FAIL ${name}\n${error.stack}`);
    }
  }
})();
