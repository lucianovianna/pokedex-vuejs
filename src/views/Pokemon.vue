<template>
  <b-overlay
    :show="(pokeData.length === 0) ? true : false"
    rounded="circle"
    variant="white"
  >
    <div class="container">
      <h1>{{pokeData.name || '' | ucFirstWord}}</h1>
    </div>
  </b-overlay>
</template>

<script>
import getPokemons from "../getPokemons";

export default {
  props: ["pokeId"],
  created() {
    getPokemons
      .getPokemonData(this.pokeId)
      .then((res) => {
        // console.log(res.data);
        return this.pokeData = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  data() {
    return {
      pokeData: [],
    };
  },
  computed: {},
};
</script>

<style>
</style>