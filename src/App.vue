<template>
  <div :class="{ beta: beta }">
    <Index />
  </div>
</template>

<script>
import Index from "./components/Index.vue";

export default {
  name: "app",
  components: {
    Index,
  },
};
</script>

<style>
body,
html,
#app {
  user-select: none;
  background: grey;
  width: 100%;
  margin: 0px;
  padding: 0px;
  font-family: "MedievalSharp", cursive;
}

.hide {
  display: none;
}

.beta {
  border: 1px solid red;
}

.fullsize {
  height: 100%;
  min-height: 100vh;
  padding: 30px 10px 80px 10px;
}

.btn {
  line-height: 32px;
  border-radius: 5%;
  font-size: 20px;
  font-family: "MedievalSharp", cursive;
  margin: 10px;
  padding: 10px;
  outline: none;
  border: none;
  cursor: pointer;
  background: #a5a5a5;
  transition: 0.1s;
  box-shadow: 0 5px #636363;
  display: block;
  border: 0.5px solid darkslategrey;
}

.btn img {
  float: left;
  width: 32px;
  height: 32px;
}

.btn:hover {
  background: #7a7a7a;
}

.btn:active,
.active {
  box-shadow: 0 2px #666;
  transform: translateY(4px);
  background: #505050;
}

.flex {
  display: flex;
  flex-wrap: wrap;
}

.flex-colum {
  display: flex;
  flex-direction: column;
}

.dun {
  min-width: 130px;
  background: lightskyblue;
  font-size: 14px;
  display: inline;
  padding: 4px;
  box-shadow: 0 2px #0a9bf5;
  line-height: 20px;
}
.text {
  background: lightgray;
  margin-left: 10px;
  padding: 20px;
  display: block;
  width: 790px;
  border-radius: 5px;
  border: 1px solid black;
  box-shadow: inset 0 0 4px grey;
}

.dun:hover {
  background: #9dd7fb;
}

.dun:active,
.dun.active {
  box-shadow: 0 2px #054d7a;
  transform: translateY(1px);
  background: #0a9bf5;
}

.dun > img {
  vertical-align: middle;
  height: 20px;
  width: 20px;
}

/* Scrollbar Global */
::-webkit-scrollbar {
  width: 15px;
}

::-webkit-scrollbar-track {
  background: #777;
}

::-webkit-scrollbar-thumb {
  background: #474747;
}

::-webkit-scrollbar-thumb:hover {
  background: #616161;
}
</style>
