<template>
  <footer id="footer" class="mt-5">
    <span>Criado por <strong>Luciano Vianna</strong></span>

    <span>
        <a href="https://www.linkedin.com/in/lucianocvn/" aria-label="LinkedIn de Luciano Vianna (abre em nova aba)" target="_blank" rel="noopener noreferrer">
            <b-icon-linkedin style="color: var(--default);"/>
        </a>
    </span>

    <span>
        <a href="https://github.com/lucianovianna" aria-label="GitHub de Luciano Vianna (abre em nova aba)" target="_blank" rel="noopener noreferrer">
            <b-icon-github style="color: var(--default);"/>
        </a>
    </span>

    <div class="bar" />
  </footer>
</template>

<script>
export default {
  name: 'PokedexFooter'
};
</script>

<style scoped>
  .bar {
    height: 10px;
    width: 100%;

    background-color: var(--primary);
  }

  #footer span {
      padding: 0px 6px;
      margin-bottom: 6px;
  }
</style>
