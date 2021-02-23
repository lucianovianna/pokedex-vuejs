// import Pokedex from 'pokedex-promise-v2'

// const P = new Pokedex();

// // var interval = {
// //     limit: 20,
// //     offset: 0
// // };
// export default P.getPokemonsList();

import axios from 'axios';

var url = 'https://pokeapi.co/api/v2/pokemon/';
var params = {
    limit: 30,
    offset: 0
};

export default {
    getPokemonsList: () => axios.get(url, { params }),
    getPokemonData: (pokeUrl) => axios.get(pokeUrl),
};