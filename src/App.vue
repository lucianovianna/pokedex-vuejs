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
:root {
  --primary-color: #C00;
  --secondary-color: #CCCA14;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
