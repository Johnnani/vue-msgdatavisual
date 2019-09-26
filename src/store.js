import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isFullScreen: false
  },
  mutations: {
    changeScreen: function (state, val) {
      state.isFullScreen = val
    }
  },
  actions: {

  }
})