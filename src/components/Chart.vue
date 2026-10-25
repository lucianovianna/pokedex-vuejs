<template>
  <div>
    <dl class="stats">
      <div v-for="stat in stats" :key="stat.name" class="stat">
        <dt :id="`stat-${stat.name}`">{{ stat.label }}</dt>
        <dd>
          <meter
            min="0"
            :max="maxStat"
            :value="stat.value"
            :aria-labelledby="`stat-${stat.name}`"
          >{{ stat.value }}</meter>
          <span>{{ stat.value }}</span>
        </dd>
      </div>
    </dl>
    <small class="text-secondary">Escala das barras: 0 a {{ maxStat }}</small>
  </div>
</template>

<script>
const labels = {
  hp: 'HP',
  attack: 'Ataque',
  defense: 'Defesa',
  'special-attack': 'Ataque especial',
  'special-defense': 'Defesa especial',
  speed: 'Velocidade',
};

export default {
  props: {
    chartData: { type: Array, required: true },
  },
  computed: {
    stats() {
      return this.chartData.map(({ stat, base_stat }) => ({
        name: stat.name,
        label: labels[stat.name] || stat.name,
        value: base_stat,
      }));
    },
    maxStat() {
      return Math.max(100, ...this.stats.map(stat => stat.value));
    },
  },
};
</script>

<style scoped>
.stats {
  text-align: left;
}

.stat + .stat {
  margin-top: 0.75rem;
}

.stat dd {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0;
}

.stat meter {
  flex: 1;
  min-width: 0;
  height: 1.5rem;
}

.stat meter::-webkit-meter-optimum-value {
  background: var(--primary);
}

.stat meter::-moz-meter-bar {
  background: var(--primary);
}

.stat dd span {
  min-width: 3ch;
  text-align: right;
  font-variant-numeric: tabular-nums;
}
</style>
