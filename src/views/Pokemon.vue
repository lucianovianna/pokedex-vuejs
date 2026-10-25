<template>
  <b-overlay
    :show="loading"
    rounded="circle"
    variant="white"
    class="pokemon-details"
  >
    <template #overlay>
      <b-spinner label="Carregando Pokémon" />
    </template>
    <b-alert v-if="error" show variant="danger">
      {{ error }}
      <b-button variant="outline-danger" @click="getPokemonData($route.params.pokeId)">
        Tentar novamente
      </b-button>
    </b-alert>
    <div v-if="pokeData">
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
                v-if="getImage"
                :src="getImage"
                :alt="pokeData.name || '' | kebabCaseToTitleCase"
                class="rounded-0"
                style="max-height: 500px;"
              />
              <p v-else>Imagem indisponível</p>
            </b-col>
            <b-col md="6" align-self="center">
              <b-card-body
                v-if="pokeData.stats && pokeData.stats.length"
                class="border-left"
                title="Atributos"
              >
                <div>
                  <b-row>
                    <b-col>
                      <chart :key="pokeData.id" :chartData="pokeData.stats"></chart>
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
          <b-col>Altura</b-col>
          <b-col>Peso</b-col>
        </b-row>
        <b-row class="dataPokeInfo">
          <b-col>{{ heightInCentimeters }} cm</b-col>
          <b-col>{{ pokeData.weight / 10 }} kg</b-col>
        </b-row>

        <b-row class="labelPokeInfo">
          <b-col class="mt-2">Tipos</b-col>
        </b-row>
        <b-row class="dataPokeInfo" align-h="center">
          <b-col
            v-for="type in pokeData.types"
            cols="auto"
            :key="type.slot"
            class="mx-2 my-4 px-2 py-1 border"
          >
            {{ type.type.name | kebabCaseToTitleCase }}
          </b-col>
        </b-row>

        <b-row>
          <b-col class="labelPokeInfo">Habilidades</b-col>
        </b-row>
        <b-row align-h="center">
          <b-col
            v-for="ability in pokeData.abilities"
            cols="auto"
            :key="ability.ability.name"
            class="mx-2 my-4 px-auto py-1 border"
          >
            {{ ability.ability.name | kebabCaseToTitleCase }}
          </b-col>
        </b-row>
      </section>

      <p v-if="evolutionLoading" role="status">Carregando evoluções...</p>
      <b-alert v-if="evolutionError" show variant="warning">
        {{ evolutionError }}
        <b-button variant="outline-secondary" @click="loadEvolutionChain()">Tentar novamente</b-button>
      </b-alert>
      <section v-if="evoChain.length">
        <h2 class="mb-4">
          Cadeia de evolução
        </h2>
        <b-row no-gutters class="mb-5" align-h="center">
          <b-col v-for="chain in evoChain" :key="chain.id" cols="12" sm="4">
            <router-link :to="`/pokemon/${chain.id}`">
              <b-img
                v-if="chain.image"
                :src="chain.image"
                :alt="chain.name | kebabCaseToTitleCase"
                rounded="circle"
                thumbnail
                class="mb-1"
              />
              <p v-else>Imagem indisponível</p>
              <p> {{ chain.name | kebabCaseToTitleCase }} </p>
            </router-link>
          </b-col>
        </b-row>
      </section>
    </div>
  </b-overlay>
</template>

<script>

import PokemonsService from "@/services/PokemonsService.js";

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

  beforeDestroy() {
    this.requestId++;
  },

  data() {
    return {
      pokeData: null,
      loading: false,
      error: "",
      evoChain: [],
      evolutionLoading: false,
      evolutionError: "",
      requestId: 0,
    };
  },
  computed: {
    getImage() {
      if (!this.pokeData || !this.pokeData.sprites) return "";
      const { other, front_default } = this.pokeData.sprites;
      return (other && other["official-artwork"] && other["official-artwork"].front_default)
        || front_default || "";
    },
    heightInCentimeters() {
      return this.pokeData ? this.pokeData.height * 10 : null;
    },
  },
  methods: {
    async getPokemonData(pokeId) {
      const requestId = ++this.requestId;
      this.pokeData = null;
      this.loading = true;
      this.error = "";
      this.evoChain = [];
      this.evolutionError = "";
      this.evolutionLoading = false;
      try {
        const { data } = await PokemonsService.getPokemonData(pokeId);
        if (requestId !== this.requestId) return;
        this.pokeData = data;
        this.loadEvolutionChain(requestId);
      } catch (error) {
        if (requestId !== this.requestId) return;
        this.error = error.response && error.response.status === 404
          ? "Pokémon não encontrado."
          : "Não foi possível carregar este Pokémon.";
      } finally {
        if (requestId === this.requestId) this.loading = false;
      }
    },
    async loadEvolutionChain(requestId = this.requestId) {
      this.evolutionLoading = true;
      this.evolutionError = "";
      try {
        const { data: species } = await PokemonsService.getDataByUrl(this.pokeData.species.url);
        if (requestId !== this.requestId || !species.evolution_chain) return;
        const { data } = await PokemonsService.getDataByUrl(species.evolution_chain.url);
        if (requestId !== this.requestId) return;
        const names = [];
        const visit = node => {
          names.push(node.species.name);
          node.evolves_to.forEach(visit);
        };
        visit(data.chain);
        const evolutions = await Promise.all(names.map(async name => {
          const { data: pokemon } = await PokemonsService.getPokemonData(name);
          return { name, id: pokemon.id, image: pokemon.sprites.front_default };
        }));
        if (requestId === this.requestId) this.evoChain = evolutions;
      } catch (error) {
        if (requestId === this.requestId) {
          this.evolutionError = "Não foi possível carregar as evoluções.";
        }
      } finally {
        if (requestId === this.requestId) this.evolutionLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.pokemon-details {
  min-height: 150px;
}

.pokeInfo {
  margin: 3em 0;
}

.labelPokeInfo {
  font-weight: bold;
}

.dataPokeInfo {
  margin-bottom: 1em;
}
</style>
