<template>
  <div
    class="rows nearlyfullsize"
    :style="{
      backgroundImage: 'url(' + require('@/assets/icons/background.webp') + ')',
    }"
  >
    <div v-show="showbox" class="infobox box">
      <div class="flex">
        <button class="exit" @click="showbox = false">x</button>
        <button
          :class="{ active: this.smallbox == 'stats' }"
          @click="chooseSmallBox('stats')"
          class="btn small"
        >
          Stats
        </button>
        <button
          :class="{ active: this.smallbox == 'log' }"
          @click="chooseSmallBox('log')"
          class="btn small"
        >
          Log
        </button>
      </div>
      <div v-if="this.smallbox == 'stats'">
        <h2 class="title">{{ item.name }}</h2>
        <br />
        <div>
          <b>Stats:</b>
          <hr />
          <Statslist :item="filtred(item)" />
        </div>
        <br />
        <div>
          <b>Gain:</b>
          <hr />
          <Statslist :item="item.gain" />
        </div>
        <br />
        <div>
          <b>Description:</b>
          <hr />
          <Ability
            class="basic"
            style="white-space: normal; width: 200px; height: auto"
            :pid="'description'"
            :val="item.description"
          />
        </div>
      </div>
      <div v-if="this.smallbox == 'log'">
        <Log :mini="true" />
      </div>
    </div>
    <div class="row2 middle">
      <div>
        <div class="kasten">
          <div style="text-align: center; margin: 10px">
            {{ this.$parent.player.counter[item.id] }}/{{ getLast() }}
          </div>
        </div>
        <div>
          <img
            id="enemy"
            v-if="item.id"
            class="image"
            :src="getImgUrl(item.id)"
            :alt="item.name"
          />
          <span
            class="dmgind"
            :style="'color:' + ind.color"
            :key="k"
            v-for="(ind, k) in dmgind"
            >{{ ind.text }}</span
          >
        </div>

        <div style="overflow: hidden" class="flex">
          <div
            v-show="value > 0"
            class="kiste"
            :key="key"
            v-for="(value, key) in this.item.status"
          >
            {{ value }}
            <img class="icon" :src="getImgUrl('b' + key)" :alt="key" />
          </div>
        </div>
      </div>
      <div>
        <Progressbar :val="item.cspeed" :max="item.speed" :speed="true" />
        <Progressbar :val="item.clife" :max="item.life" />
      </div>
    </div>
    <button @click="showbox = !showbox" class="info">i</button>
    <div class="door" @click="exitFight()">
      <img :src="require('@/assets/icons/door.webp')" alt="back" />
    </div>
  </div>
</template>

<script>
import Log from "./Log.vue";
import Progressbar from "./Progressbar.vue";
import { checkTurn, respawn, getLast } from "./functions.js";
import Ability from "./Ability.vue";
import Statslist from "./Statslist.vue";
import { dmgind } from "./gloabals.js";

export default {
  name: "FightItem",
  components: {
    Statslist,
    Progressbar,
    Ability,
    Log,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      timer1: null,
      timer2: null,
      dmgind: dmgind,
      smallbox: "stats",
      showbox: false,
    };
  },
  methods: {
    chooseSmallBox(v) {
      this.smallbox = v;
    },
    getLast() {
      return getLast(this.item.max, this.$parent.player.prestige);
    },
    getImgUrl(id) {
      return this.images.find((x) => x.id == id).img;
    },
    filtred(arr) {
      let allowed = [
        "description",
        "name",
        "id",
        "boss",
        "clife",
        "cspeed",
        "status",
        "gain",
        "max",
        "prestige",
      ];

      return Object.keys(arr)
        .filter((key) => !allowed.includes(key))
        .reduce((obj, key) => {
          obj[key] = arr[key];
          return obj;
        }, {});
    },
    exit() {
      if (
        this.$parent.player.clife == this.$parent.player.life &&
        this.$parent.player.auto
      ) {
        this.$parent.setNextEnemy();
      } else {
        this.$parent.enemy = null;
        this.$parent.active == "fight" && (this.$parent.active = "dungeon");
      }
    },
    won() {
      this.$parent.player.go = true;
      this.$parent.player.auto = false;
      this.$parent.displayfinish();
    },
    exitFight() {
      this.$parent.enemy = null;
      this.$parent.player.auto = false;
      this.$parent.active = "dungeon";
    },
  },
  mounted() {
    this.$parent.recovery = false;
    this.$parent.player.counter[this.$parent.enemy.id] == null &&
      (this.$parent.player.counter[this.$parent.enemy.id] = 0);

    let player = this.$parent.player;

    player.lastEnemy = this.item.id;
    this.timer2 = setInterval(() => {
      checkTurn(player, this.item, this.won, this.exit, this.itemslist);
    }, 100);

    this.timer1 = setInterval(() => {
      checkTurn(this.item, player, this.won, this.exit, this.itemslist);
    }, 100);
  },
  beforeDestroy() {
    clearInterval(this.timer1);
    clearInterval(this.timer2);
    this.$parent.recovery = true;
    respawn(this.item);
  },
};
</script>

<style scoped>
.infobox {
  position: absolute;
  margin: 10px;
  padding: 0px;
  z-index: 1;
  opacity: 0.98;
  margin-bottom: 100px;
}

.box {
  box-shadow: inset 0 0 4px grey;
  border: 1px solid black;
  padding: 10px;
  background: lightgray;
  min-width: 220px;
  margin-bottom: 100px;
}

.small {
  padding: 2px;
  margin: 0px 4px 10px 4px;
  line-height: normal;
}
.kasten {
  box-shadow: inset 0 0 4px grey;
  border: 1px solid black;
  background: lightgray;
  border-radius: 10px;
}

.title {
  margin: 0px;
}

.fleo {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.rowside {
  overflow-y: scroll;
  height: 100px;
  float: left;
  min-width: 90vw;
  width: 25%;
  border-radius: 5px;
}

.middle {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
}

.kiste {
  background: darkgrey;
  padding: 1px;
  border: 1px solid black;
  line-height: 16px;
  height: 16px;
  margin: 2px;
}

.image {
  margin: 0px 10px;
  width: calc(80vw - 50px);
  image-rendering: pixelated;
}

.animated {
  animation: shake 0.2s linear;
}

.die {
  animation: spin 0.4s linear;
}

@keyframes shake {
  0% {
    transform: translate3d(-2px, 0, 0);
  }

  25% {
    transform: translate3d(2px, 0, 0);
  }

  50% {
    transform: translate3d(-4px, 0, 0);
  }

  100% {
    transform: translate3d(4px, 0, 0);
  }
}

@keyframes spin {
  100% {
    transform: rotate(90deg);
    opacity: 0;
  }
}

.name {
  text-align: center;
  padding: 10px;
  font-size: 20px;
}

.dmgind {
  position: absolute;
  left: 50%;
  font-size: 40px;
  font-weight: 500;
  animation: fly 1s linear;
}

@keyframes fly {
  0% {
    top: 50%;
    opacity: 1;
  }
  100% {
    top: 0%;
    opacity: 0;
  }
}

.itext {
  color: white;
  font-stretch: bold;
  padding: 0px 2px;
}

.icon {
  height: 16px;
  width: 16px;
  margin: 0px;
  float: right;
}

.nearlyfullsize {
  height: 100vh;
}

.exit {
  background: red;
  position: absolute;
  right: 10px;
  top: 10px;
  font-size: 20px;
}

.info {
  position: absolute;
  bottom: 100px;
  right: 20px;
  background: lightblue;
  border-radius: 50%;
  font-size: 30px;
  color: white;
  width: 40px;
  height: 40px;
}

.door {
  bottom: 100px;
  position: absolute;
  left: 20px;
}

.door img {
  width: 50px;
}
</style>