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
      this.$parent.ordenacao.campo = "nome";
      this.$parent.ordenacao.ordem = "asc";
    },
    setOrderZA() {
      this.$parent.ordenacao.campo = "nome";
      this.$parent.ordenacao.ordem = "desc";
    },
    setOrderIdAsc() {
      this.$parent.ordenacao.campo = "id";
      this.$parent.ordenacao.ordem = "asc";
    },
    setOrderIdDesc() {
      this.$parent.ordenacao.campo = "id";
      this.$parent.ordenacao.ordem = "desc";
    },
  },
};
</script>

<style></style>
