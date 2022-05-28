<template>
  <b-overlay
    :show="pokeData.length === 0 ? true : false"
    rounded="circle"
    variant="white"
  >
    <div class="container">
      <b-row class="mt-3" tag="section">
        <b-col>
          <h1>
            {{ pokeData.name || "" | kebabCaseToTitleCase }}
            <span class="text-secondary"> #{{ pokeData.id }} </span>
          </h1>
        </b-col>
      </b-row>

      <section class="pokeInfo">
        <b-card
          no-body
          class="overflow-hidden mb-5"
          style="max-width: 950px;"
          align="center"
        >
          <b-row no-gutters>
            <b-col md="6" align-self="center">
              <b-card-img
                :src="getImage"
                :alt="pokeData.name || '' | kebabCaseToTitleCase"
                class="rounded-0"
                style="max-height: 500px;"
              />
            </b-col>
            <b-col md="6" align-self="center">
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
      </section>

      <section class="pokeInfo">
        <b-row class="labelPokeInfo">
          <b-col>Height</b-col>
          <b-col>Weight</b-col>
        </b-row>
        <b-row class="dataPokeInfo">
          <b-col>{{ pokeData.height }} cm</b-col>
          <b-col>{{ pokeData.weight / 10 }} kg</b-col>
        </b-row>

        <b-row class="labelPokeInfo">
          <b-col class="mt-2">Type</b-col>
        </b-row>
        <b-row class="dataPokeInfo" align-h="center">
          <b-col
            v-for="(type, i) in getTypes"
            cols="auto"
            :key="i"
            class="mx-2 my-4 px-2 py-1 border"
          >
            {{ type.type.name | ucFirstWord }}
          </b-col>
        </b-row>

        <b-row>
          <b-col class="labelPokeInfo">Abilities</b-col>
        </b-row>
        <b-row align-h="center">
          <b-col
            v-for="(ability, i) in getAbilities"
            cols="auto"
            :key="i"
            class="mx-2 my-4 px-auto py-1 border"
          >
            {{ ability.ability.name | ucFirstWord }}
          </b-col>
        </b-row>
      </section>

      <section v-if="evoChain.length ? true : false">
        <h3 class="mb-4">
          Evolution Chain
        </h3>
        <b-row no-gutters class="mb-5" align-h="center">
          <b-col v-for="(chain, i) in evoChain" :key="i" cols="12" sm="4">
            <router-link :to="`/pokemon/${chain.id}`">
              <b-img 
                :src="chain.image" 
                rounded="circle" 
                thumbnail
                class="mb-1"
              />
              <p> {{ chain.name | kebabCaseToTitleCase }} </p>
            </router-link>
          </b-col>
        </b-row>
      </section>
    </div>
  </b-overlay>
</template>

<script>

import getPokemons from "@/services/PokemonsService.js";

export default {
  components: {
    Chart: () => import("@/components/Chart.vue"),
  },

  beforeRouteUpdate(to, from, next) {
    this.getPokemonData(to.params.pokeId);
    next();
  },

  created() {
    this.getPokemonData(this.$route.params.pokeId);
  },

  data() {
    return {
      pokeData: [],
      loadedDada: false,
      evoChain: [],
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
    getPokemonData(pokeId) {
      this.pokeData = [];
      this.loadedDada = false;
      this.evoChain = [];
      this.evosImage = [];

      getPokemons
        .getPokemonData(pokeId)
        .then((res) => {
          return (this.pokeData = res.data);
        })
        .catch(err => {
          console.error(`Erro ao recuperar dados do pokemon ${pokeId}`, err);
        })
        .finally(() => {
          this.loadedDada = true;
          this.getEvoChainUrl(pokeId);
        });
    },
    getEvoChainUrl(id) {
      getPokemons
        .getPokemonSpecies(id)
        .then((res) => {
          this.getEvoChain(res.data.evolution_chain.url);
        })
        .catch(err => {
          console.error(`Erro ao recuperar URL da Evolution Chain do pokemon ${id}`, err);
        });
    },
    getEvoChain(evoUrl) {
      getPokemons
        .getDataByUrl(evoUrl)
        .then(async res => {
          let evoData = res.data.chain;

          do {
            this.evoChain.push({
              name: evoData.species.name, 
              ...await this.getImageEvos(evoData.species.name)
            });

            evoData = evoData.evolves_to[0];
          } while (
            evoData != undefined &&
            Object.prototype.hasOwnProperty.call(evoData, "evolves_to")
          );
        })
        .catch(err => {
          console.error("Erro ao recuperar evolution chain do pokemon: ", err);
        });
    },
    async getImageEvos(evoName) {
      return await getPokemons
        .getPokemonData(evoName)
        .then((res) => {
          return {
            image: res.data.sprites.front_default,
            id: res.data.id
          };
        })
        .catch(err => {
          console.error(`Erro ao recuperar a imagem do pokemon ${evoName}`,err);
          return null;
        })
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
