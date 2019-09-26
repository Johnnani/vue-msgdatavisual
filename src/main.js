import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import util from '@/libs/util'
// require('./mock')
import './mock'


//require styles
import 'swiper/dist/css/swiper.css'

Vue.config.productionTip = false
Vue.use(VueAwesomeSwiper)

// document.addEventListener("fullscreenchange", function (event) {
//   console.log(event,1233)
//   }, false);
//   document.addEventListener("msfullscreenchange", function (event) {
//     console.log(event,123)

//   }, false);
//   document.addEventListener("mozfullscreenchange", function (event) {
//     console.log(event,123)

//   }, false);
//   document.addEventListener("webkitfullscreenchange", function (event) {
//     console.log(event,123)

//   }, false);

//页面适配
util.adapt()
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
