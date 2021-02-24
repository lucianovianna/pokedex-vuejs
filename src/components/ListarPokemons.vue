<template>
  <div style="text-align: center">
    <div class="d-flex align-items-center" v-if="loading">
      <strong>Carregando...</strong>
      <b-spinner class="ml-auto"></b-spinner>
    </div>

    <div v-else>
      <b-row id="pokeList">
        <b-col sm="4" md="4" v-for="(poke, i) in pokemonsFiltrados" :key="i">
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
      return this.pokemonsData.length / 3;
    },
    pokemonsOrdenados() {
      return _.orderBy(this.pokemonsData, ["nome"], this.order);
    },
    pokemonsFiltrados() {
      var self = this;

      return _.filter(this.pokemonsOrdenados, function (poke) {
        let busca = self.busca.toLowerCase();
        return poke.nome.toLowerCase().indexOf(busca) >= 0;
      }).slice(
        (this.currentPage - 1) * (this.perPage * 3),
        this.currentPage * (this.perPage * 3)
      );
    },
  },
  methods: {},
};
</script>