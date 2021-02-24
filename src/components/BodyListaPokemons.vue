<template>
  <div>
    <b-row id="pokeList">
      <b-col sm="4" md="4" v-for="(poke, i) in $parent.pokemonsPorPagina" :key="i">
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
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>