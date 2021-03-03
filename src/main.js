import Vue from 'vue'
import App from './App.vue'
import enemieslist from "./components/json/enemys.json";
import tippslist from "./components/json/tipps.json";
import choiselist from "./components/json/choises.json";
import changelog from "./components/json/changelog.json";
import bufflist from "./components/json/bufflist.json";
import skillist from "./components/json/skilltree.json";
import itemslist from "./components/json/items.json";
import "./components/firebase.js"


Vue.config.productionTip = false

Vue.prototype.enemieslist = enemieslist
Vue.prototype.tippslist = tippslist
Vue.prototype.choiselist = choiselist
Vue.prototype.bufflist = bufflist
Vue.prototype.skillist = skillist
Vue.prototype.changelog = changelog
Vue.prototype.itemslist = itemslist
Vue.prototype.images = []

Vue.prototype.beta = false

new Vue({
  render: h => h(App),
}).$mount('#app')
