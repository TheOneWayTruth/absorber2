<template>
  <div class="one">
    <img :src="getImage" />
    <transition name="fade" mode="out-in">
      <span :key="rounded(val)">{{ rounded(val) }}</span>
    </transition>
    <Tooltip2 v-if="tooltip" :item="pid" />
  </div>
</template>

<script>
export default {
  components: {
    Tooltip2: () =>
      import(
        /* webpackChunkName: "tooltips" */
        /* webpackMode: "lazy" */
        /* webpackPrefetch: true */ "./Tooltip2.vue"
      ),
  },
  props: {
    pid: {
      type: String,
      required: true,
    },
    val: {
      type: [String, Number],
      required: true,
    },
    tooltip: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  methods: {
    rounded(i) {
      if (typeof i == "number") {
        return parseFloat((Math.round(i * 100) / 100).toFixed(2));
      } else {
        return i;
      }
    },
  },
  computed: {
    getImage: function () {
      return this.images.find((x) => x.id == this.pid).img;
    },
  },
};
</script>

<style scoped>
.one {
  margin: 1px;
  height: 40px;
  width: 100px;
  line-height: 40px;
  white-space: nowrap;
  box-shadow: inset 0 0 2px #000000;
  padding: 5px;
}

.one img {
  margin: 4px;
  float: left;
}

.fade-enter-active {
  animation: fade 0.5s;
}

.resistance {
  background: lightcoral;
}
.effects {
  background: lightcyan;
}
.chance {
  background: lightgreen;
}
.basic {
  background: lightyellow;
}

@keyframes fade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>