<template>
  <b-overlay
    :show="pokeData.length === 0 ? true : false"
    rounded="circle"
    variant="white"
  >
    <div class="container">
      <b-row class="mt-3">
        <router-link
          :to="{ name: 'Pokemon', params: { pokeId: Number(pokeId) - 1 } }"
        >
          <b-col
            ><h2><b-icon-arrow-left></b-icon-arrow-left></h2
          ></b-col>
        </router-link>
        <b-col>
          <h1>
            {{ pokeData.name || "" | ucFirstWord }}
            <span class="text-secondary">#{{ pokeData.id }}</span>
          </h1>
        </b-col>
        <router-link
          :to="{ name: 'Pokemon', params: { pokeId: Number(pokeId) + 1 } }"
        >
          <b-col>
            <h2><b-icon-arrow-right></b-icon-arrow-right></h2>
          </b-col>
        </router-link>
      </b-row>

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
      <div>
        <h3 class="mb-4">Evolution Chain</h3>
        <b-row v-if="evoChain != false" class="mb-5">
          <b-col v-for="(chain, i) in evoChain" :key="i">
            <b-img
              :src="getImageEvos(chain)"
              rounded="circle"
              thumbnail
            ></b-img>
            <span>{{ chain | ucFirstWord }}</span>
          </b-col>
        </b-row>
      </div>
    </div>
  </b-overlay>
</template>

<script>
import Chart from "../components/Chart.vue";
import getPokemons from "@/services/PokemonsService.js";

export default {
  components: { Chart },
  props: ["pokeId"],
  created() {
    this.getPokemonData();
  },
  updated() {
    // this.getPokemonData();
  },
//   beforeRouteUpdate (to, from, next) {
//   // this.getPokemonData();
//   // this.name = to.params.name
//   // next();
// },
  data() {
    return {
      pokeData: [],
      loadedDada: false,
      evoChain: false,
      evosImage: [],
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
  methods: {
    getPokemonData() {
      getPokemons
      .getPokemonData(this.pokeId)
      .then((res) => {
        console.log(res.data);
        return (this.pokeData = res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .then(() =>
        setTimeout(() => {
          this.loadedDada = true;
          this.getEvoChain(this.pokeId);
        }, 300)
      );
    },
    getEvoChain(id, token = 50) {
      if (token != 0) {
        console.log("chegou no getEvoChain(id)");

        var evoData;
        var evoChain = [];

        getPokemons
          .getEvolutionChain(id)
          .then((res) => {
            // console.log(res.data.chain);
            evoData = res.data.chain;
          })
          .catch((err) => {
            console.log(err);
          })
          .then(() => {
            do {
              evoChain.push(evoData.species.name);
              evoData = evoData.evolves_to[0];
            } while (
              evoData != undefined &&
              Object.prototype.hasOwnProperty.call(evoData, "evolves_to")
            );

            if (evoChain.includes(this.pokeData.name)) {
              this.evoChain = evoChain;
            } else {
              this.getEvoChain(id - 1, token);
            }
          });
      }
    },
    getImageEvos(evoName) {
      var data;
      getPokemons
        .getPokemonData(evoName)
        .then((res) => {
          // console.log("getimageevos()", res.data);
          data = res.data;
        })
        .catch((err) => {
          console.log(err);
        })
        .then(() => {
          let imageUrl =
            data.sprites.other["official-artwork"].front_default ||
            data.sprites.front_default;
          return imageUrl;
        });
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