import axios from 'axios';

const url = 'https://pokeapi.co/api/v2/pokemon/';
const urlSpecies = 'https://pokeapi.co/api/v2/pokemon-species/';

export default {
    getPokemonsList: (limit = 99999, offset = 0) => axios.get(url, { params: { limit, offset } }),
    getDataByUrl: async (customUrl) => axios.get(customUrl),
    getPokemonData: (pokeInfo) => axios.get(url + `${pokeInfo}`),
    getPokemonSpecies: (pokeId) => axios.get(urlSpecies + pokeId),
};