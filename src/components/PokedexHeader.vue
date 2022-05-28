<template>
  <div>
    <div class="bar" />

    <b-navbar variant="faded" type="light"  class="container mb-4">
      <b-navbar-brand href="/">
        <b-img
          src="pokeball-icon.png"
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

    background-color: var(--primary);
  }
</style>