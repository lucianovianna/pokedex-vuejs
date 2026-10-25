<script>
import { PolarArea } from "vue-chartjs";

export default {
  extends: PolarArea,
  props: {
    chartData: { type: Array, required: true },
  },

  created() {
    this.setData();
  },
  mounted() {
    this.renderChart(this.data, this.options);
  },
  data() {
    return {
      data: {
        labels: [
          "HP",
          "Ataque",
          "Defesa",
          "Ataque especial",
          "Defesa especial",
          "Velocidade",
        ],
        datasets: [
          {
            backgroundColor: "rgba(204, 202, 20, 0.5)", // secondary color (#CCCA14) with 50% of transparency
            data: [],
          },
        ],
      },
      options: {
        legend: {
          display: false,
        },
        tooltips: {
          displayColors: false,
        },
        color: "#CCCA14",
        responsive: true,
        maintainAspectRatio: true,
      },
    };
  },
  methods: {
    setData() {
      this.data.datasets[0].data = this.chartData.map(stat => stat.base_stat);
    },
  },
};
</script>
