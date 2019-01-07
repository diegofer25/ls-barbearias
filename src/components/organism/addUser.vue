<template>
  <q-modal-layout>
    <q-toolbar slot="header" color="teal">
      <q-btn flat round dense v-close-overlay icon="keyboard_arrow_left"/>
      <q-toolbar-title>
        Cadastro de usuário
      </q-toolbar-title>
    </q-toolbar>

    <div class="layout-padding">
      <div class="row">
        <div class="col-12">
          <p class="q-title">Preencha o nome do usuário e informa as permissões</p>
        </div>
        <div class="col-12" style="heigth: 100%">
          <div class="row">
            <q-input class="col-sm-12 col-md-6 q-mb-md" float-label="Usuário" placeholder="Informe um nome de usuário" v-model="user.username" />
          </div>
          <div class="row">
            <p class="q-title">Permissões</p>
            <div class="col-12">
              <q-card v-for="({ title, type }, index) in permissionsList" :key="index" class="shadow-2 q-px-sm q-py-md q-mb-sm">
                <div class="row">
                  <div class="col-12">
                    <div class="row justify-between">
                      <p class="q-subheading">{{ title }}</p>
                      <q-checkbox
                        v-model="toggleAll[type]" color="teal" class="q-mb-md"
                        @input="(val) => toggleAllPermissions(type, val)"
                        :label="toggleAll[type] || toggleAll[type] === null ? 'Desmarcar Todos' : 'Marcar Todos'"
                      />
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="row justify-around">
                      <q-toggle @input="(val) => checkAll(type, val)" color="teal" v-model="user.permissions[type].create" label="Cadastrar" />
                      <q-toggle @input="(val) => checkAll(type, val)" color="teal" v-model="user.permissions[type].read" label="Consultar" />
                      <q-toggle @input="(val) => checkAll(type, val)" color="teal" v-model="user.permissions[type].update" label="Editar" />
                      <q-toggle @input="(val) => checkAll(type, val)" color="teal" v-model="user.permissions[type].delete" label="Deletar" />
                    </div>
                  </div>
                </div>
              </q-card>
            </div>
          </div>
        </div>
        <div class="col-12 q-mt-sm">
          <div class="row justify-between">
            <q-btn color="red" v-close-overlay label="Cancelar" />
            <q-btn color="teal" icon="check" label="Cadastrar" :disabled="hasError(user.username)" @click="addUser(user)" />
          </div>
        </div>
      </div>
    </div>
  </q-modal-layout>
</template>

<script>
export default {
  name: 'Add-User',
  data () {
    return {
      user: {
        username: '',
        permissions: {
          barbers: {
            create: false,
            read: true,
            update: false,
            delete: false
          },
          clients: {
            create: false,
            read: true,
            update: false,
            delete: false
          },
          expenses: {
            create: false,
            read: true,
            update: false,
            delete: false
          },
          payments: {
            create: false,
            read: true,
            update: false,
            delete: false
          },
          schedules: {
            create: false,
            read: true,
            update: false,
            delete: false
          },
          services: {
            create: false,
            read: true,
            update: false,
            delete: false
          }
        }
      },
      toggleAll: {
        barbers: null,
        clients: null,
        expenses: null,
        payments: null,
        schedules: null,
        services: null
      },
      permissionsList: [{
        title: 'Barabeiros',
        type: 'barbers'
      }, {
        title: 'Clientes',
        type: 'clients'
      }, {
        title: 'Despesas',
        type: 'expenses'
      }, {
        title: 'Pagamentos',
        type: 'payments'
      }, {
        title: 'Agenda',
        type: 'schedules'
      }, {
        title: 'Serviços',
        type: 'services'
      }]
    }
  },
  methods: {
    toggleAllPermissions (type, val) {
      this.user.permissions[type] = {
        create: val,
        read: val,
        update: val,
        delete: val
      }
    },

    checkAll (type, val) {
      if (Object.values(this.user.permissions[type]).every(item => {
        return item
      })) {
        this.toggleAll[type] = true
      } else if (Object.values(this.user.permissions[type]).every(item => {
        return !item
      })) {
        this.toggleAll[type] = false
      } else {
        this.toggleAll[type] = null
      }
    },

    hasError (username) {
      return username && username.length < 3
    },

    addUser (user) {
      console.log('cadastrado com suceso', user)
    }
  }
}
</script>
