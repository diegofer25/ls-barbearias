<template>
  <div class="col-sm-12 col-md-10 offset-md-1 animated fadeInUp">
    <div>
      <transition
        appear
        enter-active-class="animated fadeIn" >
        <q-table
          v-if="getBarbers.length > 0"
          ref="table"
          title="Lista de Barbeiros"
          :filter="filter"
          :data="getBarbers"
          :columns="barberColumns"
          row-key="id"
          selection="single"
          :selected.sync="selected"
          :loading="loading"
          rows-per-page-label="Linhas por página">
          <template slot="top-right" slot-scope="props">
            <q-search v-model="filter" placeholder="Buscar"/>
             <q-btn color="positive" flat round delete icon="edit" @click="editBarber">
               <q-tooltip>Editar</q-tooltip>
             </q-btn>
             <q-btn color="negative" flat round delete icon="delete_forever" @click="deleteBarber">
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
          <span class="title">Não há barbeiros cadastrado</span>
        </div>
      </transition>

      <div v-if="editing">
        <q-dialog
          v-model="editing"
          @hide="editing = !editing"
          @escape-key="editing = !editing"
          @cancel="editing = !editing"
        >
          <span slot="title">Editar Barbere</span>

          <span slot="message">Edite as informações</span>

          <div slot="body">
              <q-field>
                <q-input type="text" class="q-pb-md" v-model="selected[0].name" float-label="Informe um nome *" placeholder="Nome"/>
              </q-field>

              <q-field>
                <q-input type="text" class="q-pb-md" v-model="selected[0].cpf" float-label="Informe o cpf *" placeholder="Ex: 21-99999-9999" />
              </q-field>

              <q-datetime class="q-pa-md" color="teal" placeholder="Data de Entrada" v-model="selected[0].date" type="date" />
          </div>

          <template slot="buttons" slot-scope="props">
            <div class="q-pb-sm">
              <q-btn color="teal" label="Cancelar" @click="props.cancel" />
              <q-btn color="green" label="Confirmar" @click="confirmBarber()" />
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
  name: 'BarbersTables',
  computed: {
    ...mapGetters('application', [
      'getBarbers',
      'barberColumns'
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
      'setBarbers'
    ]),
    editBarber () {
      if (this.selected.length === 0) {
        this.$q.notify({
          message: 'Por favor, selecione um barbeiro para editar',
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

    confirmBarber () {
      const vm = this
      this.editing = false
      this.loading = true
      if (vm.selected[0].date) vm.selected[0].date = new Date(vm.selected[0].date).getTime()
      db.editBarber(vm.selected[0])
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
          vm.setBarbers(vm.getBarbers.map((barber) => {
            return barber.id === vm.selected[0].id ? vm.selected[0] : barber
          }))
          vm.editing = false
          vm.loading = false
          vm.selected = []
        })
    },

    deleteBarber () {
      const vm = this
      this.loading = true
      db.deleteBarber(vm.selected[0].id)
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
          vm.setBarbers(vm.getBarbers.filter((barber) => {
            return barber.id !== vm.selected[0].id
          }))
          this.loading = false
          vm.selected = []
        })
    }
  }
}
</script>
