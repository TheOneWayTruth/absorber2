import Vue from 'vue'
import App from './App.vue'
import tippslist from "./components/json/tipps.json";
import choiselist from "./components/json/choises.json";
import skillist from "./components/json/skilltree.json";
import itemslist from "./components/json/items.json";
import enemieslist from "./components/json/enemys.json";

Vue.prototype.crazysdk = window.CrazyGames.CrazySDK.getInstance();

Vue.config.productionTip = false

Vue.prototype.enemieslist = enemieslist
Vue.prototype.tippslist = tippslist
Vue.prototype.choiselist = choiselist
Vue.prototype.skillist = skillist
Vue.prototype.itemslist = itemslist
Vue.prototype.images = []

Vue.prototype.beta = false

new Vue({
  render: h => h(App),
}).$mount('#app')
