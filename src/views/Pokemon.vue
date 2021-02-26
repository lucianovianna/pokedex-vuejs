<template>
  <b-overlay
    :show="pokeData.length === 0 ? true : false"
    rounded="circle"
    variant="white"
  >
    <div class="container">
      <h1>{{ pokeData.name || "" | ucFirstWord }}</h1>
      <hr />

      <div class="pokeInfo">
        <b-row align-h="around" align-v="around">
          <b-card
            no-body
            class="overflow-hidden mb-3"
            style="max-width: 475px"
            align="center"
          >
            <b-card-img
              :src="getImage"
              :alt="pokeData.name || '' | ucFirstWord"
              class="border-bottom"
            ></b-card-img>
            <b-card-body>
              <div>
                <b-row class="labelPokeInfo">
                  <b-col>Height</b-col>
                  <b-col>Category</b-col>
                </b-row>
                <b-row class="dataPokeInfo">
                  <b-col>{{ pokeData.height }}</b-col>
                  <b-col>X</b-col>
                </b-row>
                <!--  -->
                <b-row class="labelPokeInfo">
                  <b-col>Weight</b-col>
                  <b-col>Gender</b-col>
                </b-row>
                <b-row class="dataPokeInfo">
                  <b-col>{{ pokeData.weight }}</b-col>
                  <b-col>X</b-col>
                </b-row>
              </div>
            </b-card-body>
          </b-card>

          <div>
            <!-- CHART -->
            <div v-if="loadedDada">
              <b-row>
                <b-col class="labelPokeInfo mb-2 mt-2">Stats</b-col>
              </b-row>
              <b-row>
                <b-col> <chart :chartData="pokeData.stats"></chart> </b-col>
              </b-row>
            </div>
            <br />

            <b-row>
              <b-col class="labelPokeInfo mt-2">Type</b-col>
            </b-row>
            <b-row>
              <b-col
                v-for="(type, i) in getTypes"
                :key="i"
                class="mx-2 my-4 px-2 py-1 border"
              >
                {{ type.type.name | ucFirstWord }}
              </b-col>
            </b-row>

            <b-row>
              <b-col class="labelPokeInfo">Weakenesses</b-col>
            </b-row>
            <b-row>
              <b-col class="mx-2 my-4 px-2 py-1 border">X</b-col>
            </b-row>

            <b-row>
              <b-col class="labelPokeInfo">Abilities</b-col>
            </b-row>
            <b-row>
              <b-col
                v-for="(ability, i) in getAbilities"
                :key="i"
                class="mx-2 my-4 px-2 py-1 border"
              >
                {{ ability.ability.name | ucFirstWord }}
              </b-col>
            </b-row>
          </div>
          <!--  -->
        </b-row>
      </div>
    </div>
  </b-overlay>
</template>

<script>
import Chart from "../components/Chart.vue";
import getPokemons from "../getPokemons";

export default {
  components: { Chart },
  props: ["pokeId"],
  created() {
    getPokemons
      .getPokemonData(this.pokeId)
      .then((res) => {
        console.log(res.data);
        return (this.pokeData = res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .then(() => setTimeout(() => (this.loadedDada = true), 300));
  },
  data() {
    return {
      pokeData: [],
      loadedDada: false,
    };
  },
  computed: {
    getImage() {
      if (this.pokeData.sprites === undefined) return "";
      return (
        this.pokeData.sprites.other["official-artwork"].front_default ||
        this.pokeData.sprites.front_default
      );
    },
    getStats() {
      return this.pokeData.stats;
    },
    getTypes() {
      return this.pokeData.types;
    },
    getAbilities() {
      return this.pokeData.abilities;
    },
  },
};
</script>

<style>
.pokeInfo {
  margin: 3em;
}

.labelPokeInfo {
  font-weight: bold;
}

.dataPokeInfo {
  margin-bottom: 1em;
}
</style>