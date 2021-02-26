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
    // console.log("data no mounted:", this.data);
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
            label: "",
            backgroudColor: "#e60000",
          },
        ],
      },
      options: {
        legend: {
          // title: "Stats",
          display: false,
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
  methods: {
    setData() {
      if (this.chartData != undefined) {
        this.data.datasets[0].data = [];
        for (let i = 0; i < 6; i++) {
          this.data.datasets[0].data.push(this.chartData[`${i}`].base_stat);
        }
      }
      // console.log("setData()", this.data);
    },
  },
};
</script>

<style>
</style>