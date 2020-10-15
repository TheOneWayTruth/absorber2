<template>
  <div>
    <div
      v-if="!mini"
      class="fullsize"
      :style="{
        backgroundImage:
          'url(' + require('@/assets/icons/background2.png') + ')',
      }"
    >
      <div style="display: flex;  align-content: flex-end">
        <button
          :class="{ active: !this.attacks }"
          @click="toggleLog('attacks')"
          class="btn dun"
        >
          basic
        </button>
        <button
          :class="{ active: !this.chance }"
          @click="toggleLog('chance')"
          class="btn dun"
        >
          chance
        </button>
        <button
          :class="{ active: !this.crit }"
          @click="toggleLog('crit')"
          class="btn dun"
        >
          crit
        </button>
        <button
          :class="{ active: !this.effects }"
          @click="toggleLog('effects')"
          class="btn dun"
        >
          effects
        </button>
        <button
          :class="{ active: !this.death }"
          @click="toggleLog('death')"
          class="btn dun"
        >
          death
        </button>
      </div>
      <div class="flex">
        <div class="box">
          <div :key="l" v-for="(c, l) in getLog()">
            <div class="one" v-html="c"></div>
          </div>
        </div>
        <div class="credits">
          <a
            class="abs"
            style="right: 80px"
            target="_blank"
            href="https://discord.gg/gUwvjw2"
          >
            <img :src="require('@/assets/icons/discord.png')" alt="discord" />
          </a>

          <a
            class="abs"
            target="_blank"
            style="right: 140px"
            href="https://www.paypal.com/paypalme/wickalexander"
          >
            <img :src="require('@/assets/icons/paypal.png')" alt="paypal" />
          </a>
          <a
            class="abs"
            target="_blank"
            style="right: 200px"
            href="https://twitter.com/schlauewurst"
          >
            <img :src="require('@/assets/icons/twitter.png')" alt="Twitter" />
          </a>
          <a
            class="abs"
            target="_blank"
            style="right: 20px"
            href="https://www.patreon.com/schlauewurst"
          >
            <img :src="require('@/assets/icons/patreon.jpg')" alt="patreon" />
          </a>
          <a
            class="abs"
            target="_blank"
            style="right: 260px"
            href="https://shop.spreadshirt.de/Absorber/"
          >
            <img
              :src="require('@/assets/icons/spreadshirt.png')"
              alt="spreadshirt"
            />
          </a>
          <div
            v-if="!mini"
            @click="openChange()"
            class="abs clickable"
            style="left: 20px"
          >
            {{ this.$parent.player.version }}
          </div>
        </div>
      </div>
      <div v-show="openedChange" class="box overlay">
        <div class="close" @click="closeChange()">x</div>
        <div :key="l.version" v-for="l in getChangeLog()">
          <h3>{{ l.version }}</h3>
          <div :key="number" v-for="(text, number) in l.info">{{ text }}</div>
        </div>
      </div>
    </div>
    <div v-else>
      <div style="display: flex; flex-wrap: wrap; max-width: 200px">
        <button
          :class="{ active: !this.attacks }"
          @click="toggleLog('attacks')"
          class="btn dun dum"
        >
          basic
        </button>
        <button
          :class="{ active: !this.chance }"
          @click="toggleLog('chance')"
          class="btn dun dum"
        >
          chance
        </button>
        <button
          :class="{ active: !this.crit }"
          @click="toggleLog('crit')"
          class="btn dun dum"
        >
          crit
        </button>
        <button
          :class="{ active: !this.effects }"
          @click="toggleLog('effects')"
          class="btn dun dum"
        >
          effects
        </button>
        <button
          :class="{ active: !this.death }"
          @click="toggleLog('death')"
          class="btn dun dum"
        >
          death
        </button>
      </div>
      <div :key="l" v-for="(c, l) in getLog()">
        <div class="one" v-html="c"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    mini: {
      type: Boolean,
      required: false,
      value: false,
    },
  },
  data() {
    return {
      openedChange: false,
      chance: false,
      effects: false,
      crit: false,
      attacks: false,
      death: false,
    };
  },
  methods: {
    toggleLog(v) {
      switch (v) {
        case "chance":
          this.chance = !this.chance;
          break;
        case "effects":
          this.effects = !this.effects;
          break;
        case "death":
          this.death = !this.death;
          break;
        case "crit":
          this.crit = !this.crit;
          break;
        case "attacks":
          this.attacks = !this.attacks;
          break;
        default:
          break;
      }
    },
    closeChange() {
      this.openedChange = false;
    },
    openChange() {
      this.openedChange = !this.openedChange;
    },
    getLog() {
      let endlog = [];
      let log = [];
      if (this.mini) {
        log = this.$parent.$parent.log;
      } else {
        log = this.$parent.log;
      }

      for (let l of log) {
        if (l.includes("death") && !this.death) {
          endlog.push(l);
        }
        if (l.includes("crit") && !this.crit) {
          endlog.push(l);
        }
        if ((l.includes("basics") || l.includes("physical")) && !this.attacks) {
          endlog.push(l);
        }
        if (l.includes("chances") && !this.chance) {
          endlog.push(l);
        }
        if (l.includes("effect") && !this.effects) {
          endlog.push(l);
        }
      }

      if (this.mini) {
        return endlog.slice(-20).reverse();
      } else {
        return endlog.slice(-200).reverse();
      }
    },
    getChangeLog() {
      return this.changelog;
    },
  },
};
</script>

<style scoped>
.flex {
  justify-content: center;
}
.close {
  position: sticky;
  background: red;
  border: 1px solid black;
  float: right;
  padding: 2px;
  border-radius: 5px;
  cursor: pointer;
}
.close:hover {
  background: pink;
}
.clickable {
  cursor: pointer;
}
.one {
  margin: 4px;
}

.box {
  box-shadow: inset 0 0 4px grey;
  background: whitesmoke;
  padding: 10px;
  border: 1px solid black;
  border-radius: 5px;
  float: left;
  min-width: 500px;
  min-height: 450px;
  margin: 10px;
}

.abs {
  border: 1px solid black;
  position: fixed;
  bottom: 65px;
  text-decoration: none;
  padding: 5px;
  background: #ffffff;
  border-radius: 5px;
  font-weight: bold;
  display: block;
  margin: auto;
  box-shadow: inset -2px -2px 4px lightgray;
}

.abs img {
  width: 32px;
  height: 32px;
  padding: 2px;
}
.dun {
  min-width: 80px;
}
.overlay {
  position: absolute;
  top: 100px;
  left: 30px;
  min-height: 300px;
  height: 300px;
  overflow-y: scroll;
}
.dum {
  min-width: 30px;
  margin: 2px;
}
</style>