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
        <div class="text">
          <div>
            <span>
              Press
              <b>CTRL</b> for stats. <b>SHIFT</b> for description.
              <span v-show="$parent.player.prestige >= 3">
                <b>DRAG</b> to change fighting order.
              </span>
            </span>
          </div>
          <div>
            <button
              v-show="$parent.player.prestige >= 4"
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
              <span v-if="this.hidden">Hide Finished</span>
              <span v-else>Show Finished</span>
            </button>
            <button
              @click="autofight()"
              class="btn dun"
              :class="{ active: this.$parent.player.auto }"
            >
              <img :src="require('@/assets/icons/auto.webp')" alt="auto" />
              <span>Autofight</span>
            </button>
            <button
              v-show="$parent.player.prestige >= 3"
              class="btn dun"
              @click="resetOrder()"
            >
              <img :src="require('@/assets/icons/order.webp')" alt="auto" />
              <span>Reset Order</span>
            </button>
            <div v-show="$parent.player.prestige >= 5" style="float: right">
              <img
                style="padding: 5px; float: left"
                :src="require('@/assets/icons/search.webp')"
                alt="search"
              />
              <span
                v-show="searchv != ''"
                @click="closesearch"
                class="closesearch"
                >X</span
              >
              <input autocorrect="off" class="faker" v-model="searchv" />
            </div>
          </div>
        </div>
      </div>
      <div>
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
      <div style="margin: 10px" class="text">
        <Adsense
          data-ad-client="ca-pub-7494960732262742"
          data-ad-slot="9048863009"
        >
        </Adsense>
      </div>
    </div>
  </div>
</template>

<script>
import { getLast } from "./functions";
export default {
  name: "DungeonItem",
  components: {
    Enemy: () =>
      import(
        /* webpackPrefetch: true */
        /* webpackChunkName: "enemy" */
        /* webpackMode: "lazy" */ "./Enemy.vue"
      ),
  },
  data() {
    return {
      dragSrcEl: null,
      loading: true,
      hidden: true,
      searchv: "",
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
  min-height: 100px;
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
  width: 200px;
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
  transform: translate(180px);
  position: absolute;
}
</style>