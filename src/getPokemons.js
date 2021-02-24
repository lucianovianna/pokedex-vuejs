import axios from 'axios';
// import Pokemon from './pokemon';

var url = 'https://pokeapi.co/api/v2/pokemon/';

export default {
    getPokemonsList: (limit = 81, offset = 0) => axios.get(url, { params: { limit, offset } }),
    getPokemonData: (pokeUrl) => axios.get(pokeUrl),
};