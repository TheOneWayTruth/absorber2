<template>
  <div class="fleo">
    <div :key="g" v-for="(n, g) in item">
      <div
        class="fleo"
        v-if="g == 'effects' || g == 'chance' || g == 'resistance'"
      >
        <hr style="min-width: 200px; width: 100%" />
        <div :key="gi" v-for="(gn, gi) in item[g]">
          <Ability :class="g" :pid="gi" :val="gn" />
        </div>
      </div>
      <Ability v-else :pid="g" class="basic" :val="n" />
    </div>
  </div>
</template>

<script>
export default {
  name: "Statslist",
  components: {
    Ability: () =>
      import(
        /* webpackPrefetch: true */
        /* webpackChunkName: "tooltips" */
        /* webpackMode: "lazy" */ "./Ability.vue"
      ),
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.fleo {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>