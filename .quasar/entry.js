/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 *
 * You are probably looking on adding initialization code.
 * Use "quasar new plugin <name>" and add it there.
 * One plugin per concern. Then reference the file(s) in quasar.conf.js > plugins:
 * plugins: ['file', ...] // do not add ".js" extension to it.
 **/
import './quasar'

import Vue from 'vue'
Vue.config.productionTip = false




import 'quasar-extras/roboto-font'

import 'quasar-extras/material-icons'



import 'quasar-extras/animate'


import 'quasar-app-styl'


import 'src/css/app.styl'


import App from '../src/App.vue'

import router from '../src/router'

import store from '../src/store'


const app = {
  el: '#q-app',
  router,
store,
  ...App
}


const plugins = []

import pluginAxios from 'src/plugins/axios'
plugins.push(pluginAxios)

import pluginVuelidate from 'src/plugins/vuelidate'
plugins.push(pluginVuelidate)

import pluginApexcharts from 'src/plugins/apexcharts'
plugins.push(pluginApexcharts)

plugins.forEach(plugin => plugin({ app, router, store, Vue }))









new Vue(app)



