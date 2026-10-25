<template>
  <header class="pokedex-header mb-4">
    <div class="bar" aria-hidden="true" />

    <b-navbar type="light" class="container header-nav" aria-label="Navegação principal">
      <b-navbar-brand :to="{ name: 'Home' }" class="brand">
        <b-img
          src="pokeball-icon.png"
          width="30"
          height="30"
          alt=""
        />
        Pokédex
      </b-navbar-brand>
    </b-navbar>
  </header>
</template>

<script>
export default {
  name: 'PokedexHeader'
};
</script>

<style scoped>
.pokedex-header {
  background-color: white;
  border-bottom: 1px solid #e9ecef;
}

.bar {
  height: 4px;
  background-color: var(--primary);
}

.header-nav {
  padding: 20px 15px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 0;
  font-size: 24px;
  font-weight: 600;
  line-height: 1.25;
}

.brand,
.brand:hover,
.brand:focus {
  color: var(--primary);
}
</style>
