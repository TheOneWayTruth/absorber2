import Vue from 'vue'
import App from './App.vue'
import enemieslist from "./components/json/enemys.json";
import tippslist from "./components/json/tipps.json";
import choiselist from "./components/json/choises.json";
import changelog from "./components/json/changelog.json";
import bufflist from "./components/json/bufflist.json";
import skillist from "./components/json/skilltree.json";
import itemslist from "./components/json/items.json";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBOOTIcrqTBf_rR2vCFCKctxTfzfbWLNig",
  authDomain: "absorber5.firebaseapp.com",
  databaseURL: "https://absorber5.firebaseio.com",
  projectId: "absorber5",
  storageBucket: "absorber5.appspot.com",
  messagingSenderId: "475063218887",
  appId: "1:475063218887:web:00aa330b54c223fdd644e2",
  measurementId: "G-DN11HDSJH2"
};

firebase.initializeApp(firebaseConfig);

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
