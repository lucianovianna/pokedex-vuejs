<template>
  <div id="app">
    <pokedex-header />
    <router-view class="container" />
  </div>
</template>

<script>

export default {
  components: {
    PokedexHeader: () => import('@/components/PokedexHeader.vue'),
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--default);
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--default);
}

a {
  color: var(--primary) !important;
}
</style>