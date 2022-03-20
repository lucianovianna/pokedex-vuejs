<script>
import { PolarArea, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;

export default {
  extends: PolarArea,
  mixins: [reactiveProp],
  props: ["chartData"],

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
          "Hp",
          "Attack",
          "Defense",
          "Special Attack",
          "Special Defense",
          "Speed",
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
        maintainAspectRatio: false,
      },
    };
  },
  methods: {
    setData() {
      if (this.chartData != undefined) {
        for (let i = 0; i < 6; i++) {
          this.data.datasets[0].data.push(this.chartData[`${i}`].base_stat);
        }
      }
      console.log("this.data.datasets: ", this.data.datasets);
    },
  },
};
</script>

<style>
</style>