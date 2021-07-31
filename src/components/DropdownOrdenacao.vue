<template>
  <div>
    <b-dropdown id="dropdown-1" text="Ordenar por..." class="m-md-2">
      <b-dropdown-item href="#" @click="setOrderAZ()">
        Nome A-Z
      </b-dropdown-item>
      <b-dropdown-item href="#" @click="setOrderZA()">
        Nome Z-A
      </b-dropdown-item>
      <b-dropdown-item href="#" @click="setOrderIdAsc()">
        Crescente por ID
      </b-dropdown-item>
      <b-dropdown-item href="#" @click="setOrderIdDesc()">
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

<style></style>
