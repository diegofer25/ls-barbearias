<template>
  <q-dialog
    v-model="dialog"
    @hide="cancel"
    @escape-key="cancel"
    @cancel="cancel"
  >
    <span slot="title">Agendamento de Cliente</span>

    <span slot="message">Preencha todas as informações</span>

    <div slot="body">
      <div class="row">
        <q-select
          class="col-sm-12"
          v-model="schedule.service"
          float-label="Serviço"
          filter autofocus-filter filter-placeholder="Buscar..."
          :options="servicesOptions"
        />

        <q-select
          class="col-sm-12"
          v-model="schedule.barber"
          float-label="Barbeiro"
          filter autofocus-filter filter-placeholder="Buscar..."
          :options="barbersOptions"
        />

        <q-select
          class="col-sm-12"
          v-model="schedule.client"
          float-label="Cliente"
          filter autofocus-filter filter-placeholder="Buscar..."
          :options="clientsOptions"
        />

        <q-field class="col-sm-12">
          <q-datetime color="teal" :default-value="schedule.time" v-model="schedule.time" type="datetime" />
        </q-field>
      </div>
      <q-inner-loading :visible="visible">
        <q-spinner-gears size="50px" color="teal"></q-spinner-gears>
      </q-inner-loading>
    </div>

    <template slot="buttons" slot-scope="props" :visible="!visible">
      <div class="q-pb-sm">
        <q-btn color="teal" label="Cancelar" @click="cancel()" />
        <q-btn color="green" label="Agendar" @click="addSchedule()" />
      </div>
    </template>
  </q-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import db from 'src/firestore'

export default {
  data () {
    return {
      schedule: {
        time: new Date().getTime(),
        client: '',
        barber: '',
        service: 0,
        finalized: false
      },
      dialog: true,
      clientsOptions: [],
      barbersOptions: [],
      servicesOptions: [],
      visible: false
    }
  },
  computed: {
    ...mapGetters('application', [
      'getClients',
      'getBarbers',
      'getServices',
      'getSchedules'
    ])
  },
  mounted () {
    this.getStart()
  },
  methods: {
    ...mapActions('application', [
      'toggleDialog',
      'setSchedules'
    ]),
    cancel () {
      this.dialog = false
      this.toggleDialog(this.dialog)
      this.$emit('cancelmodal')
    },

    addSchedule () {
      const vm = this
      console.log(new Date(vm.schedule.time).getTime())
      if (new Date(vm.schedule.time).getTime() < new Date().getTime()) {
        return vm.$q.notify('A data e hora do agendamento não pode ser menor que a data e hora atual')
      }
      if (vm.validateInputs()) {
        vm.visible = true
        vm.$emit('toggle-loading', true)
        db.pushSchedule(vm.schedule).then(res => {
          vm.dialog = false
          vm.schedule.id = res.id
          vm.toggleDialog(vm.dialog)
          vm.$emit('toggle-loading', false)
          vm.$q.notify({
            message: res.message,
            timeout: 5000,
            type: 'positive',
            color: 'positive',
            icon: 'done_all',
            position: 'bottom',
            actions: [{ label: 'Fechar', icon: 'close', noDismiss: true }]
          })
          const { getSchedules } = vm
          getSchedules.push(vm.schedule)
          this.setSchedules(getSchedules)
          vm.visible = false
        })
      } else {
        vm.$q.notify({
          message: 'Por favor informe todos os campos',
          timeout: 5000,
          type: 'warning',
          color: 'warning',
          icon: 'warning',
          position: 'bottom',
          actions: [{ label: 'Fechar', icon: 'close', noDismiss: true }]
        })
      }
    },

    getStart () {
      this.clientsOptions = this.getClients
        .sort((a, b) => { return a.name > b.name })
        .map((client) => {
          return {
            label: client.name,
            value: {
              id: client.id,
              name: client.name
            }
          }
        })
      this.servicesOptions = this.getServices
        .sort((a, b) => { return a.name > b.name })
        .map((service) => {
          return {
            label: service.name,
            value: {
              id: service.id,
              name: service.name,
              price: service.price
            }
          }
        })
      this.barbersOptions = this.getBarbers
        .sort((a, b) => { return a.name > b.name })
        .map((barber) => {
          return {
            label: barber.name,
            value: {
              id: barber.id,
              name: barber.name
            }
          }
        })
    },

    validateInputs () {
      return (
        this.schedule.time &&
        this.schedule.barber &&
        this.schedule.client &&
        this.schedule.service
      )
    }
  }
}
</script>
