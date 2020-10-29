<template>
  <div>
    <div v-show="!skilltree">
      <img
        v-if="this.background != ''"
        class="bc"
        :src="require('@/assets/icons/' + this.background + '.png')"
      />
      <div class="overlay" :style="'background-color:' + this.color">
        <div class="box" :style="'left:' + this.place">
          <div style="font-size: 30px">{{ text }}</div>
          <div>
            <img
              style="image-rendering: pixelated"
              width="200px;"
              v-if="this.img != ''"
              :src="require('@/assets/' + this.img + '.png')"
            />
          </div>
          <div class="flex" style="width: 100%">
            <div class="btn" :key="k" v-for="(thing, k) in obj" @click="thing.func">
              <div>{{ thing.text }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="skilltree">
      <div class="overlay" :style="'background-color:' + this.color">
        <div
          class="kiste"
          :style="{
            backgroundImage: 'url(' + require('@/assets/icons/background.png') + ')',
          }"
        >
          <button class="btn close" @click="close">X</button>
          <div class="points">Points: {{ this.$parent.player.points }}</div>
          <button class="btn reset" @click="resetskills">Reset</button>
          <div class="allskills">
            <div>
              <div>Damage</div>
              <Accordion
                :can="this.canBeChoosen"
                :co="this.choosen"
                :fun="this.chooseskill"
                :item="st[0]"
              />
            </div>
            <div>
              <div>Magic</div>
              <Accordion
                :can="this.canBeChoosen"
                :co="this.choosen"
                :fun="this.chooseskill"
                :item="st[1]"
              />
            </div>
            <div>
              <div>Speed</div>
              <Accordion
                :can="this.canBeChoosen"
                :co="this.choosen"
                :fun="this.chooseskill"
                :item="st[2]"
              />
            </div>
            <div>
              <div>Health</div>
              <Accordion
                :can="this.canBeChoosen"
                :co="this.choosen"
                :fun="this.chooseskill"
                :item="st[3]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import skilltree from "./json/skilltree.json";
import Accordion from "./Accordion.vue";
import { getParentById, getNodeById } from "./functions.js";

export default {
  name: "OverlayItem",
  components: {
    Accordion,
  },
  methods: {
    chooseskill(s) {
      if (!this.choosen(s) && this.$parent.player.points > 0 && !this.canBeChoosen(s)) {
        this.$parent.player.skills.push(s);
        this.$parent.player.points--;
        this.$parent.recalculate(this.$parent.player);
      }
    },
    resetskills() {
      this.$parent.player.skills = [];
      this.$parent.recalculate(this.$parent.player);
    },
    choosen(s) {
      return this.$parent.player.skills.includes(s);
    },
    close() {
      this.$parent.overlay = false;
      this.$parent.skilltree = false;
    },
    canBeChoosen(s) {
      let f = getNodeById(s, this.skillist);
      if (this.choosen(f.parent) || f.parent == "first") {
        return false;
      }
      return true;
    },
  },
  props: {
    skilltree: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      text: "",
      obj: [],
      img: "",
      background: "",
      color: "rgba(0, 0, 0, 0.4)",
      place: "40%",
      st: skilltree,
    };
  },
};
</script>

<style scoped>
.allskills {
  display: flex;
  flex-flow: row wrap;
  margin: 100px 10px;
}

.allskills > div {
  background: lightgray;
  margin-left: 10px;
  padding: 20px;
  display: block;
  min-width: 300px;
  border-radius: 5px;
  border: 1px solid black;
  box-shadow: inset 0 0 4px grey;
  margin: 5px;
}

.allskills > div > div:first-of-type {
  font-size: 25px;
  margin-bottom: 15px;
}

.bc {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
}

.flex {
  width: 500px;
  justify-content: space-around;
  align-items: center;
}

.box {
  text-align: center;
  background: grey;
  top: 25%;
  position: absolute;
  padding: 20px;
  border: 1px solid black;
  border-radius: 5px;
}
.overlay {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 11;
}
.close {
  padding: 5px 10px;
  position: fixed;
  background: red;
  right: 30px;
  top: 20px;
  box-shadow: 0 4px #660000;
}

.close:hover {
  background: red;
}
.points {
  font-size: 20px;
  position: fixed;
  padding: 10px;
  background: darkgrey;
  right: 100px;
  top: 30px;
  border-radius: 5px;
  box-shadow: inset 0 0 4px grey;
  border: 1px solid black;
}
.kiste {
  position: relative;
  margin: 10px;
  width: calc(100% - 40px);
  height: calc(100% - 40px);
  background: grey;
  padding: 10px;
  border: 1px solid black;
  border-radius: 4px;
  display: flex;
  overflow: auto;
}

.reset {
  z-index: 1;
  position: fixed;
  background: red;
  right: 230px;
  top: 20px;
  box-shadow: 0 4px #cc0000;
}
.reset:hover {
  background: #cc0000;
  box-shadow: 0 4px #b30000;
}
.reset:active {
  box-shadow: 0 1px #b30000;
}
</style>