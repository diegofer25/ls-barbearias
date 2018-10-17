<template>
  <q-page padding>
    <div class='row'>
      <div class='col-12'>
        <div class='row justify-center q-mb-md'>
          <span class='q-display-2 text-weight-light' style="font-family: 'Fredericka the Great', cursive;">Relatórios</span>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="row justify-end">
              <q-btn @click.stop="pickDate" color="teal" :loading="pickingDate" :round="pickingDate" outline>
                Data do relatório: {{ selectedDate.toLocaleDateString() }}
              </q-btn>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <q-tabs color="teal">
              <q-tab slot="title" name="tab-1" label="Diário" icon="today" />
              <q-tab slot="title" name="tab-2" label="Semanal" icon="date_range" />
              <q-tab default slot="title" name="tab-3" label="Mensál" icon="calendar_today"/>

              <q-tab-pane name="tab-1">
                Total de hoje {{ dateToString(selectedDate, 'xx/xx') }}: R$ {{ sumPaymentsList(filterDaily()) }}
              </q-tab-pane>
              <q-tab-pane name="tab-2">
                Total da semana referentes os dias
                {{ dateToString(selectedDate, 'xx') + ' e ' + formatDate(parseInt(dateToString(selectedDate, 'xx')) + 6)  }}:
                R$ {{ sumPaymentsList(filterWeek()) }}
              </q-tab-pane>
              <q-tab-pane name="tab-3">
                Total do mes de {{ mounths[parseInt(dateToString(selectedDate))] }}: R$ {{ sumPaymentsList(filterMounth()) }}
                <mounthsales :payments="filterMounth"/>
              </q-tab-pane>
            </q-tabs>
          </div>
        </div>
      </div>
    </div>
    <q-modal
      v-model="datepicker"
      position="right"
      @hide="cancelPick"
      @escape-key="cancelPick"
    >
      <div class="row">
        <div class="col-12">
          <q-datetime-picker v-model="date" type="date" @change="datepicker = !datepicker" color="teal"/>
        </div>
      </div>
      <div class="row justify-around">
        <q-btn class="q-my-sm" outline color="negative" @click.stop="datepicker = !datepicker">CANCELAR</q-btn>
        <q-btn class="q-my-sm" color="positive" @click.stop="selectDate">CONFIRMAR</q-btn>
      </div>
    </q-modal>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'
import dashboards from 'src/components/dashboards'

export default {
  name: 'Reports',
  computed: {
    ...mapGetters('application', [
      'mounths',
      'getClients',
      'getBarbers',
      'getServices',
      'getPayments',
      'getSchedules',
      'getExpenses'
    ])
  },
  data () {
    return {
      date: new Date(),
      selectedDate: new Date(),
      pickingDate: false,
      datepicker: false
    }
  },
  methods: {
    selectDate () {
      if (this.dateToString(this.selectedDate) !== this.dateToString(this.date)) {
        this.selectedDate = this.date
      } else {
        this.selectedDate = this.date
      }
      this.datepicker = !this.datepicker
    },

    pickDate () {
      this.datepicker = !this.datepicker
      this.pickingDate = true
    },

    cancelPick () {
      this.datepicker = false
      this.pickingDate = false
    },

    dateToString (date, format) {
      const d = new Date(date), vm = this
      if (format === 'xx/xxxx') return vm.formatDate(d.getMonth()) + '/' + d.getFullYear()
      else if (format === 'xx/xx') return vm.formatDate(d.getDate()) + '/' + vm.formatDate(d.getMonth() + 1)
      else if (format === 'xx') return vm.formatDate(d.getDate())
      else if (format === 'xxxx') return d.getFullYear()
      else if (format === 'xx/xx/xxxx') return d.toLocaleDateString()
      else return vm.formatDate(d.getMonth())
    },

    formatDate (mounth) {
      return mounth < 10 ? '0' + mounth : mounth
    },

    sumPaymentsList (list) {
      return list.reduce((total, payment) => {
        return total + payment.service.price
      }, 0)
    },

    filterWeek () {
      const vm = this
      return vm.getPayments.filter(payment => {
        return vm.dateToString(payment.timestamp, 'xx/xxxx') === vm.dateToString(vm.selectedDate, 'xx/xxxx') &&
        vm.dateToString(payment.timestamp, 'xx') >= vm.dateToString(vm.selectedDate, 'xx') &&
        vm.dateToString(payment.timestamp, 'xx') < (vm.dateToString(vm.selectedDate, 'xx') + 7)
      })
    },

    filterDaily () {
      const vm = this
      return vm.getPayments.filter(payment => {
        return vm.dateToString(payment.timestamp, 'xx/xx/xxxx') === vm.dateToString(vm.selectedDate, 'xx/xx/xxxx')
      })
    },

    filterMounth () {
      const vm = this
      return vm.getPayments.filter(payment => {
        return vm.dateToString(payment.timestamp, 'xx/xxxx') === vm.dateToString(vm.selectedDate, 'xx/xxxx')
      })
    }
  },
  components: {
    mounthsales: dashboards.mounthSales
  }
}
</script>
