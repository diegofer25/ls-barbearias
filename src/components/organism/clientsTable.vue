<template>
  <div class="col-sm-12 col-md-10 offset-md-1 animated fadeInUp">
    <div>
      <transition
        appear
        enter-active-class="animated fadeIn" >
        <q-table
          :loading="loading"
          v-if="getClients.length > 0"
          ref="table"
          title="Lista de Clientes"
          :filter="filter"
          :data="getClients"
          :columns="clientsColumns"
          row-key="name"
          selection="single"
          :selected.sync="selected"
          rows-per-page-label="Linhas por página">
          <template slot="top-right" slot-scope="props">
            <q-search v-model="filter" placeholder="Buscar"/>
             <q-btn color="positive" flat round delete icon="edit" @click="editClient">
               <q-tooltip>Editar</q-tooltip>
             </q-btn>
             <q-btn color="negative" flat round delete icon="delete_forever" @click="deleteClient">
               <q-tooltip>Excluir</q-tooltip>
             </q-btn>
             <q-btn
                flat round dense
                :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                @click="props.toggleFullscreen"
              />
          </template>
        </q-table>

        <div v-else>
          <span class="title">Não há clientes cadastrado</span>
        </div>
      </transition>

      <div v-if="editing">
        <q-dialog
          v-model="editing"
          @hide="editing = !editing"
          @escape-key="editing = !editing"
          @cancel="editing = !editing"
        >
          <span slot="title">Editar Cliente</span>

          <span slot="message">Edite as informações</span>

          <div slot="body">
              <q-field>
                <q-input type="text" class="q-pb-md" v-model="selected[0].name" float-label="Informe um nome *" placeholder="Nome"/>
              </q-field>

              <q-field>
                <q-input type="number" class="q-pb-md" v-model="selected[0].phone" float-label="Informe o Telefone *" placeholder="Ex: 21-99999-9999" />
              </q-field>

              <q-field>
                <q-input type="email" class="q-pb-md" v-model="selected[0].email" float-label="Informe o E-mail" placeholder="E-mail" />
              </q-field>

              <q-datetime class="q-pa-md" color="teal" placeholder="Data de Nascimento" v-model="selected[0].birthday" type="date" />
          </div>

          <template slot="buttons" slot-scope="props">
            <div class="q-pb-sm">
              <q-btn color="teal" label="Cancelar" @click="props.cancel" />
              <q-btn color="green" label="Confirmar" @click="confirmClient()" />
            </div>
          </template>
        </q-dialog>
      </div>
    </div>
    <add-client v-if="getDialog" @toggle-loading="changeLoading"/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import db from 'src/firestore'
import addClient from 'src/components/organism/addClient'

export default {
  computed: {
    ...mapGetters('application', [
      'clientsColumns',
      'getClients',
      'getDialog'
    ])
  },
  data () {
    return {
      filter: '',
      selected: [],
      editing: false,
      loading: false
    }
  },
  methods: {
    ...mapActions('application', [
      'setClients'
    ]),
    editClient () {
      if (this.selected.length === 0) {
        this.$q.notify({
          message: 'Por favor, selecione um cliente para editar',
          timeout: 5000,
          type: 'info',
          color: 'info',
          icon: 'info',
          position: 'top',
          actions: [{ label: 'Fechar', icon: 'close', noDismiss: true }]
        })
      } else {
        this.editing = true
      }
    },

    changeLoading (payload) {
      this.loading = payload
    },

    confirmClient () {
      const vm = this
      vm.editing = false
      vm.loading = true
      if (vm.selected[0].birthday) vm.selected[0].birthday = new Date(vm.selected[0].birthday).getTime()
      db.editClient(vm.selected[0])
        .then((res) => {
          this.$q.notify({
            message: res.message,
            timeout: 5000,
            type: 'positive',
            color: 'positive',
            icon: 'done_all',
            position: 'top',
            actions: [{ label: 'Fechar', icon: 'close', noDismiss: true }]
          })
          vm.setClients(vm.getClients.map((client) => {
            return client.id === vm.selected[0].id ? vm.selected[0] : client
          }))
          vm.loading = false
          vm.selected = []
        })
    },

    deleteClient () {
      const vm = this
      vm.loading = true
      db.deleteClient(vm.selected[0].id)
        .then((res) => {
          this.$q.notify({
            message: res.message,
            timeout: 5000,
            type: 'positive',
            color: 'positive',
            icon: 'done_all',
            position: 'top',
            actions: [{ label: 'Fechar', icon: 'close', noDismiss: true }]
          })
          vm.setClients(vm.getClients.filter((client) => {
            return client.id !== vm.selected[0].id
          }))
          vm.loading = false
          vm.selected = []
        })
    }
  },
  components: {
    'add-client': addClient
  }
}
</script>
