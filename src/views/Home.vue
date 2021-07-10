<template>
  <div>
    <titulo />
    <listar-pokemons />
  </div>
</template>

<script>

export default {
  name: "Home",
  components: {
    Titulo: () => import('@/components/Titulo.vue'),
    ListarPokemons: () => import('@/components/ListarPokemons.vue')
  },
};
</script>

<style>
</style>
