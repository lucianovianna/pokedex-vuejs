<template>
  <div id="paginacao">
    <b-pagination
      v-model="$parent.currentPage"
      :total-rows="$parent.rows"
      :per-page="$parent.perPage"
      aria-controls="pokeList"
      align="center"
    ></b-pagination>
    <span>Linhas: {{ $parent.rows }}</span>
  </div>
</template>

<script>
export default {};
</script>

<style>
#paginacao {
  margin-top: 30px;
}
</style>