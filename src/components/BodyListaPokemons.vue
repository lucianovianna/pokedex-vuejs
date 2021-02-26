<template>
  <div>
    <b-row id="pokeList">
      <b-col
        sm="4"
        md="4"
        class="mb-5"
        v-for="(poke, i) in $parent.pokemonsPorPagina"
        :key="i"
      >
        <b-card
          no-body
          class="overflow-hidden mb-3"
          style="max-width: 250px"
          align="center"
        >
          <b-overlay
            :show="poke.image == '' ? true : false"
            rounded="circle"
            variant="white"
          >
            <router-link
              :to="{ name: 'Pokemon', params: { pokeId: poke.getId() } }"
            >
              <div>
                <b-img
                  :src="poke.getImage()"
                  rounded="circle"
                  class="m-3"
                  thumbnail
                ></b-img>
                <p>{{ poke.nome | ucFirstWord }}</p>
              </div>
            </router-link>
            <b-card-body class="mt-n3">
              <span
                v-for="type in poke.data.types"
                :key="type"
                class="mx-2 px-2 py-1 border"
              >
                {{ type.type.name | ucFirstWord }}
              </span>
            </b-card-body>
          </b-overlay>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  updated() {
    console.log(this.$parent.pokemonsPorPagina);
  },
};
</script>

<style>
</style>