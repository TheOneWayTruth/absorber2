<template>
  <div>
    <div v-if="!loading && preloaded">
      <div>
        <div class="fixed">
          <button
            :class="{ active: this.active == 'fight' }"
            v-if="this.enemy != null"
            @click="openTab('fight')"
            class="btn"
          >
            <img :src="require('@/assets/icons/auto.webp')" alt="fight" />
            Fight
          </button>
          <button
            :class="{ active: this.active == 'dungeon' }"
            @click="openTab('dungeon')"
            class="btn"
          >
            <img :src="require('@/assets/icons/cave.webp')" alt="dungeon" />
            Dungeon
          </button>
          <button
            :class="{ active: this.active == 'stats' }"
            @click="openTab('stats')"
            class="btn"
          >
            <img :src="require('@/assets/icons/hero.webp')" alt="stats" />
            Stats
          </button>
          <button
            :class="{ active: this.active == 'log' }"
            @click="openTab('log')"
            class="btn"
          >
            <img :src="require('@/assets/icons/log.webp')" alt="log" />
            Log
          </button>
          <button class="btn" v-show="this.enemy != null" @click="exitFight()">
            <img :src="require('@/assets/icons/door.webp')" alt="back" />
            Exit
          </button>

          <div class="time">{{ gettime(player.time) }}</div>
        </div>
        <div class="box">
          <Stats ref="stats" v-show="this.active == 'stats'" />
          <Dungeon ref="dun" v-show="this.active == 'dungeon'" />
          <Log v-show="this.active == 'log'" />
          <Fight
            v-if="this.enemy != null"
            v-show="this.active == 'fight'"
            :item="this.enemy"
          />
        </div>
      </div>
      <div class="status">
        <div
          v-show="value > 0"
          :key="key"
          v-for="(value, key) in this.player.status"
        >
          <img :src="getImgUrl('b' + key)" :alt="key" />
          <span>{{ value }}</span>
        </div>
      </div>
      <Progressbar :max="player.life" :val="player.clife" :ab="true" />
      <Progressbar
        v-show="this.enemy != null"
        :max="player.speed"
        :val="player.cspeed"
        :speed="true"
        :ab="true"
      />
      <Overlay :skilltree="skilltree" ref="ov" v-show="this.overlay" />
    </div>
    <div
      class="justfullsize"
      :style="{
        backgroundImage:
          'url(' + require('@/assets/icons/background.webp') + ')',
      }"
      v-else
    >
      <div class="loadmid">
        <div class="rotate">
          <img :src="require('@/assets/icons/hero.webp')" alt="loading" />
        </div>
        <span style="font-size: 40px">LOADING</span>
      </div>
    </div>
  </div>
</template>
<script>
import p from "./json/player.js";
import Stats from "./Stats.vue";
import Dungeon from "./Dungeon.vue";
import Log from "./Log.vue";
import Fight from "./Fight.vue";
import Progressbar from "./Progressbar.vue";
import Overlay from "./Overlay.vue";

import { RoundAll, getboni } from "./displayfunc";
import {
  respawn,
  getLast,
  getNodeById,
  getLastBoss,
  hasDuplicates,
  isEmpty,
} from "./functions.js";
import { log } from "./gloabals.js";

export default {
  name: "IndexItem",
  components: {
    Stats,
    Dungeon,
    Progressbar,
    Log,
    Overlay,
    Fight,
  },
  data() {
    return {
      active: "dungeon",
      player: p,
      preloaded: false,
      enemy: null,
      htimer: null,
      recovery: true,
      overlay: false,
      skilltree: false,
      cntrlIsPressed: false,
      shiftIsPressed: false,
      log: log,
      loading: true,
    };
  },
  methods: {
    ObjectLength(object) {
      var length = 0;
      for (var key in object) {
        if (object.hasOwnProperty(key)) {
          ++length;
        }
      }
      return length;
    },
    exitFight() {
      this.enemy = null;
      this.player.auto = false;
      this.active = "dungeon";
    },
    getImgUrl(id) {
      return this.images.find((x) => x.id == id).img;
    },
    recalculate(pl) {
      this.loading = true;
      this.enemy = null;
      let player = {};

      //reset player
      player.unlocked = [];
      player.effects = {};
      player.chance = {};
      player.resistance = {};
      player.life = 10;
      player.clife = 10;
      player.speed = 2500;
      player.cspeed = 0;
      player.magic = 1;
      player.regeneration = 0;
      player.recovery = 1;
      player.dmg = 1;
      player.sspeed = 0;
      player.status = {};
      player.version = p.version;
      player.items = [];
      player.maxitems = 1;

      //Get Stats from save

      if (!isEmpty(pl.highscore)) {
        player.highscore = pl.highscore;
      } else {
        player.highscore = {};
      }

      if (pl.allcount != undefined) {
        if (!isEmpty(pl.allcount)) {
          player.allcount = pl.allcount;
        } else {
          player.allcount = {};
          for (let en of this.enemieslist) {
            player.allcount[en.id] = 0;
          }
        }
      } else {
        player.allcount = {};
        for (let en of this.enemieslist) {
          player.allcount[en.id] = 0;
        }
      }

      pl.items != undefined && (player.items = pl.items);

      pl.unlocked != undefined && (player.unlocked = pl.unlocked);

      player.skills = pl.skills;
      player.order = pl.order;
      player.prestige = pl.prestige;
      player.name = pl.name;
      player.auto = pl.auto;
      player.time = pl.time;
      player.lastEnemy = pl.lastEnemy;

      if (isEmpty(pl.counter)) {
        player.counter = {};
        for (let en of this.enemieslist) {
          player.counter[en.id] = 0;
        }
      } else {
        player.counter = pl.counter;
      }

      for (let d in player.counter) {
        for (let a = 0; a < player.counter[d]; a++) {
          let e = this.enemieslist.find((a) => a.id === d);
          if (e != undefined) {
            this.SingleCalculation(e, player);
          }
        }
      }

      for (let b of player.skills) {
        let a = getNodeById(b, this.skillist);
        let c = this.choiselist.find((b) => b.id === a.typ);
        this.SingleCalculation(c, player);
      }

      if (null != player.items) {
        for (let d of player.items) {
          let e = this.itemslist.find((a) => a.id === d);
          if (e != null) {
            this.SingleCalculation(e, player);
          }
        }
      }

      //Reset order if new Enemys
      if (
        pl.order != undefined &&
        pl.order.length > 0 &&
        !hasDuplicates(player.order)
      ) {
        player.order = pl.order;
      } else {
        player.order = this.enemieslist.map(({ id: a }) => a);
      }

      //Reset push new enemies into order
      while (this.enemieslist.length > player.order.length) {
        player.order.push(this.enemieslist[player.order.length].id);
      }

      //Calculation Points via Prestige and Skills
      player.points = player.prestige - player.skills.length;

      //Checking if lastboss is killed
      if (0 < player.counter[getLastBoss(player)]) {
        player.go = true;
      }

      //check if too much items
      if (player.maxitems < player.items.length) {
        let w = player.items.length - player.maxitems;
        player.items.splice(-w, w);
      }

      this.player = player;
      respawn(this.player);
      this.loading = false;

      let el = this;
      setTimeout(() => {
        el.$refs.dun.$forceUpdate();
        6 != el.player.tutorial && el.tutorial();
      }, 100);
    },
    openTab(t) {
      this.active = t;
    },
    tutorial() {
      let ov = this.$refs.ov.$data;
      switch (this.player.tutorial) {
        case 0:
          this.overlay = true;
          ov.text = "Welcome";
          ov.img = "enemys/blue_slime";
          ov.obj = [
            {
              text: "next",
              func: this.tutorial,
            },
          ];
          break;
        case 1:
          ov.img = "";
          ov.text = "Killing Enemies will steal their stats..";
          ov.color = "rgba(0, 0, 0, 0)";
          ov.background = "tut";
          ov.obj = [
            {
              text: "next",
              func: this.tutorial,
            },
          ];
          break;

        case 2:
          ov.text = "and add them to yours";
          ov.background = "tut2";
          break;

        case 3:
          ov.text = "the goal is to kill the flying eye";
          ov.place = "30%";
          ov.img = "enemys/chulthuluseye";
          ov.color = "rgba(0, 0, 0, 0.4)";
          ov.background = "";
          break;

        case 4:
          ov.text = "have fun playing";
          ov.img = "enemys/bat";
          ov.obj = [
            {
              text: "start",
              func: this.tutorial,
            },
          ];
          break;

        case 5:
          this.overlay = false;
          break;

        default:
          break;
      }
      this.player.tutorial++;
    },
    SingleCalculation(obj, player) {
      for (let gain in obj.gain) {
        switch (gain) {
          case "health":
            if (player[gain] + obj.gain[gain] <= 1) {
              player[gain] = 1;
            } else {
              player[gain] += obj.gain[gain];
            }

            break;
          case "effects":
            this.addOrCreate(player.effects, obj.gain.effects);
            break;
          case "chance":
            this.addOrCreate(player.chance, obj.gain.chance);
            break;
          case "resistance":
            this.addOrCreate(player.resistance, obj.gain.resistance);
            break;
          case "speed":
            if (obj.gain.speed > 0) {
              if (player.speed - obj.gain.speed < 110) {
                player.speed = 110;
                player.sspeed += player.speed - 110 + obj.gain.speed;
              } else {
                player.speed -= obj.gain.speed;
              }
            } else {
              if (player.sspeed - obj.gain.speed * -1 >= 0) {
                player.sspeed += obj.gain.speed;
              } else {
                player.speed -= obj.gain.speed;
              }
            }
            break;

          default:
            player[gain] += obj.gain[gain];
            break;
        }
      }
    },
    addOrCreate(player, obj) {
      for (let b in obj) {
        if (player[b] == null) {
          player[b] = obj[b];
        } else {
          player[b] += obj[b];
        }
      }
    },
    displayfinish() {
      let ov = this.$refs.ov.$data,
        player = this.player;

      let obj = [
        {
          text: "continue",
          func: this.continue,
        },
        {
          text: "prestige",
          func: this.reset,
        },
      ];

      ov.place = "20%";
      ov.text = "You finished the game!";
      ov.img = "icons/finish";
      ov.obj = obj;

      this.overlay = true;
    },
    getLast: (j, p) => getLast(j, p),
    hardreset() {
      this.player.skills = [];
      this.player.prestige = -1;
      this.player.allcount = {};
      this.player.highscore = {};
      this.reset(this.player);
      this.overlay = false;
      this.save();
    },
    softreset() {
      this.player.skills = [];
      this.reset(this.player);
      this.player.prestige--;
      this.overlay = false;
      this.save();
    },
    reset() {
      this.player.prestige++;
      this.player.tutorial = 6;
      this.player.time = 0;
      this.player.go = false;

      for (let en of this.enemieslist) {
        this.player.counter[en.id] = 0;
      }

      this.recalculate(this.player);
      this.overlay = false;
    },
    continue() {
      this.overlay = false;
    },
    addskill(s) {
      this.player.skills.push(s.id);
      this.reset();
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
    setNextEnemy() {
      if (this.player.prestige >= 3) {
        for (let ind of this.player.order) {
          let e = this.enemieslist.find((e) => e.id == ind);
          if (
            this.player.counter[e.id] <
            this.getLast(e.max, this.player.prestige)
          ) {
            this.enemy = respawn(e);
            break;
          }
        }
      } else {
        let last = this.enemieslist.find((e) => e.id == this.player.lastEnemy);
        if (last != undefined) {
          if (
            this.player.counter[last.id] <
            this.getLast(last.max, this.player.prestige)
          ) {
            this.enemy = respawn(last);
          } else {
            this.enemy = null;
            this.player.auto = false;
            this.active = "dungeon";
          }
        }
      }
    },
    save() {
      if (typeof Storage !== "undefined" && !this.loading) {
        let save = JSON.parse(JSON.stringify(this.player));

        delete save.effects;
        delete save.chance;
        delete save.resistance;
        delete save.life;
        delete save.clife;
        delete save.speed;
        delete save.cspeed;
        delete save.magic;
        delete save.regeneration;
        delete save.recovery;
        delete save.dmg;
        delete save.status;
        delete save.points;
        delete save.sspeed;

        localStorage.setItem("saveGame", JSON.stringify(save));
      }
    },
    resetStatus(p) {
      for (let a of this.bufflist) p.status[a] = 0;
    },
    preloading() {
      var requireImage = require.context("../assets/enemys/", false, /\.webp$/);

      for (let a of this.enemieslist)
        this.images.push({
          id: a.id,
          img: requireImage("./" + a.id + ".webp"),
        });

      requireImage = require.context("../assets/skills/", false, /\.webp$/);

      for (let a of this.tippslist)
        this.images.push({
          id: a.id,
          img: requireImage("./" + a.id + ".webp"),
        });

      requireImage = require.context("../assets/buffs/", false, /\.webp$/);

      for (let a of this.bufflist)
        this.images.push({
          id: "b" + a,
          img: requireImage("./" + a + ".webp"),
        });

      requireImage = require.context("../assets/items/", false, /\.webp$/);

      for (let a of this.itemslist)
        this.images.push({
          id: a.id,
          img: requireImage("./" + a.id + ".webp"),
        });
      this.preloaded = true;
    },
  },
  mounted() {
    this.preloading();
    let el = this;

    null == localStorage.getItem("saveGame")
      ? el.recalculate(el.player)
      : el.recalculate(JSON.parse(localStorage.getItem("saveGame")));

    window.addEventListener("keydown", function () {
      "17" == event.which && (el.cntrlIsPressed = true);
      "16" == event.which && (el.shiftIsPressed = true);
    });

    window.addEventListener("keyup", function () {
      el.cntrlIsPressed = false;
      el.shiftIsPressed = false;
    });

    setInterval(() => {
      this.save();
    }, 60000);

    setInterval(() => {
      this.player.time += 1;
    }, 1000);

    this.htimer = setInterval(() => {
      if (this.recovery && !this.loading) {
        this.resetStatus(this.player);
        this.player.cspeed = 0;
        if (
          this.player.clife + this.player.recovery + this.player.regeneration <=
          this.player.life
        ) {
          let add = 0;
          if (this.player.recovery > 0) {
            add += this.player.recovery;
          }
          if (this.player.regeneration > 0) {
            add += this.player.regeneration;
          }
          if (add < 1) {
            add = 1;
          }
          if (0 > this.player.clife) {
            this.player.clife = add;
          } else {
            this.player.clife += add;
          }
        } else {
          this.player.clife = this.player.life;
          this.player.auto && this.setNextEnemy();
        }
      }
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.htimer);
  },
};
</script>

<style scoped>
.loading {
  background: black;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
}

.box {
  padding-top: 54px;
}

.fixed {
  border: 1px solid black;
  width: 100%;
  position: fixed;
  background: grey;
  display: flex;
  align-items: center;
  z-index: 2;
}

.time {
  margin-right: 10px;
  margin-left: auto;
  font-size: 25px;
  color: white;
  right: 10px;
}

.status {
  position: fixed;
  margin: 5px 5px;
  height: 40px;
  bottom: 60px;
  display: flex;
  flex-direction: row;
}

.status > div {
  background: darkgrey;
  padding: 1px 5px 1px 2px;
  border: 1px solid black;
  box-shadow: inset -1px -1px 2px grey;
  border-radius: 5px;
  margin: 0px 5px;
}

.status > div > span {
  line-height: 36px;
  color: white;
  font-stretch: bold;
}

.status > div > img {
  float: left;
  margin-right: 2px;
}

.loadmid {
  padding: 10px;
  border: 1px solid black;
  background-color: lightgray;
  border-radius: 5px;
  box-shadow: inset 0 0 4px grey;
  text-align: center;

  position: absolute;
  left: calc(50% - 100px);
  top: calc(50% - 200px);
}

.rotate img {
  image-rendering: pixelated;
  width: 200px;
  height: 200px;
  animation: rotate 1s infinite;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.justfullsize {
  height: 100vh;
}
</style>
