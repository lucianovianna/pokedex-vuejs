<template>
  <div>
    <div class="d-flex align-items-center" v-if="loading">
      <strong>Carregando...</strong>
      <b-spinner class="ml-auto"></b-spinner>
    </div>

    <b-row>
      <b-col sm="3" md="3" v-for="(poke, i) in pokemonsData.results" :key="i">
        {{ `${getImage(poke.url)}` }}
        <b-img-lazy
          :src="getImage(poke.url)"
          srcset=""
          rounded="circle"
        ></b-img-lazy>
        {{ poke.name }}
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Pokemons from "../getPokemons";

export default {
  created() {
    Pokemons.getPokemonsList()
      .then((res) => {
        // console.log(res.data);
        this.pokemonsData = res.data;
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
    };
  },
  computed: {
    rows() {
      return this.pokemonsData.length;
    },
  },
  methods: {
    getImage(pokeUrl) {
      Pokemons.getPokemonData(pokeUrl)
        .then((res) => {
          // console.log(res.data);
          // console.log(res.data.sprites.front_default);
          return res.data.sprites.front_default;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>