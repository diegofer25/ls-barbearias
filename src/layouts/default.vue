<template>
  <div>
    <div v-if="loading" id="loading">
      <div class="animated fadeIn cover-fade">
        <div class="row" style="height: 100vh">
          <div class="col-12 self-center">
            <div class="row q-mb-md  animated fadeIn">
              <div class="col-12 q-mb-md">
                <div class="row justify-center text-center">
                  <span v-html="getIcons.logo" style="height: 200px; width: 200px;"></span>
                </div>
              </div>
              <div class="col-12">
                <div class="row justify-center">
                  <span class="q-display-1 text-center text-white text-weight-thin">
                    LS Contabilidade <br> Barbearia
                  </span>
                </div>
              </div>
              <div class="col-12">
                <div class="row justify-center q-my-lg">
                  <span class="text-center text-white" v-html="getIcons.svgLoading" style="height: 150px; width: 150px;"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <q-layout v-else view="hHh LpR fFf" dark>
      <q-layout-header>
        <q-toolbar color="teal">
          <q-btn
            flat dense round
            @click="leftDrawerOpen = !leftDrawerOpen"
            aria-label="Menu"
          >
            <q-icon name="menu" />
          </q-btn>

          <q-toolbar-title>
            LS Barbearia
            <div slot="subtitle">Controle e Gestão de Barbearia</div>
          </q-toolbar-title>
        </q-toolbar>
      </q-layout-header>

      <q-layout-drawer
        v-model="leftDrawerOpen"
      >
        <div class="text-center q-pa-sm">
          <span class="q-display-1 text-weight-thin">Menu</span>
        </div>
        <q-list
          no-border
          link
          inset-delimiter
        >
          <q-item v-for="item of menu" :key="item.label"
            @click.native="goto(item.action)">
            <q-item-side :icon="item.icon" />
            <q-item-main :label="item.label" :sublabel="item.subLabel" />
          </q-item>
        </q-list>
        <q-collapsible indent icon="settings" label="Configurações" sublabel="Configurações do sistema">
          <q-list link class="q-mr-sm" separator>
            <q-item @click.native="sync">
              <q-item-side icon="sync" />
              <q-item-main label="Sincronizar" sublabel="Atualiza dados" />
            </q-item>
            <q-item @click.native="logout">
              <q-item-side icon="exit_to_app" />
              <q-item-main label="Logout" sublabel="Finaliza sua seção" />
            </q-item>
          </q-list>
        </q-collapsible>

      </q-layout-drawer>

      <q-page-container>
        <transition
          mode="out-in"
          enter-active-class="animated slideInLeft"
          leave-active-class="animated slideOutRight"
        >
          <router-view />
        </transition>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import db from 'src/firestore'
import cache from 'src/cache'
import { mapGetters, mapActions } from 'vuex'
import firebase from 'firebase'

export default {
  name: 'LayoutDefault',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      loading: true,
      year: new Date().getFullYear(),
      menu: [
        {
          icon: 'home',
          label: 'Home',
          subLabel: 'Informações Gerais',
          action: '/app'
        },
        {
          icon: 'monetization_on',
          label: 'Pagamentos',
          subLabel: 'Pagamentos e Comissões',
          action: '/app/payments'
        },
        {
          icon: 'account_circle',
          label: 'Clientes',
          subLabel: 'Gerenciar Clientes',
          action: '/app/clients'
        },
        {
          icon: 'group',
          label: 'Barbeiros',
          subLabel: 'Gerenciar Barbeiros',
          action: '/app/barbers'
        },
        {
          icon: 'book',
          label: 'Agenda',
          subLabel: 'Agenda dos Barbeiros',
          action: '/app/shedule'
        },
        {
          icon: 'import_contacts',
          label: 'Catálogo de Serviços',
          subLabel: 'Gerenciar Serviços',
          action: '/app/services'
        },
        {
          icon: 'insert_chart',
          label: 'Relatórios',
          subLabel: 'Relatórios do sistema',
          action: '/app/reports'
        }
      ]
    }
  },
  computed: {
    ...mapGetters('application', [
      'getIcons',
      'getClients',
      'getServices',
      'getBarbers',
      'getPayments',
      'getSchedules'
    ])
  },
  mounted () {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.startApplication()
      } else {
        this.$router.push({ path: '/' })
      }
    })
  },
  methods: {
    ...mapActions('application', [
      'setClients',
      'setServices',
      'setBarbers',
      'setPayments',
      'setSchedules'
    ]),

    logout () {
      const notify = this.$q.notify
      firebase.auth().signOut().then(() => {
        cache.del('user')
        notify({
          message: 'Até logo...',
          color: 'positive'
        })
      }, error => {
        console.log(error)
        notify('Erro na comunicação com o servidor')
      })
    },

    startApplication () {
      const vm = this
      const beforePromise = new Date().getTime()
      const timer = location.href.includes('localhost') ? '1' : '3000'
      const today = new Date().toLocaleDateString()
      if (!cache.has(today)) {
        vm.sync(today)
      }
      Promise.all([
        vm.requestClients(),
        vm.requestServices(),
        vm.requestBarbers(),
        vm.requestPayments(),
        vm.requestSchedules()
      ]).then(responses => {
        responses.map(res => {
          vm[res.type](res.data)
        })
        const afterPromise = new Date().getTime()
        const diference = new Date(afterPromise - beforePromise).getSeconds()
        if (diference < 1) {
          setTimeout(() => {
            vm.loading = false
          }, timer)
        } else {
          vm.loading = false
        }
      })
      window.addEventListener('load', function () {
        function updateOnlineStatus (event) {
          if (navigator.onLine) {
            vm.loading = false
            vm.$q.notify({
              message: 'Conexão reestabelecida',
              type: 'positive',
              color: 'positive',
              icon: 'done_all',
              position: 'top',
              actions: [{ label: 'Fechar', icon: 'close', noDismiss: true }]
            })
          } else {
            vm.loading = true
            vm.$q.notify({
              message: 'Sem Comunicação com a internet',
              type: 'negative',
              color: 'negative',
              icon: 'warning',
              position: 'top',
              actions: [{ label: 'Fechar', icon: 'close', noDismiss: true }]
            })
          }
        }
        window.addEventListener('online', updateOnlineStatus)
        window.addEventListener('offline', updateOnlineStatus)
      })
    },

    goto (locale) {
      this.leftDrawerOpen = !this.leftDrawerOpen
      this.$router.push(locale)
    },

    sync (today) {
      cache.delAll()
      cache.set(today, today)
      setTimeout(() => {
        location.reload()
      }, 100)
    },

    requestClients () {
      return new Promise(resolve => {
        if (!cache.has('clients')) {
          return db.getClients().then((clients) => {
            cache.set('clients', clients.data)
            resolve({ type: 'setClients', data: clients.data })
          })
        } else {
          resolve({ type: 'setClients', data: cache.get('clients') })
        }
      })
    },

    requestServices () {
      return new Promise(resolve => {
        if (!cache.has('services')) {
          return db.getServices().then((services) => {
            cache.set('services', services.data)
            resolve({ type: 'setServices', data: services.data })
          })
        } else {
          resolve({ type: 'setServices', data: cache.get('services') })
        }
      })
    },

    requestBarbers () {
      return new Promise(resolve => {
        if (!cache.has('barbers')) {
          db.getBarbers().then((barbers) => {
            cache.set('barbers', barbers.data)
            resolve({ type: 'setBarbers', data: barbers.data })
          })
        } else {
          resolve({ type: 'setBarbers', data: cache.get('barbers') })
        }
      })
    },

    requestPayments () {
      return new Promise(resolve => {
        if (!cache.has('payments')) {
          db.getPayments().then((payments) => {
            cache.set('payments', payments.data)
            resolve({ type: 'setPayments', data: payments.data })
          })
        } else {
          resolve({ type: 'setPayments', data: cache.get('payments') })
        }
      })
    },

    requestSchedules () {
      return new Promise(resolve => {
        if (!cache.has('schedules')) {
          db.getSchedules().then((schedule) => {
            cache.set('schedules', schedule.data)
            resolve({ type: 'setSchedules', data: schedule.data })
          })
        } else {
          resolve({ type: 'setSchedules', data: cache.get('schedules') })
        }
      })
    }
  }
}
</script>

<style>
  .q-layout-header .q-toolbar {
    min-height: 75px;
  }

  .slide-fade-enter-active {
    transition: .4s ease-out;
  }
  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(-1000px);
    opacity: 0.5;
  }
  .animated {
    -webkit-animation-duration: 0.4s;
    animation-duration: 0.4s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
  }
</style>