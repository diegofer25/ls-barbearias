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
              <q-tab default slot="title" name="tab-3" label="Mensal" icon="calendar_today"/>

              <q-tab-pane name="tab-1">
                <div class="row">
                  <div class="col-12 q-mb-md">
                    <payments-chart
                      v-if="refreshChart"
                      :payments="filterDaily()"
                      :date="selectedDate"
                      exportTitle="Diário"
                      :textTitle="formatTextTitle('Diário')"
                      :referer="'do dia ' + dateToString(selectedDate, 'xx/xx/xxxx')"
                    />
                  </div>
                  <div class="col-12 q-mb-md">
                    <services-chart
                      v-if="refreshChart"
                      :payments="filterDaily()"
                      :date="selectedDate"
                      exportTitle="Serviços"
                      textTitle="Serviços"
                    />
                  </div>
                </div>
              </q-tab-pane>
              <q-tab-pane name="tab-2">
                <div class="row">
                  <div class="col-12 q-mb-md">
                    <payments-chart
                      v-if="refreshChart"
                      :payments="filterWeek()"
                      :date="selectedDate"
                      exportTitle="Semanal"
                      :textTitle="formatTextTitle('Semanal')"
                      :referer="'dos dias ' + endOfMounth ? (days - 7) + ' a ' + days : dateToString(selectedDate, 'xx') + ' a ' + formatDate(parseInt(dateToString(selectedDate, 'xx')) + 6) + ' de ' + dateToString(selectedDate, 'xx/xxxx')"
                    />
                  </div>
                  <div class="col-12 q-mb-md">
                    <services-chart
                      v-if="refreshChart"
                      :payments="filterWeek()"
                      :date="selectedDate"
                      exportTitle="Serviços"
                      textTitle="Serviços"
                    />
                  </div>
                </div>
              </q-tab-pane>
              <q-tab-pane name="tab-3">
                <div class="row">
                  <div class="col-12 q-mb-md">
                    <payments-chart
                      v-if="refreshChart"
                      :payments="filterMounth()"
                      :date="selectedDate"
                      exportTitle="Mensal"
                      :textTitle="formatTextTitle()"
                      :referer="'do mes ' + dateToString(selectedDate, 'xx/xxxx')"
                    />
                  </div>
                  <div class="col-12 q-mb-md">
                    <services-chart
                      v-if="refreshChart"
                      :payments="filterMounth()"
                      :date="selectedDate"
                      exportTitle="Serviços"
                      textTitle="Serviços"
                    />
                  </div>
                  <div class="col-12 q-mb-md">
                    <expenses-chart
                      v-if="refreshChart"
                      :expenses="getExpenses"
                      :date="selectedDate"
                      exportTitle="Despesas"
                      textTitle="Despesas"
                    />
                  </div>
                </div>
              </q-tab-pane>
              <q-inner-loading :visible="pickingDate">
                <q-spinner-facebook size="100px" color="teal"></q-spinner-facebook>
              </q-inner-loading>
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
          <q-datetime-picker v-model="date" type="date" color="teal"/>
        </div>
      </div>
      <div class="row justify-around">
        <q-btn class="q-my-sm" outline color="negative" @click.stop="cancelPick">CANCELAR</q-btn>
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
    ]),
    days () {
      return new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + 1, 0).getDate()
    },
    endOfMounth () {
      return (new Date(this.selectedDate).getDate() + 7) > this.days
    }
  },
  data () {
    return {
      date: new Date(),
      selectedDate: new Date(),
      pickingDate: false,
      datepicker: false,
      refreshChart: true
    }
  },
  methods: {
    selectDate () {
      if (this.dateToString(this.selectedDate, 'xx/xx/xxxx') !== this.dateToString(this.date, 'xx/xx/xxxx')) {
        this.selectedDate = this.date
        this.refreshChart = false
        setTimeout(() => {
          this.refreshChart = true
        }, 100)
      } else {
        this.date = this.selectedDate
      }
      this.datepicker = !this.datepicker
    },

    pickDate () {
      this.datepicker = !this.datepicker
      this.pickingDate = true
    },

    cancelPick () {
      this.date = this.selectedDate
      this.datepicker = false
      this.pickingDate = false
    },

    dateToString (date, format) {
      const d = new Date(date), vm = this
      if (format === 'xx/xxxx') return vm.formatDate(d.getMonth() + 1) + '/' + d.getFullYear()
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
      return parseFloat(list.reduce((total, payment) => {
        return total + payment.service.price
      }, 0.0)).toFixed(2)
    },

    filterWeek () {
      const vm = this
      return vm.getPayments.filter(payment => {
        return (vm.dateToString(payment.timestamp, 'xx/xxxx') === vm.dateToString(vm.selectedDate, 'xx/xxxx') &&
        (parseInt(vm.dateToString(payment.timestamp, 'xx')) >= parseInt(vm.dateToString(vm.selectedDate, 'xx')) &&
        parseInt(vm.dateToString(payment.timestamp, 'xx')) < parseInt(vm.dateToString(vm.selectedDate, 'xx')) + 7)) ||
        (vm.endOfMounth ? parseInt(vm.dateToString(payment.timestamp, 'xx')) >= this.days - 7 : false)
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
    },

    formatTextTitle (date) {
      const vue = this
      if (date === 'Semanal') {
        return `Total da semana referentes os dias
          ${vue.endOfMounth ? (vue.days - 7) + ' a ' + vue.days : vue.dateToString(vue.selectedDate, 'xx') + ' a ' + vue.formatDate(parseInt(vue.dateToString(vue.selectedDate, 'xx')) + 6) + ' de ' + vue.mounths[parseFloat(vue.dateToString(vue.selectedDate))]}:
          R$ ${vue.sumPaymentsList(vue.filterWeek())}`
      } else if (date === 'Diário') {
        return `Total do dia ${vue.dateToString(vue.selectedDate, 'xx/xx/xxxx')}: R$ ${vue.sumPaymentsList(vue.filterDaily())}`
      } else {
        return `Total do mes de ${vue.mounths[parseFloat(vue.dateToString(vue.selectedDate))]}: R$ ${vue.sumPaymentsList(vue.filterMounth())}`
      }
    }
  },

  components: {
    'payments-chart': dashboards.payments,
    'expenses-chart': dashboards.expenses,
    'services-chart': dashboards.services
  }
}
</script>
