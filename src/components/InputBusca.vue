<template>
  <div id="inputBusca">
    <b-input-group>
      <b-input-group-prepend is-text>
        <b-icon icon="search"></b-icon>
      </b-input-group-prepend>

      <b-form-input
        v-model="$parent.busca"
        placeholder="Filtrar Pokemons"
        type="search"
      ></b-form-input>
    </b-input-group>
  </div>
</template>

<script>
export default {
  name: "InputBusca"
};
</script>

<style>
#inputBusca {
  padding-right: 5em;
}
</style>