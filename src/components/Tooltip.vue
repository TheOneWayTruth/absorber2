<template>
  <transition name="fade">
    <div v-if="create" v-show="show" class="wiste">
      <div v-if="ctrl">
        <h2 class="title">{{ item.name }}</h2>
        <b>Stats:</b>
        <Statslist :item="filtred(item)" />
      </div>
      <div v-else-if="shift">
        <h2 class="title">{{ item.name }}</h2>
        <b>Description:</b>
        <hr />
        <Ability
          class="basic"
          style="white-space: normal; width: 200px; height: auto"
          :pid="'description'"
          :val="item.description"
        />
      </div>
      <div v-else>
        <h2 class="title">{{ item.name }}</h2>
        <div v-if="type == 'item'">
          <b>Description:</b>
          <hr />
          <Ability
            class="basic"
            style="white-space: normal; width: 200px; height: auto"
            :pid="'description'"
            :val="item.description"
          />
          <div v-if="item.special != null">
            <b>Special:</b>
            <hr />
            <Ability
              class="basic"
              style="white-space: normal; width: 200px; height: auto"
              :pid="'crit'"
              :val="item.special"
            />
          </div>
        </div>
        <b v-if="Object.keys(item.gain).length !== 0">Gain:</b>
        <Statslist :item="item.gain" />
      </div>
    </div>
  </transition>
</template>

<script>
import Ability from "./Ability.vue";
import Statslist from "./Statslist.vue";
export default {
  name: "Tooltip",
  components: {
    Ability,
    Statslist,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    ctrl: {
      type: Boolean,
      required: false,
    },
    shift: {
      type: Boolean,
      required: false,
    },
    type: {
      type: String,
      required: false,
      value: "enemy",
    },
  },
  data() {
    return {
      create: false,
      show: false,
      elistender: null,
      llistender: null,
      mlistender: null,
      target: null,
      x: 0,
      y: 0,
    };
  },
  methods: {
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

      let ob = Object.keys(arr)
        .filter((key) => !allowed.includes(key))
        .reduce((obj, key) => {
          obj[key] = arr[key];

          return obj;
        }, {});

      return ob;
    },
    setReal() {
      let el = this;
      setTimeout(function () {
        let eposy = 0;
        let eposx = 0;
        try {
          eposy =
            500 < el.x
              ? el.target.left - 250
              : el.target.left + el.target.width + 10;

          eposx =
            350 < el.y
              ? el.target.bottom - el.$el.scrollHeight
              : el.target.top + 10;

          el.$el.style.top = eposx + "px";
          el.$el.style.left = eposy + "px";
          el.show = true;
        } catch {}
      }, 20);
    },
    setDimensions(e, el) {
      el.create = true;
      el.target = e.target.getBoundingClientRect();
      el.x = e.clientX;
      el.y = e.clientY;
      this.setReal();
    },
  },
  watch: {
    shift: function (val) {
      this.setReal();
    },
    ctrl: function (val) {
      this.setReal();
    },
  },
  mounted() {
    let el = this;

    this.elistender = function (e) {
      el.setDimensions(e, el);
    };

    this.mlistender = function (e) {
      el.setDimensions(e, el);
    };

    this.llistender = function () {
      el.show = false;
      el.create = false;
    };

    $(this.$el).parent().first().on("mouseenter", this.elistender);

    $(this.$el).parent().first().on("mousemove", this.mlistender);

    $(this.$el).parent().first().on("mouseleave", this.llistender);
  },
  beforeDestroy() {
    $(this.$el).parent().first().off("mouseenter", this.elistender);

    $(this.$el).parent().first().off("mousemove", this.mlistender);

    $(this.$el).parent().first().off("mouseleave", this.llistender);
  },
};
</script>

<style scoped>
.title {
  margin: 0px;
}

.wiste {
  padding: 10px;
  position: fixed;
  border: 1px solid black;
  background: whitesmoke;
  pointer-events: none;
  z-index: 10;
  width: 230px;
  overflow: hidden;
}

.iconz {
  float: left;
  margin-right: 10px;
  height: 32px;
  width: 32px;
}

.lol {
  line-height: 32px;
}

.skiste {
  border: 1px solid black;
  background: red;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
