<template>
  <div>
    <b-dropdown id="dropdown-1" text="Ordenar por ">
      <b-dropdown-item  @click="setOrderAZ()">
        Nome A-Z
      </b-dropdown-item>
      <b-dropdown-item  @click="setOrderZA()">
        Nome Z-A
      </b-dropdown-item>
      <b-dropdown-item  @click="setOrderIdAsc()">
        Crescente por ID
      </b-dropdown-item>
      <b-dropdown-item  @click="setOrderIdDesc()">
        Decrescente por ID
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>
export default {
  name: "DropdownOrdenacao",

  methods: {
    setOrderAZ() {
      this.$emit("changeOrder", { campo: "name", ordem: "asc" });
    },
    setOrderZA() {
      this.$emit("changeOrder", { campo: "name", ordem: "desc" });
    },
    setOrderIdAsc() {
      this.$emit("changeOrder", { campo: "id", ordem: "asc" });
    },
    setOrderIdDesc() {
      this.$emit("changeOrder", { campo: "id", ordem: "desc" });
    },
  },
};
</script>

<style>
  #dropdown-1 a {
    color: var(--default) !important;
  }
</style>
