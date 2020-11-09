<template>
  <div
    class="fullsize"
    :style="{
      backgroundImage: 'url(' + require('@/assets/icons/background3.png') + ')',
    }"
  >
    <input autocorrect="off" class="faker" v-model="$parent.player.name" />
    <div style="display: flex">
      <button v-show="$parent.player.go" class="btn" @click="$parent.displayfinish">
        Prestige
        <img class="icons" :src="require('@/assets/icons/star.png')" alt="reset" />
      </button>
      <button v-show="$parent.player.prestige > 0" class="btn" @click="openskilltree">
        Skills
        <img class="icons" :src="require('@/assets/icons/skills.png')" alt="skills" />
      </button>
    </div>
    <div class="flex">
      <div>
        <div @click="openbase = !openbase" class="kiste dark title">
          <span>Base</span>
          <span v-if="openbase" style="float: right">▼</span>
          <span v-else style="float: right">▲</span>
        </div>
        <transition name="fade">
          <div v-show="openbase" class="kiste">
            <div class="innerbox">
              <Ability
                class="basic animateOpen"
                :key="key"
                v-for="(value, key) in show($parent.player)"
                :val="value"
                :pid="key"
              />
            </div>
          </div>
        </transition>
      </div>
      <div v-show="isEmpty($parent.player.chance)">
        <div @click="openchance = !openchance" class="kiste dark title">
          <span>Chances</span>
          <span v-if="openchance" style="float: right">▼</span>
          <span v-else style="float: right">▲</span>
        </div>
        <transition name="fade">
          <div v-show="openchance" class="kiste">
            <div class="innerbox">
              <Ability
                class="chance"
                :key="key + value"
                v-for="(value, key) in $parent.player.chance"
                :val="value"
                :pid="key"
              />
            </div>
          </div>
        </transition>
      </div>
      <div v-show="isEmpty($parent.player.effects)">
        <div @click="openeffects = !openeffects" class="kiste dark title">
          <span>Effects</span>
          <span v-if="openeffects" style="float: right">▼</span>
          <span v-else style="float: right">▲</span>
        </div>
        <transition name="fade">
          <div v-show="openeffects" class="kiste">
            <div class="innerbox">
              <Ability
                class="effects"
                :key="key + value"
                v-for="(value, key) in $parent.player.effects"
                :val="value"
                :pid="key"
              />
            </div>
          </div>
        </transition>
      </div>
      <div v-show="isEmpty($parent.player.resistance)">
        <div @click="openres = !openres" class="kiste dark title">
          <span>Resistance</span>
          <span v-if="openres" style="float: right">▼</span>
          <span v-else style="float: right">▲</span>
        </div>
        <transition name="fade">
          <div v-show="openres" class="kiste innerbox">
            <Ability
              class="resistance"
              :key="key + value"
              v-for="(value, key) in $parent.player.resistance"
              :val="value"
              :pid="key"
            />
          </div>
        </transition>
      </div>
      <div v-if="getAnyElement($parent.player.highscore) > 0">
        <div @click="openhigh = !openhigh" class="kiste dark title">
          <span>Highscore</span>
          <span v-if="openhigh" style="float: right">▼</span>
          <span v-else style="float: right">▲</span>
        </div>
        <transition name="fade">
          <div v-show="openhigh" class="kiste innerbox">
            <div :key="key + value" v-for="(key, value) in $parent.player.highscore">
              <div v-show="key > 0">
                <div class="valbox">
                  <span class="val">{{ key }}</span>
                  <img class="icon" v-if="value" :src="getImgUrl(value)" />
                </div>
                <Tooltip
                  :type="'text'"
                  :title="getRealEnemyName(value)"
                  :item="'killed in ' + key + ' seconds'"
                />
              </div>
            </div>
          </div>
        </transition>
      </div>
      <div v-if="getAnyElement($parent.player.allcount) > 0">
        <div @click="openall = !openall" class="kiste dark title">
          <span>All Scores</span>
          <span v-if="openall" style="float: right">▼</span>
          <span v-else style="float: right">▲</span>
        </div>

        <div v-show="openall" class="kiste innerbox">
          <div :key="key + value" v-for="(key, value) in $parent.player.allcount">
            <div v-show="key > 0">
              <div class="valbox">
                <span class="val">{{ key }}</span>
                <img class="icon" v-if="value" :src="getImgUrl(value)" />
              </div>
              <Tooltip
                :type="'text'"
                :title="getRealEnemyName(value)"
                :item="'killed ' + key + ' times'"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-show="isEmpty($parent.player.skills)">
        <div @click="openskills = !openskills" class="kiste dark title">
          <span>Skills</span>
          <span v-if="openskills" style="float: right">▼</span>
          <span v-else style="float: right">▲</span>
        </div>

        <div v-show="openskills" class="kiste fux">
          <div :key="value" v-for="(key, value) in groupSkills($parent.player.skills)">
            <div class="valbox">
              <img
                class="icon"
                :src="require('@/assets/skills/' + displayeskills(value) + '.png')"
              />
              <span class="val">{{ key }}</span>
            </div>
            <Tooltip
              :type="'text'"
              :title="displayeskills2(value).name"
              :item="displayeskills2(value).desc"
            />
          </div>
        </div>
      </div>
      <div v-if="companions.length > 0">
        <div style="width: 650px" @click="opencomp = !opencomp" class="kiste dark title">
          <span>Kongpanions</span>
          <span v-if="opencomp" style="float: right">▼</span>
          <span v-else style="float: right">▲</span>
        </div>
        <div style="width: 650px" v-show="opencomp" class="kiste innerbox">
          <div
            :class="{
              scomp: isSelectedC(value.id),
              comp: !isSelectedC(value.id),
            }"
            @click="selectComp(value.id)"
            :key="key"
            v-for="(value, key) in companions"
          >
            <img width="110" :src="value.normal_icon_url_small" />
            <div>{{ value.name }}</div>
            <div :key="value.name + d" v-for="(d, l) in getboni(value.tags).gain">
              <div v-if="l == 'chance'">
                <Ability
                  style="max-width: 90px"
                  :key="ld + ld"
                  v-for="(dl, ld) in d"
                  class="chance"
                  :val="dl"
                  :pid="ld"
                />
              </div>
              <div v-else>
                <Ability style="max-width: 90px" class="basic" :val="d" :pid="l" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="$parent.player.prestige > 5">
        <div style="width: 650px" @click="openitems = !openitems" class="kiste dark title">
          <span>Items</span>
          <span v-if="openitems" style="float: right">▼</span>
          <span v-else style="float: right">▲</span>
        </div>

        <div style="width: 650px" v-show="openitems" class="kiste innerbox">
          <div
            @click="EquipItem(value.id)"
            :class="{
              scomp: isEqupied(value.id),
              comp: !isEqupied(value.id),
            }"
            :key="key"
            v-for="(value, key) in getUnlocked()"
          >
            <img width="110" :src="getImgUrl(value.id)" :alt="value.name" />
            <div>{{ value.name }}</div>
            <Tooltip :item="value" :type="'item'" />
          </div>
          <div :key="value + key" v-for="(value, key) in getLocked()">
            <div class="comp" v-if="value.req != undefined">
              <img class="locked" width="110" :src="getImgUrl(value.id)" :alt="value.name" />

              <progress
                class="wprog"
                :max="value.req.count"
                :value="$parent.player.allcount[value.req.id]"
                style="width: 100px"
              ></progress>
              <Tooltip :type="'text'" :item="getPercent(value) + '% until Item is unlocked'" />
            </div>
          </div>
        </div>
      </div>
      <div class="ecke">
        <div class="boxbox">
          <h2>FILE</h2>
          <div style="display: flex">
            <button class="btn half" @click="exportSave">
              <img :src="require('@/assets/icons/export.png')" alt="Export" />
              <span>Export</span>
            </button>

            <button class="btn half" @click="importSave">
              <label
                for="import"
                style="cursor: pointer; display: flex; justify-content: center; flex-wrap: wrap"
              >
                <img :src="require('@/assets/icons/import.png')" alt="Import" />
                <span>Import</span>
              </label>
            </button>
          </div>
        </div>

        <input ref="import" id="import" accept="text/txt" type="file" />

        <div class="boxbox">
          <label v-if="$parent.cloud" class="switch">
            <input v-model="clouduse" type="checkbox" />
            <h2 class="slider round">
              <span v-if="!clouduse">LOCAL</span><span v-else>CLOUD</span>
            </h2>
          </label>
          <h2 v-else>LOCAL</h2>
          <div v-if="!clouduse" style="display: flex">
            <button class="btn half" @click="loadGame">
              <img :src="require('@/assets/icons/load.png')" alt="Load" />
              <span>Load</span>
            </button>

            <button class="btn half" @click="saveGame">
              <img :src="require('@/assets/icons/save.png')" alt="Save" />
              <span>Save</span>
            </button>
          </div>
          <div v-else>
            <span style="border: 1px solid red" v-show="beta">Dosnt work in Beta</span>
            <div style="display: flex">
              <button class="btn load half" @click="Cloudload">
                <img :src="require('@/assets/icons/cloudload.png')" alt="load" />
                <span>Load</span>
              </button>
              <button class="btn save half" @click="Cloudsave">
                <img :src="require('@/assets/icons/cloudsave.png')" alt="save" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>

        <div class="boxbox">
          <h2>RESET</h2>
          <div style="display: flex">
            <button class="btn half" @click="opensoft">
              <img :src="require('@/assets/icons/softreset.png')" alt="reset" />
              <span>Soft</span>
            </button>

            <button class="btn half" @click="openreset">
              <img :src="require('@/assets/icons/reset.png')" alt="reset" />
              <span>Hard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { debug } from "./gloabals.js";
import { copyToClipboard, getClipBoard, removeItemOnce } from "./functions";
import { getboni } from "./displayfunc";
import Ability from "./Ability.vue";
import Tooltip from "./Tooltip.vue";

export default {
  name: "StatsItem",
  components: { Ability, Tooltip },
  data() {
    return {
      dchance: null,
      deffects: null,
      dhighscore: null,
      companions: [],
      openbase: true,
      openchance: true,
      openeffects: true,
      openres: true,
      openhigh: true,
      openall: true,
      openskills: true,
      opencomp: true,
      openitems: true,
      clouduse: false,
    };
  },
  methods: {
    Cloudload() {
      let el = this;
      PlayFabClientSDK.GetUserData({
        SessionTicket: el.$parent.PlayFab,
      }).then(function (x) {
        el.$parent.player = JSON.parse(x.data.Data.save.Value);
        console.log("loaded");
      });
    },
    Cloudsave() {
      let el = this;

      var d = {
        Data: { save: JSON.stringify(this.$parent.player) },
      };

      PlayFabClientSDK.UpdateUserData(d).then(function (x) {
        console.log("saved");
      });
    },
    getAnyElement(obj) {
      var sum = 0;
      for (var el in obj) {
        if (obj.hasOwnProperty(el)) {
          sum += parseFloat(obj[el]);
        }
      }

      return sum;
    },
    isEmpty(o) {
      return Object.keys(o).length !== 0;
    },
    getPercent(e) {
      if (this.$parent.player.allcount != undefined) {
        let p = Math.round((this.$parent.player.allcount[e.req.id] * 100) / e.req.count);
        if (p >= 100) {
          p = 100;
        }
        return p;
      }
      return false;
    },
    getUnlocked() {
      let el = this;
      if (el.$parent.player.unlocked != undefined) {
        return this.itemslist.filter((x) => el.$parent.player.unlocked.includes(x.id));
      } else {
        return false;
      }
    },
    getLocked() {
      let el = this;
      if (el.$parent.player.unlocked != undefined) {
        let list = this.itemslist.filter((x) => !el.$parent.player.unlocked.includes(x.id));

        return list.sort((a, b) => this.getPercent(b) - this.getPercent(a));
      } else {
        return true;
      }
    },
    getboni(tags) {
      return getboni(tags);
    },
    selectComp(e) {
      this.$parent.player.companion = e;
      this.$parent.recalculate(this.$parent.player);
    },
    EquipItem(item) {
      if (this.$parent.player.items.includes(item)) {
        removeItemOnce(this.$parent.player.items, item);
      } else if (this.$parent.player.items.length >= this.$parent.player.maxitems) {
        this.$parent.player.items.shift();
        this.$parent.player.items.push(item);
      } else {
        this.$parent.player.items.push(item);
      }
      this.$parent.recalculate(this.$parent.player);
    },
    isSelectedC(comp) {
      return !(this.$parent.player.companion != comp);
    },
    isEqupied(item) {
      if (this.$parent.player.items != undefined && item != undefined) {
        return this.$parent.player.items.includes(item);
      }
      return false;
    },
    reverse(str) {
      return str.split("").reverse().join("");
    },
    loadGame() {
      if (null != localStorage.getItem("saveGame")) {
        let a = JSON.parse(localStorage.getItem("saveGame"));
        this.$parent.recalculate(a);
      }
    },
    saveGame() {
      this.$parent.save();
    },
    exportSave() {
      if (this.beta) {
        copyToClipboard(JSON.stringify(this.$parent.player));
      } else {
        copyToClipboard(this.reverse(btoa(this.reverse(JSON.stringify(this.$parent.player)))));
      }

      this.$parent.log.push("<div>Save was downloaded</div>");
    },
    getRealEnemyName(id) {
      return this.enemieslist.find((x) => x.id == id).name;
    },
    importSave() {
      let el = this;
      this.$refs.import.addEventListener("change", function () {
        if (this.files && this.files[0]) {
          var reader = new FileReader();

          reader.addEventListener("load", function (e) {
            let r = {};
            try {
              r = JSON.parse(e.target.result);
            } catch {
              r = JSON.parse(el.reverse(atob(el.reverse(e.target.result))));
            }

            el.$parent.recalculate(r);
            el.$parent.log.push("<div>Save was loaded</div>");
          });

          reader.readAsBinaryString(this.files[0]);
        }
      });
      this.saveGame();
    },
    groupSkills(list) {
      let obj = {};

      list.reduce(function (rv, x) {
        x = x.substring(0, x.length - 1);
        x in obj ? obj[x]++ : (obj[x] = 1);
      }, {});
      return obj;
    },
    openreset() {
      let ov = this.$parent.$refs.ov.$data;
      ov.text = "Do you really want to wipe your entire save?";
      ov.place = "12.5%";
      ov.obj = [
        { text: "Yes", func: this.$parent.hardreset },
        { text: "No", func: this.closereset },
      ];
      ov.img = "icons/reset";
      this.$parent.overlay = true;
    },
    opensoft() {
      let ov = this.$parent.$refs.ov.$data;
      ov.text = "Do you really want to wipe your current run?";
      ov.place = "12.5%";
      ov.obj = [
        { text: "Yes", func: this.$parent.softreset },
        { text: "No", func: this.closereset },
      ];
      ov.img = "icons/softreset";
      this.$parent.overlay = true;
    },
    closereset() {
      this.$parent.overlay = false;
    },
    displayeskills(a) {
      return this.choiselist.find((b) => b.id === a).id.substring(2);
    },
    displayeskills2(a) {
      return this.choiselist.find((b) => b.id === a);
    },
    openskilltree() {
      this.$parent.skilltree = true;
      this.$parent.overlay = true;
    },
    getImgUrl(id) {
      return this.images.find((x) => x.id == id).img;
    },
    show(p) {
      let pl = JSON.parse(JSON.stringify(p));
      delete pl.name;
      delete pl.status;
      delete pl.counter;
      delete pl.go;
      delete pl.unlocked;
      delete pl.allcount;
      delete pl.companion;
      delete pl.skills;
      delete pl.time;
      delete pl.items;
      delete pl.auto;
      delete pl.debug;
      delete pl.tutorial;
      delete pl.order;
      delete pl.cspeed;
      delete pl.clife;
      delete pl.lastEnemy;
      delete pl.resistance;
      delete pl.version;
      delete pl.effects;
      delete pl.highscore;
      delete pl.chance;
      return pl;
    },
  },
  created() {
    let boot = setInterval(() => {
      if (this.$parent.kongregate != null) {
        if (!this.$parent.kongregate.services.isGuest() || this.beta) {
          let user = "";
          if (this.beta) {
            if (this.$parent.player.name == "showmethemoney") {
              user = "dirkf17";
            } else {
              user = this.$parent.player.name;
            }
          } else {
            user = this.$parent.kongregate.services.getUsername();
          }

          let el = this;
          let link = "https://api.kongregate.com/api/kongpanions.json?username=" + user;
          $.getJSON(link, function (data) {
            if (data.success) {
              el.companions = data.kongpanions;
              if (el.$parent.player.companion == 0) {
                el.$parent.player.companion = el.companions[0].id;
              }
            }
          });
        }
        clearInterval(boot);
      }
    }, 500);
  },
};
</script>

<style scoped>
.title {
  width: 310px;
  margin: 4px;
}
.half {
  padding: 3px;
  margin: 6px;
  display: flex;
  flex-wrap: wrap;
  width: 70px;
  justify-content: center;
}

#import {
  display: none;
}
.val {
  line-height: 25px;
  font-size: 14px;
}

.icon {
  float: left;
  width: 25px;
  height: 25px;
  margin-right: 5px;
}

.faker {
  display: block;
  width: 600px;
  border: 1px solid black;
  box-shadow: inset 0 0 4px grey;
  border-radius: 10px;
  background: lightgrey;
  outline: none;
  padding: 10px;
  margin: 10px;
  font-size: 30px;
  font-weight: bold;
  cursor: text;
  font-family: "MedievalSharp", cursive;
}

.boxbox {
  margin: 3px 0px;
  text-align: center;
  border: 1px solid black;
  background: silver;
  border-radius: 4px;
  box-shadow: inset 0 0 4px grey;
}
.boxbox h2 {
  margin: 3px;
}

.flex {
  align-items: flex-start;
}

.kiste {
  margin: 5px;
  padding: 10px;
  width: 310px;
  border: 1px solid black;
  background-color: lightgray;
  border-radius: 5px;
  box-shadow: inset 0 0 4px grey;
  min-width: 100px;
}
.innerbox {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}
.icons {
  width: 32px;
  height: 32px;
  margin-right: 5px;
}

.valbox {
  margin: 5px;
  padding: 2px;
  width: 80px;
  white-space: nowrap;
  border: 0.5px solid black;
  background: gold;
}

.ecke {
  display: flex;
  flex-direction: column;
  position: fixed;
  bottom: 65px;
  right: 20px;
}

.import {
  padding: 0px;
}

.import > label {
  padding: 10px;
  display: inline-block;
  width: 100%;
  height: 100%;
  margin: 0px;
}
.comp {
  min-height: 120px;
  margin: 5px;
  border: 3px dotted grey;
  padding: 5px;
  max-width: 100px;
  text-align: center;
}
.comp img {
  width: 100px;
}
.scomp img {
  width: 100px;
}
.scomp {
  margin: 5px;
  width: 100px;
  border: 3px solid yellow;
  padding: 5px;
  text-align: center;
}

.locked {
  filter: blur(4px) grayscale(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.dark {
  background: darkgrey;
  transition: background-color 0.5s ease;
}
.dark:hover {
  background: yellowgreen;
}

.wprog {
  -webkit-appearance: none;
}

::-webkit-progress-bar {
  color: green;
  background-color: #777777;
  border-radius: 5px;
}

::-webkit-progress-value {
  border-radius: 5px;
}
.switch {
  position: relative;
  display: inline-block;
  width: 140px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  text-align: center;
  line-height: 34px;
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 1px;
  background-color: white;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: white;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  transform: translateX(100px);
  background: grey;
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>