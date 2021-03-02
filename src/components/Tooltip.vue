<template>
  <transition name="fade">
    <div v-if="show && item != null" class="wiste">
      <div v-if="type != 'text'">
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
      <div v-else>
        <div class="title">{{ title }}</div>
        <hr v-show="title != null" />
        <div>{{ item }}</div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Tooltip",
  components: {
    Ability: () =>
      import(
        /* webpackPrefetch: true */
        /* webpackChunkName: "tooltips" */
        /* webpackMode: "lazy" */ "./Ability.vue"
      ),
    Statslist: () =>
      import(
        /* webpackPrefetch: true */
        /* webpackChunkName: "tooltips" */
        /* webpackMode: "lazy" */ "./Statslist.vue"
      ),
  },
  props: {
    item: {
      type: [Object, String],
      required: true,
    },
    title: {
      type: String,
      required: false,
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
      show: false,
      elistender: null,
      llistender: null,
      mlistender: null,
      lastcord: [0, 0, 0, 0],
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
    calculatePosition(change, e) {
      let posy, posx, targetwidth, targetheight;
      if (change) {
        this.show = true;
      }

      //check if is loaded from moseevent
      if (e != undefined) {
        posy = e.target.getBoundingClientRect().left;
        posx = e.target.getBoundingClientRect().top;
        targetwidth = e.target.offsetWidth;
        targetheight = e.target.offsetHeight;
        //Save last cursor position
        this.lastcord = [posy, posx, targetwidth, targetheight];
      } else {
        //Load last cursor position
        posy = this.lastcord[0];
        posx = this.lastcord[1];
        targetwidth = this.lastcord[2];
        targetheight = this.lastcord[3];
      }

      this.$nextTick(() => {
        let element = this.$el;
        if (element.style != undefined) {
          let width = element.offsetWidth;

          //Check if Tooltip bigger than screen
          if (posy + width >= window.innerWidth - 300) {
            //Turn tooltip left
            element.style.left = posy - width + "px";
          } else {
            //Turn tooltip right
            element.style.left = posy + targetwidth + "px";
          }

          let height = element.offsetHeight;
          //Check if Tooltip bigger then bottom
          if (posx + height >= window.innerHeight - 20) {
            element.style.top = posx - height + targetheight / 2 + "px";
          } else {
            element.style.top = posx + targetheight / 2 + "px";
          }
          if (posx + targetheight / 2 + height >= window.innerHeight - 20) {
            let diff =
              posx + targetheight / 2 + height - window.innerHeight + 20;
            element.style.top = posx + targetheight / 2 - diff + "px";
          }
        }
      });
    },
  },
  mounted() {
    let el = this;

    this.llistender = () => {
      this.show = false;
    };

    this.elistender = (e) => {
      this.calculatePosition(true, e);
    };

    $(this.$el).parent().first().on("mouseenter", this.elistender);
    $(this.$el).parent().first().on("mouseleave", this.llistender);
  },
  beforeDestroy() {
    $(this.$el).parent().first().off("mouseenter", this.elistender);
    $(this.$el).parent().first().off("mouseleave", this.llistender);
  },
  watch: {
    shift: function (val) {
      this.calculatePosition(false);
    },
    ctrl: function (val) {
      this.calculatePosition(false);
    },
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
