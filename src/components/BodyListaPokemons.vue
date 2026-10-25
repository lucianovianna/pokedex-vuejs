<template>
  <b-row id="pokeList">
    <b-col
      cols="6"
      sm="4"
      class="d-flex justify-content-around"
      v-for="(poke) in pokemons" :key="poke.id"
    >
      <b-card
        no-body
        class="mb-5"
        style="width: 250px;"
        align="center"
      >
        <b-overlay
          :show="poke.loading"
          rounded="circle"
          variant="white"
        >
          <router-link :to="{ name: 'Pokemon', params: { pokeId: poke.id } }">
            <div>
              <b-img
                v-if="poke.image"
                :src="poke.image"
                rounded="circle"
                class="my-3"
                thumbnail
              />
              <p v-else class="my-3">Imagem indisponível</p>
              <p>{{ poke.name | kebabCaseToTitleCase }}</p>
            </div>
          </router-link>
          <b-card-body class="mt-n3">
            <div v-if="poke.error" role="alert">
              <p>Não foi possível carregar os detalhes.</p>
              <b-button size="sm" variant="outline-danger" @click="$emit('retry', poke)">
                Tentar novamente
              </b-button>
            </div>
            <span
              v-for="type in poke.types"
              :key="type.slot"
              class="mx-2 px-2 py-1 border"
            >
              {{ type.type.name | ucFirstWord }}
            </span>
          </b-card-body>
        </b-overlay>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'BodyListaPokemons',

  props: {
    pokemons: {
      required: true,
      type: Array
    }
  }
};
</script>

<style>
</style>
