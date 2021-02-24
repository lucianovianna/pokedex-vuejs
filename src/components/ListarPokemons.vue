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
      <body-lista-pokemons></body-lista-pokemons>
      <paginacao></paginacao>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import Pokemons from "../getPokemons";
import Pokemon from "../pokemon";

export default {
  created() {
    Pokemons.getPokemonsList()
      .then((res) => {
        var data = res.data.results;
        // console.log(data);

        for (let i in data) {
          this.pokemonsData.push(new Pokemon(data[i].name, data[i].url));
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .then(() => {
        this.loading = false;
      });
  },

  data() {
    return {
      pokemonsData: [],
      loading: true,
      ordem: {
        order: "asc",
        campo: ["nome"],
      },
      busca: "",
      currentPage: 1,
      perPage: 5,
    };
  },
  computed: {
    rows() {
      return Math.ceil(this.pokemonsFiltrados.length / 3);
    },
    pokemonsOrdenados() {
      return _.orderBy(this.pokemonsData, this.ordem.campo, this.ordem.order);
    },
    pokemonsFiltrados() {
      var self = this;

      return _.filter(this.pokemonsOrdenados, function (poke) {
        let busca = self.busca.toLowerCase();
        return poke.nome.toLowerCase().indexOf(busca) >= 0;
      });
    },
    pokemonsPorPagina() {
      const pokemons = this.pokemonsFiltrados;

      return pokemons.slice(
        (this.currentPage - 1) * (this.perPage * 3),
        this.currentPage * (this.perPage * 3)
      );
    },
  },
  methods: {},
};
</script>


<style>
#filtragens {
  margin-bottom: 60px;
}
</style>