<template>
  <div class="col-sm-12 col-md-10 offset-md-1 animated fadeInUp">
    <div>
      <transition
        appear
        enter-active-class="animated fadeIn" >
        <q-table
        grid
          v-if="getServices.length"
          :loading="loading"
          ref="table"
          title="Lista de Serviços"
          :filter="filter"
          :data="getServices"
          :columns="servicesColumns"
          row-key="id"
          selection="single"
          :selected.sync="selected"
          rows-per-page-label="Linhas por página">
          <template slot="top-right" slot-scope="props">
            <q-search v-model="filter" placeholder="Buscar"/>
             <q-btn color="positive" flat round delete icon="edit" @click="editService">
               <q-tooltip>Editar</q-tooltip>
             </q-btn>
             <q-btn color="negative" flat round delete icon="delete_forever" @click="deleteService">
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
          <span class="title">Não há serviços cadastrado</span>
        </div>
      </transition>

      <div v-if="editing">
        <q-dialog
          v-model="editing"
          @hide="editing = !editing"
          @escape-key="editing = !editing"
          @cancel="editing = !editing"
        >
          <span slot="title">Editar Serviço</span>

          <span slot="message">Edite as informações</span>

          <div slot="body">
            <q-field>
              <q-input type="text" class="q-pb-md" v-model="selected[0].name" float-label="Nome do Serviço" placeholder="..."/>
            </q-field>

            <q-field>
              <q-input type="textarea" class="q-pb-md" v-model="selected[0].description" float-label="Descrição do serviço *" placeholder="..." />
            </q-field>

            <q-field>
              <q-input type="number" class="q-pb-md" v-model="selected[0].price" float-label="Informe o Valor"
                numeric-keyboard-toggle prefix="R$ " align="right"/>
            </q-field>
          </div>

          <template slot="buttons" slot-scope="props">
            <div class="q-pb-sm">
              <q-btn color="teal" label="Cancelar" @click="props.cancel" />
              <q-btn color="green" label="Cadastrar" @click="confirmService()" />
            </div>
          </template>
        </q-dialog>
      </div>

    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import db from 'src/firestore'

export default {
  computed: {
    ...mapGetters('application', [
      'servicesColumns',
      'getServices'
    ])
  },
  data () {
    return {
      filter: '',
      loading: false,
      selected: [],
      editing: false
    }
  },

  methods: {
    ...mapActions('application', [
      'setServices'
    ]),
    editService () {
      if (this.selected.length === 0) {
        this.$q.notify({
          message: 'Por favor, selecione um serviço para edição',
          timeout: 5000,
          type: 'info',
          color: 'info',
          icon: 'info',
          position: 'bottom',
          actions: [{ label: 'Fechar', icon: 'close', noDismiss: true }]
        })
      } else {
        this.editing = true
      }
    },

    confirmService () {
      const vm = this
      vm.loading = true
      db.editService(vm.selected[0])
        .then((res) => {
          this.$q.notify({
            message: res.message,
            timeout: 5000,
            type: 'positive',
            color: 'positive',
            icon: 'done_all',
            position: 'bottom',
            actions: [{ label: 'Fechar', icon: 'close', noDismiss: true }]
          })
          vm.setServices(vm.getServices.map(service => {
            return service.id === vm.selected[0].id ? vm.selected[0] : service
          }))
          vm.editing = false
          vm.loading = false
          vm.selected = []
        })
    },

    deleteService () {
      const vm = this
      vm.loading = true
      db.deleteService(vm.selected[0].id)
        .then((res) => {
          this.$q.notify({
            message: res.message,
            timeout: 5000,
            type: 'positive',
            color: 'positive',
            icon: 'done_all',
            position: 'bottom',
            actions: [{ label: 'Fechar', icon: 'close', noDismiss: true }]
          })
          vm.setServices(vm.getServices.filter(service => {
            return service.id !== vm.selected[0].id
          }))
          vm.selected = []
          vm.loading = false
        })
    }
  }
}
</script>
