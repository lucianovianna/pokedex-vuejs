<template>
  <div>
    <listar-pokemons />
  </div>
</template>

<script>

export default {
  name: "Home",
  components: {
    ListarPokemons: () => import('@/components/ListarPokemons.vue')
  },
};
</script>

<style>
</style>
