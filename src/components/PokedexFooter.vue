<template>
  <footer id="footer" class="mt-5">
    <div class="container footer-content">
      <span>Criado por <strong>Luciano Vianna</strong></span>

      <nav class="social-links" aria-label="Redes sociais">
        <a href="https://www.linkedin.com/in/lucianocvn/" aria-label="LinkedIn de Luciano Vianna (abre em nova aba)" target="_blank" rel="noopener noreferrer">
          <b-icon-linkedin />
        </a>
        <a href="https://github.com/lucianovianna" aria-label="GitHub de Luciano Vianna (abre em nova aba)" target="_blank" rel="noopener noreferrer">
          <b-icon-github />
        </a>
      </nav>
    </div>
    <div class="bar" aria-hidden="true" />
  </footer>
</template>

<script>
export default {
  name: 'PokedexFooter'
};
</script>

<style scoped>
.footer-content {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 20px 15px;
}

.social-links {
  display: flex;
  gap: 12px;
}

.social-links a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  min-height: 24px;
  color: var(--default);
}

.bar {
  height: 4px;
  background-color: var(--primary);
}
</style>
