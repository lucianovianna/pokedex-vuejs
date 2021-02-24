<template>
  <div style="text-align: center">
    <!-- <b-input-group id="inputBusca">
      <b-icon icon="search"></b-icon>
      <b-form-input v-model="busca" placeholder="Filtrar Pokemons" type="search"></b-form-input>
      <b-button variant="outline-secondary" @click="busca = ''">X</b-button>
    </b-input-group> -->

    <input-busca></input-busca>

    <div class="d-flex align-items-center" v-if="loading">
      <strong>Carregando...</strong>
      <b-spinner class="ml-auto"></b-spinner>
    </div>

    <div v-else>
      <b-row id="pokeList">
        <b-col sm="4" md="4" v-for="(poke, i) in pokemonsPorPagina" :key="i">
          <b-overlay
            :show="poke.image == '' ? true : false"
            rounded="circle"
            variant="white"
          >
            <b-img :src="poke.getImage()" rounded="circle" thumbnail></b-img>
          </b-overlay>
          <p>{{ poke.nome | ucFirstWord }}</p>
        </b-col>
      </b-row>
      <br />
      <div>
        <b-pagination
          v-model="currentPage"
          :total-rows="rows"
          :per-page="perPage"
          aria-controls="pokeList"
          align="center"
        ></b-pagination>
        <span>Linhas: {{ rows }}</span>
      </div>
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
      order: "asc",
      busca: "",
      currentPage: 1,
      perPage: 5,
    };
  },
  computed: {
    rows() {
      if (this.busca != "") {
        return Math.ceil(this.pokemonsFiltrados.length / 3);
      } else {
        return Math.ceil(this.pokemonsData.length / 3);
      }
    },
    pokemonsOrdenados() {
      return _.orderBy(this.pokemonsData, ["nome"], this.order);
    },
    pokemonsPorPagina() {
      const pokemons = this.pokemonsFiltrados;

      return pokemons.slice(
        (this.currentPage - 1) * (this.perPage * 3),
        this.currentPage * (this.perPage * 3)
      );
    },
    pokemonsFiltrados() {
      var self = this;

      return _.filter(this.pokemonsOrdenados, function (poke) {
        let busca = self.busca.toLowerCase();
        return poke.nome.toLowerCase().indexOf(busca) >= 0;
      });
    },
  },
  methods: {},
};
</script>


<style>
#inputBusca {
  padding-inline: 15em;
  margin-bottom: 60px;
}
</style>