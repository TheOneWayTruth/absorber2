<template>
  <transition name="fade">
    <div v-show="show" class="wiste">
      <div class="title">{{ item }}</div>
      <div v-html="maketext(item)"></div>
    </div>
  </transition>
</template>

<script>
import $ from "jquery";
import choise from "./json/choises.json";

export default {
  props: {
    item: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      show: false,
      elistender: null,
      llistender: null,
    };
  },
  methods: {
    maketext(l) {
      try {
        let tipp = this.tippslist.find((x) => x.id === l);
        let out = "<div><b>Description:</b><hr/>" + tipp.desc + "</div>";
        out += "<div><b>Calculation:</b><hr/>" + tipp.form + "</div>";
        return out;
      } catch {
        try {
          let chois = choise.find((x) => x.id === l);
          let out = "";
          out += "<div><b>Description:</b><hr/>" + chois.desc + "</div><br>";
          return out;
        } catch {}
        return "<div><b>" + l + "</b></div>";
      }
    },
  },
  mounted() {
    this.elistender = (e) => {
      this.show = true;

      let posy = e.target.getBoundingClientRect().left;
      let posx = e.target.getBoundingClientRect().top;

      let targetwidth = e.target.offsetWidth;
      let targetheight = e.target.offsetHeight;

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
    };

    this.llistender = () => {
      this.show = false;
    };

    $(this.$el).parent().first().on("mouseenter", this.elistender);

    $(this.$el).parent().first().on("mouseleave", this.llistender);
  },
  beforeDestroy() {
    $(this.$el).parent().first().off("mouseenter", this.elistender);

    $(this.$el).parent().first().off("mouseleave", this.llistender);
  },
};
</script>

<style scoped>
.title {
  font-size: 25px;
  margin-bottom: 5px;
  text-transform: capitalize;
}

.wiste {
  padding: 10px;
  position: fixed;
  border: 1px solid black;
  background: whitesmoke;
  pointer-events: none;
  z-index: 10;
  min-width: 100px;
  width: 230px;
  white-space: normal;
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
