import axios from 'axios';

const url = 'https://pokeapi.co/api/v2/pokemon/';
const urlEvoChain = 'https://pokeapi.co/api/v2/evolution-chain/';

export default {
    getPokemonsList: (limit = 666, offset = 0) => axios.get(url, { params: { limit, offset } }),
    getPokemonDataByUrl: async (pokeUrl) => axios.get(pokeUrl),
    getPokemonData: (pokeInfo) => axios.get(url + `${pokeInfo}`),
    getEvolutionChain: (id) => axios.get(urlEvoChain + `${id}`),
};