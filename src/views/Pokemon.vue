<template>
  <b-overlay
    :show="pokeData.length === 0 ? true : false"
    rounded="circle"
    variant="white"
  >
    <div class="container">
      <h1>
        {{ pokeData.name || "" | ucFirstWord }}
        <span class="text-secondary">#{{ pokeData.id }}</span>
      </h1>
      <hr />

      <div class="pokeInfo">
        <div>
          <b-card
            no-body
            class="overflow-hidden mb-5"
            style="max-width: 950px; max-height: 500px"
            align="center"
          >
            <b-row no-gutters>
              <b-col md="6">
                <b-card-img
                  :src="getImage"
                  :alt="pokeData.name || '' | ucFirstWord"
                  class="rounded-0"
                ></b-card-img>
              </b-col>
              <b-col md="6">
                <b-card-body
                  v-if="loadedDada"
                  class="border-left"
                  title="Status"
                >
                  <div>
                    <b-row>
                      <b-col>
                        <chart :chartData="pokeData.stats"></chart>
                      </b-col>
                    </b-row>
                  </div>
                </b-card-body>
              </b-col>
            </b-row>
          </b-card>
        </div>

        <div>
          <b-row class="labelPokeInfo">
            <b-col>Height</b-col>
            <b-col>Weight</b-col>
          </b-row>
          <b-row class="dataPokeInfo">
            <b-col>{{ pokeData.height }}</b-col>
            <b-col>{{ pokeData.weight }}</b-col>
          </b-row>

          <b-row class="labelPokeInfo">
            <b-col class="mt-2">Type</b-col>
          </b-row>
          <b-row class="dataPokeInfo">
            <b-col
              v-for="(type, i) in getTypes"
              :key="i"
              class="mx-2 my-4 px-2 py-1 border"
            >
              {{ type.type.name | ucFirstWord }}
            </b-col>
          </b-row>

          <b-row>
            <b-col class="labelPokeInfo">Abilities</b-col>
          </b-row>
          <b-row>
            <b-col
              v-for="(ability, i) in getAbilities"
              :key="i"
              class="mx-2 my-4 px-auto py-1 border"
            >
              {{ ability.ability.name | ucFirstWord }}
            </b-col>
          </b-row>
        </div>
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