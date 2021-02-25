import axios from 'axios';
// import Pokemon from './pokemon';

var url = 'https://pokeapi.co/api/v2/pokemon/';

export default {
    getPokemonsList: (limit = 10000, offset = 0) => axios.get(url, { params: { limit, offset } }),
    getPokemonDataByUrl: (pokeUrl) => axios.get(pokeUrl),
    getPokemonData: (pokeInfo) => axios.get(url + `${pokeInfo}`),
};