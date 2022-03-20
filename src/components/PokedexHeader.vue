<template>
  <div>
    <div class="bar" />

    <b-navbar variant="faded" type="light"  class="container mb-4">
      <b-navbar-brand href="/">
        <b-img
          src="https://spng.pngfind.com/pngs/s/103-1032129_pokeball-pokeball-sprite-hd-png-download.png"
          class="d-inline-block align-top"
          width="30px"
          alt=""
        />
        Pokédex
      </b-navbar-brand>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: 'PokedexHeader'
};
</script>

<style scoped>
  .bar {
    height: 10px;
    width: 100%;

    background-color: var(--primary-color);
  }
</style>