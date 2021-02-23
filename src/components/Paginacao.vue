<template>
  <div class="overflow-auto">
    <div>
      <h6>Goto first button number</h6>
      <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        first-number
      ></b-pagination>
    </div>
  </div>
</template>

<script>
export default {
  props: [rows],
  data() {
    return {
      rows: rows,
      currentPage: 1,
			perPage: 5,
    };
  },
};
</script>

<style>
/*  */
</style>