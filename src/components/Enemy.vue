<template>
  <div>
    <div style="display: flex">
      <div
        v-show="this.$parent.hidden || !checkready(value)"
        :class="{
          ready: checkready(value),
          fighting: value == $parent.$parent.enemy,
        }"
        @click="selectEnemy(value)"
        class="kiste"
        :id="value.id"
      >
        <div>
          <div>{{ min }} / {{ max }}</div>
          <br />
          <img
            v-if="value.id"
            class="image"
            :src="getImage"
            :alt="value.name"
          />
          <br />
          {{ value.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { respawn } from "./functions";

export default {
  name: "EnemyItem",
  props: {
    value: {
      type: Object,
      required: true,
    },
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      dragging: false,
    };
  },

  methods: {
    checkready(a) {
      return null != a && this.min >= this.max;
    },
    selectEnemy(t) {
      if (!this.checkready(t)) {
        this.$parent.$parent.enemy = respawn(t);
        this.$parent.$parent.active = "fight";
      }
    },
  },
  computed: {
    getImage: function () {
      return this.images.find((x) => x.id == this.value.id).img;
    },
  },
};
</script>

<style scoped>
.kiste {
  border-radius: 5%;
  font-size: 25px;
  user-select: none;
  cursor: pointer;
  background: whitesmoke;
  margin: 5px;
  padding: 10px;
  border: 1px solid black;
  text-align: center;
  width: calc((100vw - 92px) / 2);
  min-height: 300px;
  box-shadow: inset -2px -2px 2px lightgray;
  transition: 0.1s;
}

.fighting {
  background: lightgray;
  box-shadow: inset -2px -2px 2px grey;
  transform: scale(0.9);
}

.kiste img {
  user-select: none;
  width: 100%;
  display: block;
  margin-left: auto;
  margin-right: auto;
  pointer-events: none;
}

.kiste * {
  pointer-events: none;
}

.ready {
  background: lightcoral;
  box-shadow: inset -2px -2px 2px #ec5f5f;
}

.fade-enter-active {
  animation: fade 0.4s;
}

@keyframes fade {
  0% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>