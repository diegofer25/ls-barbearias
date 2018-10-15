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
              <q-btn @click.stop="pickDate" color="teal" :loading="pickingDate" :round="pickingDate">
                Data do relatório: {{ selectedDate.toLocaleDateString() }}
              </q-btn>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            Total no mes: {{ mounthTotal }}
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
      datepicker: false,
      mounthTotal: 0
    }
  },
  mounted () {
    this.calculate()
  },
  methods: {
    calculate () {
      this.calcMounthTotal()
    },

    selectDate () {
      if (this.compareStringDate(this.selectedDate) !== this.compareStringDate(this.date)) {
        this.selectedDate = this.date
        this.calculate()
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

    compareStringDate (date, format) {
      const d = new Date(date)
      if (format === 'xx/xxxx') {
        return d.getMonth() + '/' + d.getFullYear()
      } else {
        return d.toLocaleDateString()
      }
    },

    calcMounthTotal () {
      const vm = this
      vm.mounthTotal = vm.getPayments.filter(payment => {
        return vm.compareStringDate(payment.timestamp, 'xx/xxxx') === vm.compareStringDate(vm.selectedDate, 'xx/xxxx')
      })
        .reduce((total, payment) => {
          return total + payment.service.price
        }, 0)
    }
  }
}
</script>
