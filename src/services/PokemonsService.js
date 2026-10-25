import axios from 'axios';

const url = 'https://pokeapi.co/api/v2/pokemon/';

export default {
    getPokemonsList: (limit = 99999, offset = 0) => axios.get(url, { params: { limit, offset } }),
    getDataByUrl: (customUrl) => axios.get(customUrl),
    getPokemonData: (pokeInfo) => axios.get(url + `${pokeInfo}`),
};