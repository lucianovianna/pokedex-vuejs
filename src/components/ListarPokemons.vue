<template>
  <div style="text-align: center">
    <b-row align-h="center" align-v="center" class="mb-5">
      <b-col cols="*">
        <b-input-group class="pr-5" v-b-tooltip.hover title="Pesquisar Pokemons">
          <template #prepend>
            <b-input-group-text style="background-color: var(--secondary)">
              <b-icon-search />
            </b-input-group-text>
          </template>

          <b-input 
            v-model="busca"
            placeholder="Pesquisar Pokemons"
            type="text" 
            style="outline: none; box-shadow: none;"
          />
        </b-input-group>
      </b-col>
      <b-col cols="*">
        <b-input-group class="pr-5" v-b-tooltip.hover title="Selecionar Ordenação">
          <template #prepend>
            <b-input-group-text style="background-color: var(--secondary)">
              <b-icon-filter />
            </b-input-group-text>
          </template>

          <b-form-select 
            v-model="ordenacao" 
            :options="ordanacaoOptions" 
            style="outline: none; box-shadow: none;"
          />
        </b-input-group>
      </b-col>
    </b-row>

    <div class="d-flex align-items-center" v-if="loading">
      <h3 class="mx-auto">Carregando...</h3>
      <b-spinner class="mx-auto" />
    </div>

    <div v-else>
      <body-lista-pokemons :pokemons="pokemonsPorPagina" />
      <b-pagination
        class="mt-3"
        v-model="currentPage"
        :total-rows="pokemonsFiltrados.length"
        :per-page="perPage"
        align="center"
      />
      <span>Pokemons encontrados: {{ pokemonsFiltrados.length }}</span>
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
      busca: "",
      ordenacao: { 
        campo: "id", 
        ordem: "asc" 
      },
      ordanacaoOptions: [
        { value: { campo: "id", ordem: "asc" }, text: 'Crescente por ID' },
        { value: { campo: "id", ordem: "desc" }, text: 'Decrescente por ID' },
        { value: { campo: "name", ordem: "asc" }, text: 'Nome A-Z' },
        { value: { campo: "name", ordem: "desc" }, text: 'Nome Z-A' }
      ],
      currentPage: 1,
      perPage: 15,
    };
  },

  computed: {
    pokemonsOrdenados() {
      const campo = this.ordenacao.campo;
      const ordem = this.ordenacao.ordem; 
      let orderedPokemonsList = JSON.parse(JSON.stringify(this.pokemonsList));

      const operation = {
        "desc": (a, b) => a < b,
        "asc": (a, b) => a > b
      };

      orderedPokemonsList.sort((a, b) => operation[ordem](a[campo], b[campo]) ? 1 : -1);

      return orderedPokemonsList;
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
    buscaCurrentPageOrdenacao() {
      return `${this.busca}|${this.currentPage}|${JSON.stringify(this.ordenacao)}`;
    },
  },

  watch: {
    buscaCurrentPageOrdenacao() {
      this.setPokemonsData();
    },
    busca() {
      this.currentPage = 1;
    },
  },

  methods: {
    getPokemonsList() {
      this.loading = true;

      PokemonsService.getPokemonsList()
        .then(res => {
          let pokemons = [];
          res.data.results.forEach(poke => {
            pokemons.push({
              ...poke,
              id: Number(poke.url.slice(34).slice(0, -1)),
              image: null,
              types: null
            });
          });

          this.pokemonsList = pokemons;

          this.setPokemonsData();
        })
        .catch(err => {
          console.error(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    setPokemonsData() {
      const idList = this.pokemonsPorPagina.map(poke => poke.id);

      idList.forEach(id => {
        let pokeIdx = this.pokemonsList.findIndex(poke => poke.id == id);

        if (
          pokeIdx != -1 &&
          (this.pokemonsList[pokeIdx].image == null ||
            this.pokemonsList[pokeIdx].types == null)
        ) {
          PokemonsService.getDataByUrl(this.pokemonsList[pokeIdx].url)
            .then(res => {
              let pokeData = res.data;
              this.pokemonsList[pokeIdx].image = pokeData.sprites.front_default;
              this.pokemonsList[pokeIdx].types = pokeData.types;
            }).catch(err => {
              console.error(`Erro ao recuperar dados do pokemon ${id}: `, err);
            });
        }
      });
    },
    setOrdenacao(ordenacao) {
      this.ordenacao = ordenacao;
      this.currentPage = 1;
    }
  },
};
</script>


<style></style>