<template>
  <div>
    <div style="display: flex">
      <div
        v-show="this.$parent.hidden || !checkready(value)"
        :class="{ ready: checkready(value) }"
        @click.middle="cheat"
        @click="selectEnemy(value)"
        @dragstart="handleDragStart"
        @dragend="handleDragEnd"
        @dragover="handleDragOver"
        @dragenter="handleDragEnter"
        @dragleave="handleDragLeave"
        @drop="handleDrop"
        :draggable="isDragable()"
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
      <Tooltip
        v-show="!dragging"
        :shift="$parent.$parent.shiftIsPressed"
        :ctrl="$parent.$parent.cntrlIsPressed"
        :item="value"
      />
    </div>
  </div>
</template>

<script>
import Tooltip from "./Tooltip.vue";

import { respawn } from "./functions";
export default {
  name: "Enemy",
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
  components: {
    Tooltip,
  },
  data() {
    return {
      dragging: false,
    };
  },
  methods: {
    isDragable() {
      return this.$parent.$parent.player.prestige >= 3;
    },
    handleDragStart(e) {
      this.dragging = true;
      this.$parent.dragSrcEl = e.target.id;
      $(e.target).css("opacity", "0.5");
      e.dataTransfer.effectAllowed = "move";
    },
    handleDragOver(e) {
      e.preventDefault && e.preventDefault();
      return false;
    },
    handleDragEnter(e) {
      $(this).addClass("over");
    },
    handleDragLeave(e) {
      $(this).removeClass("over");
    },
    handleDrop(e) {
      e.stopPropagation && e.stopPropagation();

      if (e.target.id != this.$parent.dragSrcEl) {
        let ord = this.$parent.$parent.player.order;
        let saveid = this.$parent.dragSrcEl;
        ord.splice(ord.indexOf(saveid), 1);
        ord.splice(ord.indexOf(e.target.id), 0, saveid);
        this.$parent.$forceUpdate();
      }
      return false;
    },
    handleDragEnd(e) {
      this.dragging = false;
      $(".kiste").removeClass("over");
      $(".kiste").css("opacity", "1");
    },
    cheat() {
      if (this.$parent.$parent.player.name == "showmethemoney" && this.beta) {
        this.$parent.$parent.player.counter[this.value.id] = this.max;
        this.$parent.$parent.player.allcount[this.value.id] += this.max;
        this.$parent.$parent.recalculate(this.$parent.$parent.player);
      }
    },
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
  font-size: 14px;
  user-select: none;
  cursor: pointer;
  background: whitesmoke;
  margin: 10px;
  padding: 10px;
  border: 1px solid black;
  text-align: center;
  width: 80px;
  min-height: 140px;
  box-shadow: inset -2px -2px 2px lightgray;
  transition: 0.1s;
}
.kiste:hover {
  background: lightgray;
  box-shadow: inset -2px -2px 2px grey;
  transform: translate(0px, -10px);
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
.ready:hover {
  background: lightcoral;
  box-shadow: inset -2px -2px 2px #ec5f5f;
  transform: translate(0px, 0px);
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