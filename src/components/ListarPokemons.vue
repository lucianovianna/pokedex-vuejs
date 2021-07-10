<template>
  <div style="text-align: center">
    <b-row align-h="center" align-v="center" id="filtragens">
      <input-busca></input-busca>
      <dropdown-ordenacao></dropdown-ordenacao>
    </b-row>

    <div class="d-flex align-items-center" v-if="loading">
      <strong>Carregando...</strong>
      <b-spinner class="ml-auto"></b-spinner>
    </div>

    <div v-else>
      <body-lista-pokemons :pokemons="pokemonsPorPagina" />
      <paginacao />
    </div>
  </div>
</template>

<script>

import _ from "lodash";
import PokemonsService from "@/services/PokemonsService.js";

export default {
  name: 'ListarPokemons',

  components: {
    Paginacao: () => import('@/components/Paginacao.vue'),
    InputBusca: () => import('@/components/InputBusca.vue'),
    DropdownOrdenacao: () => import('@/components/DropdownOrdenacao.vue'),
    BodyListaPokemons: () => import('@/components/BodyListaPokemons.vue')
  },

  created() {
    this.getPokemonsList();
  },

  data() {
    return {
      pokemonsList: [],
      loading: false,
      ordem: {
        order: "asc",
        campo: ["nome"],
      },
      busca: "",
      currentPage: 1,
    };
  },

  computed: {
    rows() {
      return Math.ceil(this.pokemonsFiltrados.length / 3);
    },
    pokemonsOrdenados() {
      let ordenados = _.orderBy(this.pokemonsList, this.ordem.campo, this.ordem.order);
      // console.log("Ordenados: ", JSON.parse(JSON.stringify(ordenados)));
      return ordenados;
    },
    pokemonsFiltrados() {
      var self = this;
      return _.filter(this.pokemonsOrdenados, (poke) => {
        let busca = self.busca.toLowerCase();
        return poke.name.toLowerCase().indexOf(busca) >= 0;
      });
    },
    pokemonsPorPagina() {
      const perPage = 15;

      let pokemons = this.pokemonsFiltrados.slice(
        (this.currentPage - 1) * perPage,
        this.currentPage * perPage
      );

      console.log("pokemonsPorPagina: " , this.setPokemonsData(pokemons));
      return this.setPokemonsData(pokemons);
    }
  },

  methods: {
    getPokemonsList() {
      this.loading = true;

      PokemonsService.getPokemonsList()
        .then((res) => {
          this.pokemonsList = res.data.results;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    setPokemonsData(pokemonsList) {
      let newPokemonList = [];

      pokemonsList.forEach(async poke => {
        await PokemonsService.getPokemonDataByUrl(poke.url)
          .then((res) => {
            var pokeData = res.data;

            newPokemonList.push({
              ...poke,
              image: pokeData.sprites.front_default,
              id: pokeData.id,
              types: pokeData.types
            });
          }).catch((err) => {
            console.log(err);
          });
      });

      return newPokemonList;
    }
  },
};
</script>


<style>
#filtragens {
  margin-bottom: 60px;
}
</style>