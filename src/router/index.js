import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

Vue.use(VueRouter)

const Router = new VueRouter({
  /*
   * NOTE! Change Vue Router mode from quasar.conf.js -> build -> vueRouterMode
   *
   * When going with "history" mode, please also make sure "build.publicPath"
   * is set to something other than an empty string.
   * Example: '/' instead of ''
   */

  // Leave as is and change from quasar.conf.js instead!
  mode: process.env.VUE_ROUTER_MODE,
  base: process.env.VUE_ROUTER_BASE,
  scrollBehavior: () => ({ y: 0 }),
  routes
})

Router.beforeEach((to, from, next) => {
  const checkUser = localStorage.hasOwnProperty('user')
  const user = JSON.parse(localStorage.getItem('user'))
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (checkUser) {
      if (to.path === '/app') {
        if (user.currentUser.root) next()
        else next({ path: '/app/payments' })
      } else {
        next()
      }
    } else {
      next({ path: '/' })
    }
  } else if (to.path === '/' && checkUser) {
    next({ path: '/app' })
  } else {
    next()
  }
})

export default Router
