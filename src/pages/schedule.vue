<template>
  <q-page padding>
    <q-page-sticky :position="$q.platform.is.mobile ? 'bottom-right' : 'top-left'" :offset="[20, 20]" style="z-index: 1">
      <q-btn
        push
        color="teal"
        @click="opened = true"
        size="md"
        icon="schedule"
      ></q-btn>
    </q-page-sticky>
    <div class='row'>
      <div class='col-12'>
        <div class='row justify-center q-mb-md'>
          <span class='q-display-2 text-weight-light'>Agenda</span>
        </div>
        <div class="row">
          <q-btn
            class="col-sm-12 col-md-8 offset-md-2 animated fadeIn q-my-md"
            color="teal"
            @click="openModal"
            size="lg"
            icon="schedule"
          ><span class="q-pa-md">Agendar Cliente</span></q-btn>
        </div>
        <div class="row" v-if="scheduling">
          <add-schedule
            @cancelmodal="closeModal()"
            @toggle-loading="changeLoading"
          />
        </div>
        <div class='row q-mt-lg' v-if="!loading">
          <div class="col-12 text-center">
            <span class="q-title text-weight-light">Agendamentos do dia {{ getDate(date) }}</span>
          </div>
          <q-tabs class="col-sm-12 col-md-8 offset-md-2 animated fadeIn q-my-md" color="teal-4">
            <q-tab
              label="Agendados"
              default :count="filtered(getSchedules).length"
              slot="title" name="tab-1" icon="watch_later"
              :disable="filtered(getSchedules).length === 0"
            />
            <q-tab
              label="Concluídos"
              slot="title" :count="filtered(getSchedules, 'finalized').length"
              name="tab-2" icon="done" :disable="filtered(getSchedules, 'finalized').length === 0"
            />

            <q-tab-pane name="tab-1" class="row">
              <div v-if="filtered(getSchedules).length" class="col-12">
                <div class="row q-mb-sm" v-for="schedule of filtered(getSchedules)" :key="schedule.id">
                  <q-card inline class="col-12">
                    <q-card-title>
                      {{ schedule.client.name }}
                      <div slot="right" class="row items-center">
                        {{ new Date(schedule.time).toLocaleString() }}
                      </div>
                    </q-card-title>
                    <q-card-main>
                      {{ schedule.service.name }} - R$ {{ schedule.service.price.toFixed(2).toLocaleString() }} <br>
                      <p class="text-faded">
                        Com {{ schedule.barber.name }}
                      </p>
                    </q-card-main>
                    <q-card-separator />
                    <q-card-actions>
                      <q-btn flat color="secondary" label="Adiar" @click.stop="openDialog(schedule)"/>
                      <q-btn flat color="negative" label="Desmarcar" @click.stop="confirmDelete(schedule)"/>
                    </q-card-actions>
                  </q-card>
                </div>
              </div>
              <div v-else class="col-12 text-center">
                Não há clientes agendados nesta data
              </div>
            </q-tab-pane>
            <q-tab-pane name="tab-2">
              <div v-if="filtered(getSchedules, 'finalized').length" class="col-12">
                <div class="row q-mb-sm" v-for="schedule of filtered(getSchedules, 'finalized')" :key="schedule.id">
                  <q-card inline class="col-12">
                    <q-card-title>
                      {{ schedule.client.name }}
                      <div slot="right" class="row items-center">
                        {{ new Date(schedule.time).toLocaleString() }}
                      </div>
                    </q-card-title>
                    <q-card-main>
                      {{ schedule.service.name }} - R$ {{ schedule.service.price.toFixed(2).toLocaleString() }} <br>
                      <p class="text-faded">
                        Com {{ schedule.barber.name }}
                      </p>
                    </q-card-main>
                    <q-card-separator />
                  </q-card>
                </div>
              </div>
            </q-tab-pane>
          </q-tabs>
        </div>
        <q-inner-loading :visible="loading">
          <q-spinner-gears size="50px" color="teal"></q-spinner-gears>
        </q-inner-loading>
      </div>
    </div>
    <q-modal v-model="opened">
      <div class="row gutter-sm">
        <q-datetime-picker
        class="col-12"
        color="teal"
        v-model="date"
        type="date" />
      </div>
      <div class="row q-pa-sm">
        <q-btn
          class="col-sm-12 col-md-4 offset-md-1 q-pa-md"
          color="teal"
          @click="seeSchedule()"
          label="OK"
        />
        <q-btn
          flat
          class="col-sm-12 col-md-4 offset-md-1 q-pa-md"
          color="teal"
          @click="opened = false"
          label="CANCELAR"
        />
      </div>
    </q-modal>
    <q-dialog
      v-model="pullOffing"
      @ok="putOff"
      @cancel="cancelPutOff"
      @hide="cancelPutOff"
    >
      <span slot="title">Adiar Agendamento</span>
      <span slot="message">Escolha um novo horário para o cliente</span>

      <div slot="body">
        <q-datetime
          v-model="newDate"
          color="teal" type="datetime"
        />
      </div>

      <template slot="buttons" slot-scope="props">
        <q-btn color="negative" flat label="Cancelar" @click.stop="props.cancel" />
        <q-btn color="teal" label="Confirmar" @click.stop="putOff(props.ok)" />
      </template>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import db from 'src/firestore'
import addSchedule from 'src/components/organism/addSchedule'

export default {
  name: 'Schedule',
  computed: {
    ...mapGetters('application', [
      'getSchedules'
    ])
  },
  data () {
    return {
      date: new Date().getTime(),
      opened: false,
      scheduling: false,
      loading: false,
      pullOffing: false,
      newDate: new Date().getTime(),
      pullOffingSchedule: ''
    }
  },
  methods: {
    ...mapActions('application', [
      'toggleDialog',
      'setSchedules'
    ]),

    seeSchedule () {
      this.opened = false
    },

    cancelPutOff () {
      const vm = this
      vm.newDate = new Date().getTime()
      vm.pullOffing = false
      vm.pullOffingSchedule = ''
    },

    putOff () {
      const vm = this
      vm.loading = true
      vm.pullOffing = false
      vm.pullOffingSchedule.time = vm.newDate
      db.editSchedule(vm.pullOffingSchedule)
        .then((res) => {
          this.$q.notify({
            message: 'Agendamento adiado com sucesso',
            timeout: 5000,
            type: 'positive',
            color: 'positive',
            icon: 'done_all',
            position: 'top',
            actions: [{ label: 'Fechar', icon: 'close', noDismiss: true }]
          })
          vm.setSchedules(vm.getSchedules.map(schedule => {
            return schedule.id === vm.pullOffingSchedule.id ? vm.pullOffingSchedule : schedule
          }))
          vm.loading = false
          vm.selected = []
        })
    },

    openDialog (schedule) {
      const vm = this
      vm.newDate = new Date(schedule.time).getTime()
      vm.pullOffing = true
      vm.pullOffingSchedule = schedule
    },

    confirmDelete (schedule) {
      const vm = this
      this.$q.dialog({
        title: 'Confirmação',
        message: 'Deseja mesmo desmarcar este agendamento?',
        ok: {
          label: 'Sim, desmarcar',
          color: 'positive'
        },
        cancel: {
          label: 'Cancelar',
          color: 'negative'
        }
      }).then(() => {
        vm.loading = true
        db.deleteSchedule(schedule.id)
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
            vm.setSchedules(vm.getSchedules.filter((s) => {
              return s.id !== schedule.id
            }))
            vm.loading = false
            vm.selected = []
          })
      }).catch(() => {})
    },

    changeLoading (payload) {
      this.loading = payload
    },

    filtered (list, status) {
      const vm = this
      if (status === 'finalized') {
        return list.filter(schedule => {
          return vm.getDate(schedule.time) === vm.getDate(vm.date) && schedule.finalized
        }).sort((a, b) => a.time - b.time)
      }
      return list.filter(schedule => {
        return vm.getDate(schedule.time) === vm.getDate(vm.date) && !schedule.finalized
      }).sort((a, b) => a.time - b.time)
    },

    closeModal () {
      this.scheduling = false
    },

    openModal () {
      this.scheduling = true
    },

    getDate (timestamp) {
      return new Date(timestamp).toLocaleDateString()
    }
  },
  components: {
    addSchedule
  }
}
</script>
