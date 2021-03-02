<template>
  <div
    class="rows nearlyfullsize"
    :style="{
      backgroundImage: 'url(' + require('@/assets/icons/background.png') + ')',
    }"
  >
    <div class="rowside box">
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
    <div class="row2 middle">
      <div>
        <div class="kasten">
          <div style="text-align: center; margin: 10px">
            {{ this.$parent.player.counter[item.id] }}/{{ getLast() }}
          </div>
        </div>
        <div style="width: 200px">
          <img
            ref="eimage"
            v-if="item.id"
            class="image"
            id="enemy"
            :src="getImgUrl(item.id)"
            :alt="item.name"
          />
          <span class="dmgind" :style="'color:' + ind.color" :key="k" v-for="(ind, k) in dmgind">{{
            ind.text
          }}</span>
        </div>

        <div class="flex">
          <div v-show="value > 0" class="kiste" :key="key" v-for="(value, key) in this.item.status">
            {{ value }}
            <img class="icon" :src="getImgUrl('b' + key)" :alt="key" />
          </div>
        </div>
      </div>
      <Progressbar :val="item.cspeed" :max="item.speed" :speed="true" />
      <Progressbar :val="item.clife" :max="item.life" />
    </div>
    <div class="rowside box">
      <div class="flex">
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
        <h2 class="title">{{ $parent.player.name }}</h2>
        <br />
        <b>Stats:</b>
        <hr />
        <div class="fleo">
          <div class="fleo" :key="g" v-for="(n, g) in item.gain">
            <hr style="width: 200px" v-if="g == 'effects' || g == 'chance' || g == 'resistance'" />

            <div v-if="g != 'effects' && g != 'chance' && g != 'resistance'">
              <Ability class="basic" :pid="g" :val="$parent.player[g]" />
            </div>
            <div v-else-if="g == 'effects'" :key="i" v-for="(k, i) in item.gain.effects">
              <Ability
                v-if="$parent.player.effects[i] != undefined"
                :class="g"
                :pid="i"
                :val="$parent.player.effects[i]"
              />
            </div>
            <div v-else-if="g == 'chance'" :key="i" v-for="(k, i) in item.gain.chance">
              <Ability
                v-if="$parent.player.chance[i] != undefined"
                :class="g"
                :pid="i"
                :val="$parent.player.chance[i]"
              />
            </div>
            <div v-else-if="g == 'resistance'" :key="i" v-for="(k, i) in item.gain.resistance">
              <Ability
                v-if="$parent.player.resistance[i] != undefined"
                :class="g"
                :pid="i"
                :val="$parent.player.resistance[i]"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-if="this.smallbox == 'log'">
        <Log :mini="true" />
      </div>
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
      if (this.$parent.player.clife == this.$parent.player.life && this.$parent.player.auto) {
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
  },
  mounted() {
    this.$parent.recovery = false;
    this.$parent.player.counter[this.$parent.enemy.id] == null &&
      (this.$parent.player.counter[this.$parent.enemy.id] = 0);

    let player = this.$parent.player,
      classlist = this.$refs.eimage.classList;

    player.lastEnemy = this.item.id;
    this.timer2 = setInterval(() => {
<<<<<<< Updated upstream
      checkTurn(player, this.item, this.won, this.exit, this.$parent.kongregate, this.itemslist);
    }, 100);

    this.timer1 = setInterval(() => {
      checkTurn(this.item, player, this.won, this.exit, this.$parent.kongregate, this.itemslist);
=======
      checkTurn(player, this.item, this.won, this.exit, this.itemslist);
    }, 100);

    this.timer1 = setInterval(() => {
      checkTurn(this.item, player, this.won, this.exit, this.itemslist);
>>>>>>> Stashed changes
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
.box {
  box-shadow: inset 0 0 4px grey;
  border: 1px solid black;
  padding: 10px;
  background: lightgray;
  min-width: 220px;
  min-height: 400px;
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
  overflow: auto;
  height: 420px;
  float: left;
  min-width: 240px;
  width: 25%;
  border-radius: 5px;
}

.row2 {
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: 420px;
  float: left;

  width: 50%;
}

.middle {
  display: flex;
  flex-direction: column;
  align-items: center;
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
  width: 180px;
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
    margin: 0px 10px;
  }
  25% {
    margin: 0px 20px;
  }
  75% {
    margin: 0px 0px;
  }
  100% {
    margin: 0px 10px;
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
  height: calc(100% - 30px);
  min-height: calc(100vh - 90px);
  padding: 30px 10px 0px 10px;
  display: flex;
  align-content: space-between;
  align-items: baseline;
}

@media only screen and (max-height: 630px) {
  .nearlyfullsize {
    align-items: flex-start;
  }
}
</style>