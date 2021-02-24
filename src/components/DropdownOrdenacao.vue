<template>
  <div>
    <b-dropdown id="dropdown-1" text="Ordenar por..." class="m-md-2">
      <b-dropdown-item href="#" @click="setOrderAZ()"> Nome A-Z </b-dropdown-item>
      <b-dropdown-item href="#" @click="setOrderZA()"> Nome Z-A </b-dropdown-item>
      <b-dropdown-item href="#" @click="setOrderIdAsc()"
        >Crescente por ID
      </b-dropdown-item>
      <b-dropdown-item href="#" @click="setOrderIdDesc()"
        >Decrescente por ID
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>
export default {
  methods: {
    setOrderAZ() {
      this.$parent.ordem.campo = ["nome"];
      this.$parent.ordem.order = "asc";
    },
    setOrderZA() {
      this.$parent.ordem.campo = ["nome"];
      this.$parent.ordem.order = "desc";
    },
    setOrderIdAsc() {
      this.$parent.ordem.campo = ["id"];
      this.$parent.ordem.order = "asc";
    },
    setOrderIdDesc() {
      this.$parent.ordem.campo = ["id"];
      this.$parent.ordem.order = "desc";
    },
  },
};
</script>

<style>
</style>