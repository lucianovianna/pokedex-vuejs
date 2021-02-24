<template>
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
</template>

<script>
export default {
  props: ["rows", "perPage", "currentPage"],
};
</script>

<style>
/*  */
</style>