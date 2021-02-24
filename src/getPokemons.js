// import Pokedex from 'pokedex-promise-v2'

// const P = new Pokedex();

// // var interval = {
// //     limit: 20,
// //     offset: 0
// // };
// export default P.getPokemonsList();

import axios from 'axios';
// import Pokemon from './pokemon';

var url = 'https://pokeapi.co/api/v2/pokemon/';

export default {
    getPokemonsList: (limit = 81, offset = 0) => axios.get(url, { params: { limit, offset } }),
    getPokemonData: (pokeUrl) => axios.get(pokeUrl),
};