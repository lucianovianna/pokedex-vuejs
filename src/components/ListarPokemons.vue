<template>
  <div style="text-align: center">
    <b-row align-h="center" align-v="center" class="mb-5">
      <b-col cols="12" sm="6" class="mb-3">
        <b-input-group v-b-tooltip.hover title="Pesquisar Pokémon">
          <template #prepend>
            <b-input-group-text style="background-color: var(--secondary)">
              <b-icon-search aria-hidden="true" />
            </b-input-group-text>
          </template>

          <b-form-input
            v-model="busca"
            placeholder="Pesquisar Pokémon"
            aria-label="Pesquisar Pokémon"
            type="search"
          />
        </b-input-group>
      </b-col>
      <b-col cols="12" sm="6" class="mb-3">
        <b-input-group v-b-tooltip.hover title="Selecionar ordenação">
          <template #prepend>
            <b-input-group-text style="background-color: var(--secondary)">
              <b-icon-filter aria-hidden="true" />
            </b-input-group-text>
          </template>

          <b-form-select
            v-model="ordenacao"
            aria-label="Ordenar Pokémon"
            :options="sortOptions"
          />
        </b-input-group>
      </b-col>
    </b-row>

    <div class="d-flex align-items-center" v-if="loading" role="status">
      <p class="mx-auto mb-0">Carregando Pokémon...</p>
      <b-spinner class="mx-auto" />
    </div>

    <b-alert v-else-if="error" show variant="danger">
      {{ error }}
      <b-button variant="outline-danger" @click="getPokemonsList">Tentar novamente</b-button>
    </b-alert>

    <div v-else>
      <p v-if="!pokemonsFiltrados.length" role="status">Nenhum Pokémon encontrado.</p>
      <body-lista-pokemons :pokemons="pokemonsPorPagina" @retry="loadPokemon" />
      <b-pagination
        v-if="pokemonsFiltrados.length > perPage"
        aria-label="Paginação de Pokémon"
        label-first-page="Primeira página"
        label-prev-page="Página anterior"
        label-next-page="Próxima página"
        label-last-page="Última página"
        label-page="Ir para a página"
        class="mt-3"
        v-model="currentPage"
        :total-rows="pokemonsFiltrados.length"
        :per-page="perPage"
        align="center"
      />
      <span role="status">Pokémon encontrados: {{ pokemonsFiltrados.length }}</span>
    </div>
  </div>
</template>

<script>

import PokemonsService from "@/services/PokemonsService.js";

export default {
  name: 'ListarPokemons',

  components: {
    BodyListaPokemons: () => import('@/components/BodyListaPokemons.vue')
  },

  created() {
    this.getPokemonsList();
  },

  data() {
    return {
      pokemonsList: [],
      loading: false,
      error: "",
      savedQuery: this.$route.query,
      sortOptions: [
        { value: { campo: "id", ordem: "asc" }, text: 'Crescente por ID' },
        { value: { campo: "id", ordem: "desc" }, text: 'Decrescente por ID' },
        { value: { campo: "name", ordem: "asc" }, text: 'Nome A-Z' },
        { value: { campo: "name", ordem: "desc" }, text: 'Nome Z-A' }
      ],
      perPage: 15,
    };
  },

  computed: {
    listQuery() {
      return this.$route.name === 'Home' ? this.$route.query : this.savedQuery;
    },
    busca: {
      get() {
        return typeof this.listQuery.q === 'string' ? this.listQuery.q : '';
      },
      set(value) {
        this.updateQuery({ q: value || undefined, page: undefined });
      },
    },
    ordenacao: {
      get() {
        const option = this.sortOptions.find(({ value }) =>
          `${value.campo}-${value.ordem}` === this.listQuery.sort);
        return (option || this.sortOptions[0]).value;
      },
      set(value) {
        const sort = `${value.campo}-${value.ordem}`;
        this.updateQuery({ sort: sort === 'id-asc' ? undefined : sort, page: undefined });
      },
    },
    currentPage: {
      get() {
        const page = Number(this.listQuery.page);
        const validPage = Number.isSafeInteger(page) && page > 0 ? page : 1;
        if (!this.pokemonsList.length) return validPage;
        const lastPage = Math.max(1, Math.ceil(this.pokemonsFiltrados.length / this.perPage));
        return Math.min(validPage, lastPage);
      },
      set(value) {
        this.updateQuery({ page: value > 1 ? String(value) : undefined });
      },
    },
    pokemonsOrdenados() {
      const { campo, ordem } = this.ordenacao;
      const direction = ordem === "asc" ? 1 : -1;
      return [...this.pokemonsList].sort((a, b) => {
        if (a[campo] === b[campo]) return 0;
        return (a[campo] > b[campo] ? 1 : -1) * direction;
      });
    },
    pokemonsFiltrados() {
      return this.pokemonsOrdenados.filter(
        (poke) => poke.name.toLowerCase().indexOf(this.busca.toLowerCase()) >= 0
      );
    },
    pokemonsPorPagina() {
      return this.pokemonsFiltrados.slice(
        (this.currentPage - 1) * this.perPage,
        this.currentPage * this.perPage
      );
    },
  },

  watch: {
    pokemonsPorPagina() {
      this.setPokemonsData();
    },
    listQuery(query) {
      this.savedQuery = query;
    },
  },

  methods: {
    updateQuery(changes) {
      const query = { ...this.listQuery, ...changes };
      Object.keys(query).forEach(key => {
        if (query[key] === undefined) delete query[key];
      });
      this.$router.replace({ query }).catch(error => {
        if (error.name !== 'NavigationDuplicated') console.error(error);
      });
    },
    async getPokemonsList() {
      this.loading = true;
      this.error = "";
      try {
        const { data } = await PokemonsService.getPokemonsList();
        this.pokemonsList = data.results.map(poke => ({
          ...poke,
          id: Number(poke.url.split("/").filter(Boolean).pop()),
          image: null,
          types: [],
          loading: false,
          error: false,
          dataLoaded: false,
        }));
        this.setPokemonsData();
      } catch (error) {
        this.error = "Não foi possível carregar os Pokémon.";
      } finally {
        this.loading = false;
      }
    },
    setPokemonsData() {
      this.pokemonsPorPagina.forEach(poke => {
        if (!poke.dataLoaded && !poke.loading && !poke.error) this.loadPokemon(poke);
      });
    },
    async loadPokemon(poke) {
      if (poke.loading) return;
      poke.loading = true;
      poke.error = false;
      try {
        const { data } = await PokemonsService.getDataByUrl(poke.url);
        poke.image = data.sprites.front_default;
        poke.types = data.types;
        poke.dataLoaded = true;
      } catch (error) {
        poke.error = true;
      } finally {
        poke.loading = false;
      }
    },
  },
};
</script>
