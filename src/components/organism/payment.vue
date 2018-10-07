<template>
  <div class="col-sm-12 col-md-8 offset-md-2 animated fadeIn">
    <q-stepper v-model="currentStep">
      <q-step  title="Forma" subtitle="de Pagamento" name="first">

        <div class="row">
          <q-select
            class="col-sm-12 col-md-6 offset-md-3 col-xl-4 offset-xl-4 q-mb-md"
            v-model="payment.type"
            float-label="Qual a forma de pagamento?"
            :options="paymentOptions"
          />
        </div>

        <div v-if="payment.type">
          <div class="row animated fadeIn" v-if="payment.type.id !== 'money'">
            <q-select
              class="col-sm-12 col-md-6 offset-md-3 col-xl-4 offset-xl-4 q-mb-md"
              v-model="payment.type.flag"
              float-label="Qual a bandeira do cartão?"
              :options="flagOptions"
            />
          </div>
        </div>

        <q-stepper-navigation>
          <q-btn
            class="animated fadeInRight"
            color="negative" flat
            @click.stop="$emit('onfinish', '')"
            label="Cancelar"
          />
          <div v-if="payment.type" class="q-ml-xs">
            <q-btn
              v-if="payment.type.id === 'money'"
              class="animated fadeInRight"
              color="teal"
              @click="currentStep = 'second'"
              label="Avançar"
            />
            <q-btn
              v-if="payment.type.id !== 'money' && payment.type.flag"
              class="animated fadeInRight"
              color="teal"
              @click="currentStep = 'second'"
              label="Avançar"
            />
          </div>
        </q-stepper-navigation>
      </q-step>

      <q-step  title="Dados" subtitle="de pagamento" name="second">

        <div class="row">
          <q-select
            class="col-sm-12 col-md-6 offset-md-3 q-mb-md"
            v-model="payment.service"
            float-label="Serviço" :disable="payment.schedule !== ''"
            filter filter-placeholder="Buscar..."
            :options="servicesOptions"
          />

          <q-select
            class="col-sm-12 col-md-6 offset-md-3 q-mb-md"
            v-model="payment.barber"
            float-label="Barbeiro" :disable="payment.schedule !== ''"
            filter filter-placeholder="Buscar..."
            :options="barbersOptions"
          />

          <q-select
            class="col-sm-12 col-md-6 offset-md-3 q-mb-md"
            v-model="payment.client"
            float-label="Cliente" :disable="payment.schedule !== ''"
            filter filter-placeholder="Buscar..."
            :options="clientsOptions"
          />
        </div>

        <div v-if="schedulesOptions.length">
          <div class="row text-center" v-if="!payment.schedule">
            <div class="col-12">
              <span class="q-title">OU</span>
            </div>
          </div>

          <div class="row">
            <q-select
              v-model="payment.schedule"
              class="col-sm-12 col-md-6 offset-md-3 q-mb-md"
              @input="setPaymentBySchedule(payment.schedule)"
              float-label="Agendamento" :disable="payment.service !== '' && payment.barber !== '' && payment.client !== ''"
              filter filter-placeholder="Buscar..."
              :options="schedulesOptions"
            />
          </div>
        </div>

        <q-stepper-navigation>
          <q-btn
            color="teal" flat
            class="animated fadeInRight"
            @click="back('first')"
            label="Voltar"
          />
          <q-btn
            v-if="checkPayment(payment)"
            class="q-ml-xs animated fadeInRight"
            color="teal"
            @click="currentStep = 'third'"
            label="Confirmar"
          />
        </q-stepper-navigation>
      </q-step>

      <q-step  title="Confirmação" subtitle="de pagamento" name="third">
        <div class="row">
          <p class="col-12">
            Cliente <strong>{{ payment.client.name }}</strong> <br>
            Pagará em <strong>{{ payment.type.name + showFlag() }}</strong> <br>
            Pelo serviço de <strong>{{ payment.service.name }}</strong> <br>
            Realizado pelo barbeiro <strong>{{ payment.barber.name }}</strong>
          </p>
        </div>
        <div class="row text-right" v-if="payment.service.price">
          <div class="col-12">
            <span class="q-title">Total a pagar:</span>
            R$ {{ payment.service.price.toFixed(2).toLocaleString() }}
          </div>
        </div>
        <div class="row text-right" v-if="payment.type.id === 'money'">
          <q-field class="col-md-4 offset-md-8 col-sm-6 offset-sm-6 col-xs-8 offset-xs-4">
            <q-input
              type="number"
              v-model="payment.type.received"
              float-label="Dinheiro Recebido"
              placeholder="00"
              numeric-keyboard-toggle prefix="R$ " align="right"
            />
          </q-field>
        </div>
        <div class="row text-right" v-if="payment.type.received >= payment.service.price">
          <div class="col-12">
            <span class="q-title">Troco:</span>
            R$ {{ parseFloat(payment.type.received - payment.service.price).toFixed(2).toLocaleString() }}
          </div>
        </div>
        <q-stepper-navigation>
          <q-btn
            color="teal" flat
            class="animated fadeInRight"
            @click="currentStep = 'second'"
            label="Voltar"
          />
          <q-btn
            v-if="payment.type.id !== 'money'"
            class="q-ml-xs animated fadeInRight"
            color="positive"
            @click="pushPayment"
            label="Finalizar"
          />
          <q-btn
            v-if="payment.type.received >= payment.service.price"
            class="q-ml-xs animated fadeInRight"
            color="positive"
            @click="pushPayment"
            label="Finalizar"
          />
        </q-stepper-navigation>
      </q-step>
      <q-inner-loading :visible="loading">
        <q-spinner-gears size="50px" color="teal"></q-spinner-gears>
      </q-inner-loading>
    </q-stepper>
  </div>
</template>

<script>
import db from 'src/firestore'
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters('application', [
      'getClients',
      'getServices',
      'getBarbers',
      'getPayments',
      'getSchedules'
    ])
  },
  data () {
    return {
      loading: false,
      payment: {
        type: '',
        service: '',
        barber: '',
        client: '',
        schedule: ''
      },
      paymentOptions: [{
        label: 'Débito',
        icon: 'credit_card',
        value: {
          id: 'debit',
          name: 'Débito'
        }
      }, {
        label: 'Crédito',
        icon: 'credit_card',
        value: {
          id: 'credit',
          name: 'Crédito'
        }
      }, {
        label: 'Dinheiro',
        icon: 'local_atm',
        value: {
          id: 'money',
          name: 'Dinheiro'
        }
      }],
      flagOptions: [{
        label: 'Visa',
        value: 'Visa'
      }, {
        label: 'Mastercard',
        value: 'Mastercard'
      }, {
        label: 'Elo',
        value: 'Elo'
      }, {
        label: 'American Express',
        value: 'American Express'
      }, {
        label: 'Hipercard',
        value: 'Hipercard'
      }, {
        label: 'Diners Club',
        value: 'Diners Club'
      }, {
        label: 'Sorocred',
        value: 'Sorocred'
      }],
      clientsOptions: [],
      barbersOptions: [],
      servicesOptions: [],
      schedulesOptions: [],
      currentStep: 'first'
    }
  },
  mounted () {
    this.getStart()
  },
  methods: {
    ...mapActions('application', [
      'setPayments',
      'setSchedules'
    ]),
    checkPayment () {
      const { service, barber, client } = this.payment
      return service.id && barber.id && client.id
    },

    back (stepper) {
      if (stepper === 'first') {
        this.payment.client = ''
        this.payment.barber = ''
        this.payment.service = ''
        this.payment.schedule = ''
      }
      this.currentStep = stepper
    },

    setPaymentBySchedule (schedule) {
      this.payment.client = schedule.client
      this.payment.barber = schedule.barber
      this.payment.service = schedule.service
    },

    showFlag () {
      if (this.payment.type.id !== 'money') return ' ' + this.payment.type.flag
      else return ''
    },

    pushPayment () {
      const vm = this
      vm.loading = true
      vm.payment.timestamp = new Date().getTime()
      if (vm.payment.schedule) vm.payment.schedule.finalized = true
      db.pushPayment(vm.payment)
        .then((res) => {
          vm.payment.id = res.id
          vm.lastPayment = vm.payment
          this.$q.notify({
            message: res.message,
            timeout: 5000,
            type: 'positive',
            color: 'positive',
            icon: 'done_all',
            position: 'top',
            actions: [{ label: 'Fechar', icon: 'close', noDismiss: true }]
          })
          const { getPayments } = vm
          getPayments.push(vm.payment)
          vm.setPayments(getPayments)
          if (vm.payment.schedule) {
            db.editSchedule(vm.payment.schedule).then((res) => {
              vm.setSchedules(vm.getSchedules.map((schedule) => {
                return schedule.id === vm.payment.schedule.id ? vm.payment.schedule : schedule
              }))
              vm.loading = false
              vm.$emit('onfinish', vm.payment)
            })
          } else {
            vm.loading = false
            vm.$emit('onfinish', vm.payment)
          }
        })
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
      this.schedulesOptions = this.getSchedules
        .filter(schedule => {
          return new Date(schedule.time).toLocaleDateString() === new Date().toLocaleDateString() && !schedule.finalized
        })
        .sort((a, b) => { return a.time > b.time })
        .map((schedule) => {
          return {
            label: schedule.client.name + ' - ' + new Date(schedule.time).toLocaleString(),
            value: schedule
          }
        })
    }
  }
}
</script>
