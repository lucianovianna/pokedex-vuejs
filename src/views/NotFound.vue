<template>
  <section class="my-5">
    <h1>Página não encontrada</h1>
    <p>Este endereço não existe na Pokédex.</p>
    <b-button :to="{ name: 'Home' }" variant="primary">Voltar à Pokédex</b-button>
  </section>
</template>

<script>
export default {
  name: 'NotFound',
};
</script>
