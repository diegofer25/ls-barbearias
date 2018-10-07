import Vue from 'vue'
import Vuex from 'vuex'

import application from './application'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    application
  }
})

export default store
