<template>
  <div style="text-align: center">
    <b-row align-h="center" align-v="center" id="filtragens">
      <b-col cols="*">
        <b-input-group id="inputBusca">
          <b-input-group-prepend is-text>
            <b-icon icon="search" />
          </b-input-group-prepend>

          <b-form-input
            v-model="busca" 
            placeholder="Filtrar Pokemons"
            type="search"
          />
        </b-input-group>
      </b-col>
      <b-col cols="*">
        <dropdown-ordenacao @changeOrder="ordernarPokemons($event)"/>
      </b-col>
    </b-row>

    <div class="d-flex align-items-center" v-if="loading">
      <h3 class="mx-auto">Carregando...</h3>
      <b-spinner class="mx-auto" />
    </div>

    <div v-else>
      <body-lista-pokemons :pokemons="pokemonsPorPagina" />
      <b-pagination
        id="paginacao"
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
    DropdownOrdenacao: () => import('@/components/DropdownOrdenacao.vue'),
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
      currentPage: 1,
      perPage: 15,
    };
  },

  computed: {
    pokemonsFiltrados() {
      return this.pokemonsList.filter(
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
      let idList = this.pokemonsPorPagina.map(el => el.id);
      this.setPokemonsData(idList);
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
              id: poke.url.slice(34).slice(0, -1),
              image: null,
              types: null
            });
          });
          this.pokemonsList = pokemons;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    setPokemonsData(idList) {
      idList.forEach(id => {
        let pokeIdx = this.pokemonsList.findIndex(poke => poke.id == id);

        if (
          pokeIdx != -1 &&
          (this.pokemonsList[pokeIdx].image == null ||
            this.pokemonsList[pokeIdx].types == null)
        ) {
          PokemonsService.getPokemonDataByUrl(this.pokemonsList[pokeIdx].url)
            .then(res => {
              var pokeData = res.data;
              this.pokemonsList[pokeIdx].image = pokeData.sprites.front_default;
              this.pokemonsList[pokeIdx].types = pokeData.types;
            }).catch((err) => {
              console.log(`Erro ao recuperar dados do pokemon ${id}: `, err);
            });
        }
      });
    },
    ordernarPokemons(ordenacao) {
      let campo = ordenacao.campo;
      let pokemonList = JSON.parse(JSON.stringify(this.pokemonsList));
      let ordenados = [];

      if (ordenacao.ordem == "asc") {
        ordenados = pokemonList.sort((a, b) => a[campo] > b[campo] ? 1 : -1);
      } else {
        ordenados = pokemonList.sort((a, b) => a[campo] > b[campo] ? -1 : 1);
      }

      this.currentPage = 1;
      this.pokemonsList = ordenados;
    }
  },
};
</script>


<style>
  #filtragens {
    margin-bottom: 60px;
  }
  #paginacao {
    margin-top: 30px;
  }
  #inputBusca {
    padding-right: 5em;
  }
</style>