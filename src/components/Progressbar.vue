<template>
  <div>
    <div
      :class="{ bspeed: this.speed, abp: this.ab }"
      class="myProgress"
      ref="myProgress"
    >
      <span :key="rounded" class="middle">{{ rounded }}</span>
      <div
        class="myBar"
        ref="myBar"
        :class="{ fspeed: this.speed, abar: this.ab }"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProgressbarItem",
  props: {
    max: {
      type: Number,
      required: true,
    },
    val: {
      type: Number,
      required: true,
    },
    speed: {
      type: Boolean,
      required: false,
    },
    ab: {
      type: Boolean,
      required: false,
    },
  },
  watch: {
    val: function (newVal, oldVal) {
      let pz = (this.val / this.max) * 100;
      this.$refs.myBar.style.width = pz + "%";
    },
  },
  computed: {
    rounded: function () {
      return Math.round((this.val + Number.EPSILON) * 100) / 100;
    },
  },
  mounted() {
    this.$refs.myBar.style.width = (this.val / this.max) * 100 + "%";
  },
};
</script>

<style scoped>
.myProgress {
  margin: 5px;
  overflow: hidden;
  width: 200px;
  background-color: red;
  border: 1px solid black;
  border-radius: 5px;
  max-width: 100%;
  box-shadow: inset -2px -2px 4px #cc0000;
}

.bspeed {
  background: lightgray;
  box-shadow: inset -2px -2px 4px grey;
}

.myBar {
  transition: width 0.2s;
  width: 1%;
  height: 30px;
  border-radius: 2px;
  background-color: #00cc00;
  box-shadow: inset -2px -2px 4px #009900;
}

.fspeed {
  background: white;
  box-shadow: inset -2px -2px 4px lightgray;
}

.middle {
  width: 200px;
  position: absolute;
  transform: translateX(45%);
  line-height: 30px;
}

.abp {
  margin: 0px;
  width: calc(100% - 2px);
  position: fixed;
  top: 0px;
  border-radius: 0px;
  border: 1px solid black;
}

.abar {
  margin: 0px;
  border-radius: 0px;
}

.abp.bspeed {
  top: 32px;
}
</style>