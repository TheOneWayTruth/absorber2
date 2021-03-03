<template>
  <div class="fixed">
    <button
      :class="{ active: this.$parent.active == 'fight' }"
      @click="openTab('fight')"
      class="btn"
      :disabled="this.$parent.enemy == null"
    >
      <img :src="require('@/assets/icons/auto.png')" alt="fight" />
    </button>
    <button
      :class="{ active: this.$parent.active == 'dungeon' }"
      @click="openTab('dungeon')"
      class="btn"
    >
      <img :src="require('@/assets/icons/cave.png')" alt="dungeon" />
    </button>
    <button
      :class="{ active: this.$parent.active == 'stats' }"
      @click="openTab('stats')"
      class="btn"
    >
      <img :src="require('@/assets/icons/hero.png')" alt="stats" />
    </button>
    <button
      :class="{ active: this.$parent.active == 'log' }"
      @click="openTab('log')"
      class="btn"
    >
      <img :src="require('@/assets/icons/log.png')" alt="log" />
    </button>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  data() {
    return {
      dungeonscroll: 0,
    };
  },
  methods: {
    openTab(t) {
      if (this.$parent.active == t) {
        return;
      }

      if (t != "dungeon") {
        this.dungeonscroll = $(window).scrollTop();
      }

      this.$parent.active = t;

      if (t == "dungeon") {
        this.$nextTick(() => {
          $(window).scrollTop(this.dungeonscroll);
        });
      }

      if (t == "stats") {
        this.$nextTick(() => {
          $(window).scrollTop(0);
        });
      }
    },
  },
};
</script>

<style>
.fixed {
  bottom: 0px;
  position: fixed;
  justify-content: space-between;
}

button:disabled {
  background: #ccc;
  filter: grayscale(100%) blur(1px);
}

.time {
  margin-right: 10px;
  font-size: 25px;
  color: white;
  font-family: "Courier", monospace;
}
</style>