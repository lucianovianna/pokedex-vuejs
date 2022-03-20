<template>
  <div id="footer" class="mt-5">
    <span>Created by <strong>Luciano Vianna</strong></span>

    <span>
        <a href="https://www.linkedin.com/in/lucianocvn/" target="_blank">
            <b-icon-linkedin style="color: var(--default);"/>
        </a>
    </span>

    <span>
        <a href="https://www.linkedin.com/in/lucianocvn/" target="_blank">
            <b-icon-github style="color: var(--default);"/>
        </a>
    </span>
    
    <div class="bar" />
  </div>
</template>

<script>
export default {
  name: 'PokedexHeader'
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