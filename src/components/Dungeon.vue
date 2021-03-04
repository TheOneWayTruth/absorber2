<template>
  <div
    class="fullsize"
    :style="{
      backgroundImage:
        'url(' + require('@/assets/icons/background2.webp') + ')',
    }"
  >
    <div>
      <div>
        <div class="text fixbox">
          <div v-show="opensearch">
            <span
              v-show="searchv != ''"
              @click="closesearch"
              class="closesearch"
              >X</span
            >
            <input autocorrect="off" class="faker" v-model="searchv" />
          </div>
          <div v-show="openbar" class="flex">
            <button
              class="btn dun"
              @click="hideUnhide()"
              :class="{ active: !this.hidden }"
            >
              <img
                v-if="this.hidden"
                :src="require('@/assets/icons/visible.webp')"
                alt="visible"
              />
              <img
                v-else
                :src="require('@/assets/icons/hidden.webp')"
                alt="hidden"
              />
            </button>
            <button
              @click="autofight()"
              class="btn dun"
              :class="{ active: this.$parent.player.auto }"
            >
              <img :src="require('@/assets/icons/auto.webp')" alt="auto" />
            </button>
            <button class="btn dun" @click="resetOrder()">
              <img :src="require('@/assets/icons/order.webp')" alt="auto" />
            </button>
            <button class="btn dun" @click="opensearch = !opensearch">
              <img :src="require('@/assets/icons/search.webp')" alt="auto" />
            </button>
          </div>

          <div class="time" @click="openbar = !openbar">
            {{ gettime(this.$parent.player.time) }}
            <div style="float: right; color: black">
              <span v-show="!openbar">▼</span>
              <span v-show="openbar">▲</span>
            </div>
          </div>
        </div>
      </div>
      <div style="margin-top: 20px">
        <div>
          <div class="flex">
            <div :key="key" v-for="(value, key) in getPrestigeEnemys()">
              <Enemy
                :min="getcount(value.id)"
                :max="getLast(value.max)"
                :value="value"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="text">
        Any similarity with other books, games or movies is just coincidence and
        results from your fertile imagination.
      </div>
    </div>
  </div>
</template>

<script>
import Enemy from "./Enemy.vue";
import { getLast } from "./functions";
export default {
  name: "DungeonItem",
  components: { Enemy },
  data() {
    return {
      dragSrcEl: null,
      loading: true,
      hidden: true,
      searchv: "",
      openbar: false,
      opensearch: false,
    };
  },
  methods: {
    closesearch() {
      this.searchv = "";
    },
    hideUnhide() {
      this.hidden = !this.hidden;
    },
    autofight() {
      this.$parent.player.auto = !this.$parent.player.auto;
    },
    resetOrder() {
      this.$parent.player.order = this.enemieslist.map(({ id: a }) => a);
    },
    getcount(id) {
      this.$parent.player.counter[id] == null &&
        (this.$parent.player.counter[id] = 0);
      return this.$parent.player.counter[id];
    },
    getLast(v) {
      return getLast(v, this.$parent.player.prestige);
    },
    gettime(a) {
      var b = parseInt(a, 10),
        c = Math.floor(b / 3600),
        d = Math.floor((b - 3600 * c) / 60),
        e = b - 3600 * c - 60 * d;
      return (
        10 > c && (c = "0" + c),
        10 > d && (d = "0" + d),
        10 > e && (e = "0" + e),
        0 < c ? c + ":" + d + ":" + e : 0 < d ? d + ":" + e : e
      );
    },
    getPrestigeEnemys() {
      let list = [],
        el = this;

      for (let a of this.$parent.player.order) {
        list.push(this.enemieslist.find((b) => a == b.id));
      }

      return list.filter(function (x) {
        if (
          (el.searchv != "" && el.searchv in x.gain) ||
          (x.gain.chance != null && el.searchv in x.gain.chance) ||
          (x.gain.effects != null && el.searchv in x.gain.effects) ||
          (x.gain.resistance != null && el.searchv in x.gain.resistance)
        ) {
          return true;
        }
        if (el.searchv != "" && !x.name.match(new RegExp(el.searchv, "i"))) {
          return false;
        }
        if (
          x.prestige != null &&
          x.prestige != undefined &&
          el.search != x.name
        ) {
          return el.$parent.player.prestige >= x.prestige;
        }
        return true;
      });
    },
  },
};
</script>

<style scoped>
.dun {
  min-width: 64px;
  margin: 5px;
}
.dun img {
  width: 64px;
  height: auto;
}

.fullsize {
  padding-top: 80px;
}

.flex {
  justify-content: space-around;
}

.fixbox {
  position: fixed;
  bottom: 75px;
  width: calc(100% - 12px);
  margin: 0px -10px;
  padding: 5px;
  z-index: 2;
  display: flex;
  flex-direction: column;
}

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

.faker {
  display: block;
  width: calc(100% - 20px);
  border: 1px solid black;
  box-shadow: inset 0 0 4px grey;
  border-radius: 2px;
  background: lightgrey;
  outline: none;
  padding: 2px;
  margin: 5px;
  font-size: 28px;
  font-weight: bold;
  cursor: text;
  font-family: "MedievalSharp", cursive;
}

.closesearch {
  padding: 2px;
  margin: 5px;
  float: right;
  color: red;
  font-size: 28px;
  cursor: pointer;
  transform: translate(85vw);
  position: absolute;
}
.text {
  font-size: 22px;
}
</style>