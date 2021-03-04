<template>
  <div v-if="item != null">
    <div>
      <img
        class="small"
        :class="{
          big: item.typ.charAt(0) == 'm',
          shinny: co(item.id),
          deactive: can(item.id),
        }"
        :src="getImage"
        @click="fun(item.id)"
      />
    </div>
    <div v-if="item.open.length > 0" class="flex-colum">
      <AccordionItem
        :can="can"
        :co="co"
        :fun="fun"
        :key="i.id"
        :item="i"
        v-for="i of item.open"
      />
    </div>
  </div>
</template>

<script>
import AccordionItem from "./Accordion.vue";

export default {
  name: "AccordionItem",
  components: {
    AccordionItem,
  },
  props: {
    item: {
      type: Object,
      required: false,
    },
    fun: {
      type: Function,
      required: false,
    },
    co: {
      type: Function,
      required: false,
    },
    can: {
      type: Function,
      required: false,
    },
  },
  computed: {
    getImage: function () {
      return this.images.find((x) => x.id == this.item.typ.substring(2)).img;
    },
    gettipp: function () {
      return this.choiselist.find((x) => this.item.typ == x.id);
    },
  },
};
</script>

<style scoped>
.flex-colum {
  border: 1px dotted darkgrey;
  display: flex;
  flex-flow: row wrap;
}
.small {
  cursor: pointer;
  width: 32px;
  height: 32px;
}
.big {
  width: 64px;
  height: 64px;
}
.deactive {
  filter: grayscale(100%);
  cursor: default;
}
.shinny {
  filter: drop-shadow(0px 0px 12px yellow) brightness(150%);
  cursor: default;
}
</style>